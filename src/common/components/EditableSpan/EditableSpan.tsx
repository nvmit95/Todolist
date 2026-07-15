import TextField from "@mui/material/TextField"
import { type ChangeEvent, useEffect, useState } from "react"
import styles from "./EditableSpan.module.css"

type Props = {
  value: string
  onChange: (title: string) => void
  disabled?: boolean
  isDone?: boolean
}

export const EditableSpan = ({ value, onChange, disabled, isDone }: Props) => {
  const [title, setTitle] = useState(value)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (!isEditMode) {
      setTitle(value)
    }
  }, [value, isEditMode])

  const turnOnEditMode = () => {
    if (disabled) return
    setIsEditMode(true)
  }

  const turnOffEditMode = () => {
    setIsEditMode(false)
    onChange(title)
  }

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  if (isEditMode) {
    return (
      <TextField
        variant="outlined"
        value={title}
        size="small"
        fullWidth
        multiline
        maxRows={4}
        onChange={changeTitle}
        onBlur={turnOffEditMode}
        onPointerDown={(e) => e.stopPropagation()}
        autoFocus
        className={`${styles.editField} todolist-edit-input`}
      />
    )
  }

  return (
    <span
      className={`${styles.text} ${isDone ? styles.done : ""}`}
      onDoubleClick={turnOnEditMode}
    >
      {value}
    </span>
  )
}
