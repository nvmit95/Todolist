import { useAppDispatch } from "@/common/hooks"
import type { DomainTodolist, FilterValues } from "@/features/todolists/lib/types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import styles from "./FilterButtons.module.css"

type Props = {
  todolist: DomainTodolist
}

const filters: { value: FilterValues; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
]

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.filter = filter
        }
      }),
    )
  }

  return (
    <Box className={`${styles.container} todolist-filters`}>
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          className={`todolist-filter-btn ${styles.filterBtn} ${
            filter === value ? `todolist-filter-btn--active ${styles.active}` : ""
          }`}
          onClick={() => changeFilter(value)}
          disableRipple
        >
          {label}
        </Button>
      ))}
    </Box>
  )
}
