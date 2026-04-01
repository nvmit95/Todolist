import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import type { Todolist } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({
          ...todolist,
          filter: "all",
        })),
      providesTags: ["Todolist"],
    }),
    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      query: (id) => {
        //4
        return {
          url: `todo-lists/${id}`,
          method: "DELETE",
        }
      },
      //queryArgument - query: (id) => id
      onQueryStarted: async (queryArgument, { dispatch, queryFulfilled }) => {
        //1
        //вызывается перед запросом на сервер
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData(
            "getTodolists",
            undefined,
            (todolists) => {
              //2
              const index = todolists.findIndex(
                (todo) => todo.id === queryArgument,
              )
              if (index !== -1) todolists.splice(index, 1)
            },
          ),
        )
        try {
          //3
          await queryFulfilled
          //queryFulfilled => аналог синтаксиса в компоненте (removeTodolist(id).unwrap())
          //5 success
        } catch (error) {
          //5 error

          patchResult.undo()
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    updateTodolistTitle: build.mutation<
      BaseResponse,
      { id: string; title: string }
    >({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} = todolistsApi
