import { Task_Count } from "@/common/constants"
import Pagination from "@mui/material/Pagination"
import Typography from "@mui/material/Typography"
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
    <>
      <Pagination
        count={Math.ceil(totalCount / Task_Count)}
        page={page}
        onChange={changePage}
        shape="rounded"
        className={`${styles.pagination} todolist-pagination`}
      />
      <div className={styles.totalCount}>
        <Typography variant="caption" className="todolist-total-count">
          Total: {totalCount}
        </Typography>
      </div>
    </>
  )
}
