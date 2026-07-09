import { TaskStatus } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import { Task_Count } from "@/common/constants"
import {
  tasksApi,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { createTaskModel } from "@/features/todolists/lib/utils"
import { FilterButtons } from "../FilterButtons/FilterButtons"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { useState, useEffect } from "react"
import { SortableTaskItem } from "./TaskItem/SortableTaskItem"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { TasksPagination } from "./TasksPagination/TasksPagination"
import styles from "./Tasks.module.css"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()
  const [updateTask] = useUpdateTaskMutation()

  const { data, isLoading } = useGetTasksQuery({
    id,
    params: { page },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  let filteredTasks = data?.items

  if (filter === "active") {
    filteredTasks = filteredTasks?.filter(
      (task) => task.status === TaskStatus.New,
    )
  }

  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter(
      (task) => task.status === TaskStatus.Completed,
    )
  }

  const pagesCount = Math.ceil((data?.totalCount || 0) / Task_Count)
  const isDragEnabled = filter === "all"

  useEffect(() => {
    if (page > pagesCount) {
      setPage(pagesCount || 1)
    }
  }, [pagesCount, page])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !filteredTasks || !data) return

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id)
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(filteredTasks, oldIndex, newIndex)

    const activeTask = filteredTasks[oldIndex]
    const overTask = filteredTasks[newIndex]

    dispatch(
      tasksApi.util.updateQueryData(
        "getTasks",
        { id, params: { page } },
        (draft) => {
          const ids = new Set(reordered.map((t) => t.id))
          const otherItems = draft.items.filter((t) => !ids.has(t.id))
          draft.items = [...reordered, ...otherItems]
        },
      ),
    )

    // swap order values between moved tasks
    updateTask({
      taskId: activeTask.id,
      todolistId: id,
      model: createTaskModel(activeTask, { order: overTask.order }),
    })
    updateTask({
      taskId: overTask.id,
      todolistId: id,
      model: createTaskModel(overTask, { order: activeTask.order }),
    })
  }

  const footer = (
    <div className={`${styles.footer} todolist-footer-divider`}>
      {pagesCount > 1 && (
        <TasksPagination
          totalCount={data?.totalCount || 0}
          page={page}
          setPage={setPage}
        />
      )}
      <FilterButtons todolist={todolist} />
    </div>
  )

  if (isLoading) {
    return (
      <div className={styles.tasksContainer}>
        <div className={styles.tasksBody}>
          <TasksSkeleton />
        </div>
        {footer}
      </div>
    )
  }

  if (!filteredTasks || filteredTasks.length === 0) {
    return (
      <div className={styles.tasksContainer}>
        <div className={styles.tasksBody}>
          <Box className={styles.emptyState}>
            <CheckCircleOutlineIcon
              className={`${styles.emptyIcon} todolist-empty-icon`}
            />
            <Typography variant="body2" color="text.secondary">
              {filter === "completed"
                ? "No completed tasks yet"
                : filter === "active"
                  ? "All tasks are done!"
                  : "No tasks yet — add one above"}
            </Typography>
          </Box>
        </div>
        {footer}
      </div>
    )
  }

  const taskList = (
    <div className={styles.taskList}>
      {filteredTasks.map((task) =>
        isDragEnabled ? (
          <SortableTaskItem key={task.id} task={task} todolist={todolist} />
        ) : (
          <TaskItem key={task.id} task={task} todolist={todolist} />
        ),
      )}
    </div>
  )

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.tasksBody}>
        {isDragEnabled ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {taskList}
            </SortableContext>
          </DndContext>
        ) : (
          taskList
        )}
      </div>
      {footer}
    </div>
  )
}
