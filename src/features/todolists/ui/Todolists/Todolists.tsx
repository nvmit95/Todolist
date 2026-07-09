import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import { getTodolistColor, todolistColorVars } from "@/features/todolists/lib/utils"
import { TodolistThemeProvider, themeStyles } from "@/features/todolists/lib/theme"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
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
      <Box className={styles.skeletonGrid}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <>
      {todolists?.map((todolist) => {
        const color = getTodolistColor(todolist.id)

        return (
          <Grid key={todolist.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              className={`${styles.card} ${themeStyles.themed}`}
              style={todolistColorVars(color) as CSSProperties}
            >
              <TodolistThemeProvider color={color}>
                <div className={styles.themeRoot}>
                  <TodolistItem todolist={todolist} />
                </div>
              </TodolistThemeProvider>
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
