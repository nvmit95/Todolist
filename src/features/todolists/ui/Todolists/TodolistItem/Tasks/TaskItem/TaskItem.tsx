import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import {
  useRemoveTaskMutation,
  useUpdateTaskMutation,
} from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { DomainTodolist } from "@/features/todolists/lib/types"
import { createTaskModel } from "@/features/todolists/lib/utils"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import type { ChangeEvent, PointerEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
  isDragging?: boolean
}

const stopDrag = (e: PointerEvent) => {
  e.stopPropagation()
}

export const TaskItem = ({ task, todolist, isDragging }: Props) => {
  const [removeTask] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const deleteTask = () => {
    removeTask({ todolistId: todolist.id, taskId: task.id })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked
      ? TaskStatus.Completed
      : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const changeTaskTitle = (title: string) => {
    const model = createTaskModel(task, { title })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <Box
      sx={getListItemSx(isTaskCompleted, isDragging)}
      className="task-item"
    >
      <div className="task-item__content">
        <Checkbox
          checked={isTaskCompleted}
          onChange={changeTaskStatus}
          onPointerDown={stopDrag}
          size="small"
        />
        <EditableSpan
          value={task.title}
          onChange={changeTaskTitle}
          isDone={isTaskCompleted}
        />
      </div>
      <IconButton
        onClick={deleteTask}
        onPointerDown={stopDrag}
        size="small"
        className="task-item__delete todolist-delete-btn"
        aria-label="Delete task"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
