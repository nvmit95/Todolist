import { AUTH_TOKEN } from "@/common/constants"
import { handleError } from "@/common/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "todolistsApi",

  tagTypes: ["Todolist", "Task"],

  keepUnusedDataFor: 10800, //3 часа
  //время жизни кэша (по умолчанию 60 секунд)

  refetchOnFocus: true,
  //после потери фокуса, при клике на страницу, подтягиваются данные

  refetchOnReconnect: true,
  //после потери интернета, когда интернет подключается, подтягиваются данные

  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: "include",
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        headers.set(
          "Authorization",
          `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        )
      },
    })(args, api, extraOptions)

    handleError(api, result)

    return result
  },
  endpoints: () => ({}),
})
