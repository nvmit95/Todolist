import { setAppErrorAC } from "@/app/app-slice"
import { ResultCode } from "@/common/enums"
import { isErrorWithMessage } from "./isErrorWithMessage"
import {
  BaseQueryApi,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react"

export const handleError = (
  api: BaseQueryApi,
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
) => {
  let error = "Some error occurred"

  if (result.error) {
    switch (result.error.status) {
      case "FETCH_ERROR":
      case "PARSING_ERROR":
      case "CUSTOM_ERROR":
        error = result.error.error
        break
      case 403:
        error = "403 Forbidden Error. Check API-KEY"
        break
      case 400:
        if (isErrorWithMessage(result.error.data)) {
          error = result.error.data.message
        } else {
          error = JSON.stringify(result.error.data)
        }
        break
      default:
        if (
          typeof result.error.status === "number" &&
          result.error.status >= 500 &&
          result.error.status < 600
        ) {
          error = "Server error occurred. Please try again later."
        } else {
          error = JSON.stringify(result.error)
        }
        break
    }
    api.dispatch(setAppErrorAC({ error }))
    return
    //return ЧТОБЫ НЕ ПОПАДАТЬ В БЛОК С result.data в случае неуспешного запроса
    //result.data обрабатывает ошибку успешного запроса
  }

  ///ЛУчший вариант
  //   if (result.data) {
  //     const data = result.data as {
  //       resultCode: ResultCode
  //       messages: string[]
  //     }
  //
  //     if (data.resultCode === ResultCode.Error) {
  //       const messages = data.messages
  //       const error = messages.length ? messages[0] : "Some error occurred"
  //       api.dispatch(setAppErrorAC({ error }))
  //     }
  //   }
  //

  // ⚠️ API-level ошибки (resultCode)
  if (result.data) {
    const data = result.data as {
      resultCode: ResultCode
      messages: string[]
    }

    // 🔥 ОБРАБОТКА И Error И Captcha
    if (
      data.resultCode === ResultCode.Error ||
      data.resultCode === ResultCode.CaptchaError
    ) {
      const messages = data.messages
      const error = messages.length ? messages[0] : "Some error occurred"

      api.dispatch(setAppErrorAC({ error }))
    }
  }
}