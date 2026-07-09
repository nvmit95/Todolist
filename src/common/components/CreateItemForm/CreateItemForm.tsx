import { type ChangeEvent, type KeyboardEvent, type ReactNode, useState } from "react"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import AddBoxIcon from "@mui/icons-material/AddBox"
import styles from "./CreateItemForm.module.css"

type Props = {
  onCreateItem: (title: string) => void
  disabled?: boolean
  placeholder?: string
  buttonIcon?: ReactNode
  /** todolist — кнопка и фокус инпута наследуют цвет карточки через .themed */
  variant?: "default" | "todolist"
}

export const CreateItemForm = ({
  onCreateItem,
  disabled,
  placeholder = "Enter a title",
  buttonIcon = <AddBoxIcon />,
  variant = "default",
}: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const isTodolist = variant === "todolist"

  const createItemHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle !== "") {
      onCreateItem(trimmedTitle)
      setTitle("")
    } else {
      setError("Title is required")
    }
  }

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
    setError(null)
  }

  const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createItemHandler()
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.fieldRow}>
        <TextField
          label={placeholder}
          variant="outlined"
          value={title}
          size="small"
          fullWidth
          error={!!error}
          onChange={changeTitleHandler}
          onKeyDown={createItemOnEnterHandler}
          disabled={disabled}
          className={`${styles.input} ${isTodolist ? "todolist-add-input" : ""}`}
        />
        <IconButton
          onClick={createItemHandler}
          disabled={disabled}
          className={`${styles.addBtn} ${isTodolist ? "todolist-add-btn" : ""}`}
          aria-label="Add item"
        >
          {buttonIcon}
        </IconButton>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
