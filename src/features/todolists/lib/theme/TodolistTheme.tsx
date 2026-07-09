import { createContext, useContext, type ReactNode } from "react"
import type { TodolistColor } from "@/features/todolists/lib/utils/getTodolistColor"
import themeStyles from "./todolistTheme.module.css"

const TodolistThemeContext = createContext<TodolistColor | null>(null)

export const useTodolistTheme = (): TodolistColor => {
  const color = useContext(TodolistThemeContext)
  if (!color) {
    throw new Error("useTodolistTheme must be used inside TodolistThemeProvider")
  }
  return color
}

type ProviderProps = {
  color: TodolistColor
  children: ReactNode
}

export const TodolistThemeProvider = ({ color, children }: ProviderProps) => (
  <TodolistThemeContext.Provider value={color}>
    {children}
  </TodolistThemeContext.Provider>
)

export { themeStyles }
