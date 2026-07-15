import { EditableSpan } from "@/common/components"
import {
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} from "@/features/todolists/api/todolistsApi"
import { useTaskProgress } from "@/features/todolists/lib/hooks/useTaskProgress"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import IconButton from "@mui/material/IconButton"
import { TaskProgress } from "../Tasks/TaskProgress/TaskProgress"
import styles from "./TodolistTitle.module.css"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title } = todolist

  const [removeTodolist] = useRemoveTodolistMutation()
  const [updateTodolistTitle] = useUpdateTodolistTitleMutation()
  const { completedCount, totalCount, percent } = useTaskProgress(id)

  const deleteTodolist = async () => removeTodolist(id)

  const changeTodolistTitle = (title: string) => {
    updateTodolistTitle({ id, title })
  }

  return (
    <div className={`${styles.container} todolist-title-divider`}>
      <div className={styles.topRow}>
        <h3>
          <EditableSpan value={title} onChange={changeTodolistTitle} />
        </h3>
        <IconButton
          onClick={deleteTodolist}
          size="small"
          className={`${styles.deleteBtn} todolist-delete-btn`}
          aria-label="Delete list"
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </div>
      <TaskProgress
        completedCount={completedCount}
        totalCount={totalCount}
        percent={percent}
      />
    </div>
  )
}
