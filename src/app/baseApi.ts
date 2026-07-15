import { AUTH_TOKEN } from "@/common/constants"
import { handleError } from "@/common/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "todolistsApi",

  tagTypes: ["Todolist", "Task"],

  keepUnusedDataFor: 10800,

  refetchOnFocus: true,

  refetchOnReconnect: true,

  baseQuery: async (args, api, extraOptions) => {
    // Local: direct SamuraiJS URL from .env (CORS allows localhost).
    // Production: /backend → Vercel Function api/bridge (see vercel.json).
    const baseUrl = import.meta.env.PROD
      ? "/backend/"
      : import.meta.env.VITE_BASE_URL

    const result = await fetchBaseQuery({
      baseUrl,
      credentials: "omit",
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        const token = localStorage.getItem(AUTH_TOKEN)
        if (token) headers.set("Authorization", `Bearer ${token}`)
      },
    })(args, api, extraOptions)

    handleError(api, result)

    return result
  },
  endpoints: () => ({}),
})
