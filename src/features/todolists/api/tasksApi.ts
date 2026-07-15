import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type {
  DomainTask,
  GetTasksResponse,
  UpdateTaskModel,
} from "./tasksApi.types"
import { Task_Count } from "@/common/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<
      GetTasksResponse,
      { id: string; params: { page: number; count?: number } }
    >({
      query: ({ id, params }) => ({
        url: `todo-lists/${id}/tasks`,
        params: { ...params, count: params.count ?? Task_Count },
        //{...достаю все переданные параметры + добавляю count}
      }),
      providesTags: (_result, _error, arg) => {
        return [{ type: "Task", id: arg.id }]
      },
    }),
    addTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; title: string }
    >({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Task", id: arg.todolistId },
      ],
    }),
    removeTask: build.mutation<
      BaseResponse,
      { todolistId: string; taskId: string }
    >({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["Task"],
      invalidatesTags: (_result, _error, { todolistId }) => [
        { type: "Task", id: todolistId },
      ],
      //можно добавить только type, id
      //при удалении таски, нужно указать ее id, чтобы явно понимать какие данные перезапрашивать
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      onQueryStarted: async (
        { todolistId, taskId, model },
        { dispatch, queryFulfilled, getState },
      ) => {
        const cachedArgs = tasksApi.util.selectCachedArgsForQuery(
          getState(),
          "getTasks",
        )

        const patchResults = cachedArgs
          .filter((args) => args.id === todolistId)
          .map((args) =>
            dispatch(
              tasksApi.util.updateQueryData("getTasks", args, (response) => {
                const index = response.items.findIndex(
                  (task) => task.id === taskId,
                )
                if (index !== -1) {
                  response.items[index] = {
                    ...response.items[index],
                    ...model,
                  }
                }
              }),
            ),
          )

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patch) => patch.undo())
        }
      },
    }),
  }),
})

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useRemoveTaskMutation,
  useUpdateTaskMutation,
} = tasksApi
