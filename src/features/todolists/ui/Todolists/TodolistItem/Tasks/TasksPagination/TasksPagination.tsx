import { Task_Count } from "@/common/constants"
import Pagination from "@mui/material/Pagination"
import { ChangeEvent } from "react"
import styles from "./TasksPagination.module.css"

type Props = {
  totalCount: number
  page: number
  setPage: (page: number) => void
}

export const TasksPagination = ({ totalCount, page, setPage }: Props) => {
  const changePage = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  return (
    <Pagination
      count={Math.ceil(totalCount / Task_Count)}
      page={page}
      onChange={changePage}
      shape="rounded"
      size="small"
      className={`${styles.pagination} todolist-pagination`}
    />
  )
}
