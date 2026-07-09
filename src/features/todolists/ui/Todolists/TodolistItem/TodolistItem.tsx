import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import styles from "./TodolistItem.module.css"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const [addTask] = useAddTaskMutation()

  const createTask = (title: string) => {
    addTask({ todolistId: todolist.id, title })
  }

  return (
    <div className={styles.container}>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} variant="todolist" />
      <Tasks todolist={todolist} />
    </div>
  )
}
