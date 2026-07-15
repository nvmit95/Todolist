import { TaskStatus } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import { Task_Count } from "@/common/constants"
import {
  tasksApi,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
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

const filterTasks = (tasks: DomainTask[] | undefined, filter: DomainTodolist["filter"]) => {
  if (!tasks) return undefined
  if (filter === "active") {
    return tasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    return tasks.filter((task) => task.status === TaskStatus.Completed)
  }
  return tasks
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const isFiltered = filter !== "all"

  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()
  const [updateTask] = useUpdateTaskMutation()

  // totalCount (shares cache with page 1 / progress hook)
  const { data: metaData } = useGetTasksQuery({
    id,
    params: { page: 1 },
  })
  const totalCount = metaData?.totalCount ?? 0

  // All — серверная пагинация
  const { data: pageData, isLoading: isPageLoading } = useGetTasksQuery(
    { id, params: { page } },
    { skip: isFiltered },
  )

  // Active / Done — все задачи, фильтр и пагинация на клиенте
  const { data: allData, isLoading: isAllLoading } = useGetTasksQuery(
    { id, params: { page: 1, count: totalCount || 1 } },
    { skip: !isFiltered || totalCount === 0 },
  )

  const sourceItems = isFiltered ? allData?.items : pageData?.items
  const filteredTasks = filterTasks(sourceItems, filter) ?? []

  const paginationTotal = isFiltered ? filteredTasks.length : totalCount
  const pagesCount = Math.ceil(paginationTotal / Task_Count)

  const visibleTasks = isFiltered
    ? filteredTasks.slice((page - 1) * Task_Count, page * Task_Count)
    : filteredTasks

  const isLoading = isFiltered
    ? totalCount > 0 && isAllLoading
    : isPageLoading

  const isDragEnabled = filter === "all"

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    setPage(1)
  }, [filter])

  useEffect(() => {
    if (page > pagesCount) {
      setPage(pagesCount || 1)
    }
  }, [pagesCount, page])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !pageData) return

    const oldIndex = visibleTasks.findIndex((t) => t.id === active.id)
    const newIndex = visibleTasks.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(visibleTasks, oldIndex, newIndex)

    const activeTask = visibleTasks[oldIndex]
    const overTask = visibleTasks[newIndex]

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
          page={page}
          setPage={setPage}
          totalCount={paginationTotal}
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

  if (filteredTasks.length === 0) {
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
      {visibleTasks.map((task) =>
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
              items={visibleTasks.map((t) => t.id)}
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
