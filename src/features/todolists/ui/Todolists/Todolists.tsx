import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import { getTodolistColor, todolistColorVars } from "@/features/todolists/lib/utils"
import { TodolistThemeProvider, themeStyles } from "@/features/todolists/lib/theme"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import type { CSSProperties } from "react"
import styles from "./Todolists.module.css"

export const Todolists = () => {
  const { data: todolists, isLoading } = useGetTodolistsQuery(undefined, {
    //pollingInterval: 10000,
    //делает завпрос за тудулистами раз в 10 секунд
    //skipPollingIfUnfocused: true,
    // true- пересстать делать запросы, когда страница не в фокусе
  })

  if (isLoading) {
    return (
      <Box className={styles.grid}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <Box className={styles.grid}>
      {todolists?.map((todolist) => {
        const color = getTodolistColor(todolist.id)

        return (
          <Paper
            key={todolist.id}
            className={`${styles.card} ${themeStyles.themed}`}
            style={todolistColorVars(color) as CSSProperties}
          >
            <TodolistThemeProvider color={color}>
              <div className={styles.themeRoot}>
                <TodolistItem todolist={todolist} />
              </div>
            </TodolistThemeProvider>
          </Paper>
        )
      })}
    </Box>
  )
}
