import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"

export const useTaskProgress = (todolistId: string) => {
  const { data: pageData } = useGetTasksQuery({
    id: todolistId,
    params: { page: 1 },
  })

  const totalCount = pageData?.totalCount ?? 0

  const { data: allData } = useGetTasksQuery(
    {
      id: todolistId,
      params: { page: 1, count: totalCount || 1 },
    },
    { skip: totalCount === 0 },
  )

  const completedCount =
    allData?.items.filter((task) => task.status === TaskStatus.Completed)
      .length ?? 0

  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return { completedCount, totalCount, percent }
}
