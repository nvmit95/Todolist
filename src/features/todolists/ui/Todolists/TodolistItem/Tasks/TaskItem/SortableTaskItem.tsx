import { TaskItem } from "./TaskItem"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import styles from "./SortableTaskItem.module.css"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const SortableTaskItem = ({ task, todolist }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      className={styles.root}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: "relative",
      }}
      {...attributes}
      {...listeners}
    >
      <TaskItem task={task} todolist={todolist} isDragging={isDragging} />
    </div>
  )
}
