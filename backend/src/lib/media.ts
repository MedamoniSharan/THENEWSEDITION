import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import sharp from 'sharp'
import { Asset, type AssetDoc } from '../models.ts'
import { HttpError, notFound, objectId } from './http.ts'

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
/** Responsive renditions generated for every uploaded image; the largest also caps the stored size. */
const IMAGE_WIDTHS = [480, 960, 1600]
const IMMUTABLE = 'public, max-age=31536000, immutable'

let bucket: mongoose.mongo.GridFSBucket | undefined
function media() {
  bucket ??= new mongoose.mongo.GridFSBucket(mongoose.connection.db!, { bucketName: 'media' })
  return bucket
}

async function putFile(buffer: Buffer, filename: string, contentType: string) {
  const upload = media().openUploadStream(filename, { metadata: { contentType } })
  await pipeline(Readable.from([buffer]), upload)
  return upload.id
}

export const assetUrl = (id: unknown) => `/media/${String(id)}`

export async function storeUpload(file: Express.Multer.File) {
  if (IMAGE_TYPES.includes(file.mimetype)) return storeImage(file)
  if (VIDEO_TYPES.includes(file.mimetype)) return storeVideo(file)
  throw new HttpError(415, 'Upload a JPG, PNG, WebP, AVIF or GIF image, or an MP4, WebM or MOV video')
}

async function storeImage(file: Express.Multer.File) {
  const meta = await sharp(file.buffer, { limitInputPixels: 80_000_000 })
    .metadata()
    .catch(() => {
      throw new HttpError(415, 'That image could not be read')
    })
  const rotated = (meta.orientation ?? 1) >= 5
  const width = (rotated ? meta.height : meta.width) ?? 0
  const height = (rotated ? meta.width : meta.height) ?? 0
  if (!width || !height) throw new HttpError(415, 'That image could not be read')

  const largest = Math.min(width, IMAGE_WIDTHS.at(-1)!)
  const widths = [...new Set([...IMAGE_WIDTHS.filter((w) => w < largest), largest])]
  const name = file.originalname.replace(/\.[^.]+$/, '')

  const files = []
  for (const w of widths) {
    const out = await sharp(file.buffer, { limitInputPixels: 80_000_000 })
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
    files.push({ width: w, size: out.length, mime: 'image/webp', fileId: await putFile(out, `${name}-${w}.webp`, 'image/webp') })
  }

  const asset = await Asset.create({
    kind: 'image',
    filename: file.originalname,
    mime: 'image/webp',
    size: files.at(-1)!.size,
    width: largest,
    height: Math.round((height * largest) / width),
    files,
  })
  return serializeAsset(asset.toObject())
}

async function storeVideo(file: Express.Multer.File) {
  const fileId = await putFile(file.buffer, file.originalname, file.mimetype)
  const asset = await Asset.create({
    kind: 'video',
    filename: file.originalname,
    mime: file.mimetype,
    size: file.size,
    files: [{ width: 0, size: file.size, mime: file.mimetype, fileId }],
  })
  return serializeAsset(asset.toObject())
}

export function serializeAsset(asset: AssetDoc) {
  return {
    id: String(asset._id),
    url: assetUrl(asset._id),
    kind: asset.kind,
    filename: asset.filename,
    mime: asset.mime,
    size: asset.size,
    width: asset.width ?? null,
    height: asset.height ?? null,
    createdAt: asset.createdAt,
  }
}

export async function deleteAsset(id: string) {
  const asset = await Asset.findById(objectId(id)).lean()
  if (!asset) throw notFound('That file no longer exists')
  for (const f of asset.files) {
    await media().delete(f.fileId!).catch(() => undefined)
    bytes.drop(String(f.fileId))
  }
  await Asset.deleteOne({ _id: asset._id })
  assets.delete(id)
}

/** Small in-memory LRU so popular images skip the GridFS round trip. */
class ByteCache {
  private entries = new Map<string, Buffer>()
  private total = 0
  private readonly limit: number
  constructor(limit: number) {
    this.limit = limit
  }
  get(key: string) {
    const value = this.entries.get(key)
    if (value) {
      this.entries.delete(key)
      this.entries.set(key, value)
    }
    return value
  }
  set(key: string, value: Buffer) {
    this.drop(key)
    this.entries.set(key, value)
    this.total += value.length
    for (const [k, v] of this.entries) {
      if (this.total <= this.limit) break
      this.entries.delete(k)
      this.total -= v.length
    }
  }
  drop(key: string) {
    const value = this.entries.get(key)
    if (value) {
      this.entries.delete(key)
      this.total -= value.length
    }
  }
}

const bytes = new ByteCache(64 * 1024 * 1024)
const assets = new Map<string, AssetDoc>()

async function findAsset(id: string) {
  const cached = assets.get(id)
  if (cached) return cached
  const asset = (await Asset.findById(objectId(id)).lean()) as AssetDoc | null
  if (!asset) throw notFound()
  if (assets.size > 2000) assets.clear()
  assets.set(id, asset)
  return asset
}

async function readFile(fileId: mongoose.Types.ObjectId) {
  const chunks: Buffer[] = []
  for await (const chunk of media().openDownloadStream(fileId)) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

/** GET /media/:id[?w=960] — images pick the smallest rendition at least `w` wide; videos support range requests. */
export async function serveMedia(req: Request<{ id: string }>, res: Response) {
  const asset = await findAsset(req.params.id)
  const wanted = Number(req.query.w) || Infinity
  const file = asset.files.find((f) => (f.width ?? 0) >= wanted) ?? asset.files.at(-1)
  if (!file?.fileId) throw notFound()

  const etag = `"${String(file.fileId)}"`
  res.setHeader('Cache-Control', IMMUTABLE)
  res.setHeader('ETag', etag)
  res.setHeader('Content-Type', file.mime ?? asset.mime)
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  if (req.headers['if-none-match'] === etag) return res.status(304).end()

  const size = file.size ?? 0
  if (asset.kind === 'image') {
    const key = String(file.fileId)
    let buffer = bytes.get(key)
    if (!buffer) {
      buffer = await readFile(file.fileId)
      bytes.set(key, buffer)
    }
    return res.send(buffer)
  }

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
  let start = 0
  let end = size - 1
  if (range) {
    if (range[1]) {
      start = Number(range[1])
      if (range[2]) end = Math.min(Number(range[2]), size - 1)
    } else if (range[2]) {
      start = Math.max(0, size - Number(range[2]))
    }
    if (start > end || start >= size) {
      res.setHeader('Content-Range', `bytes */${size}`)
      return res.status(416).end()
    }
    res.status(206).setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
  }
  res.setHeader('Content-Length', String(end - start + 1))
  if (req.method === 'HEAD') return res.end()
  await pipeline(media().openDownloadStream(file.fileId, { start, end: end + 1 }), res).catch(() => undefined)
}
