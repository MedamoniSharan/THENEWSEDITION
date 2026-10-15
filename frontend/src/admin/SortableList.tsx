import type { ReactNode } from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableListProps<T> {
  items: T[]
  getId: (item: T) => string
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
  className?: string
}

function Row({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-stretch gap-1 rounded-xl bg-white ring-1 ring-ink/10 ${isDragging ? 'relative z-10 shadow-xl ring-accent/40' : ''}`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label="Drag to reorder"
        title="Drag to reorder (or focus and use the arrow keys)"
        className="flex w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-l-xl text-ink/30 hover:bg-ink/5 hover:text-ink/60 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <div className="min-w-0 flex-1 py-2 pr-2">{children}</div>
    </li>
  )
}

/** Vertical list reordered by dragging the handle, with keyboard support (space, arrows, space). */
export default function SortableList<T>({ items, getId, onReorder, renderItem, className = '' }: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const ids = items.map(getId)

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    onReorder(arrayMove(items, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className={`space-y-2 ${className}`}>
          {items.map((item, i) => (
            <Row key={ids[i]} id={ids[i]}>
              {renderItem(item, i)}
            </Row>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
