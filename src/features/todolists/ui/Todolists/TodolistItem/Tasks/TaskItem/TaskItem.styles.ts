import { SxProps, Theme } from "@mui/material"

export const getListItemSx = (
  isDone: boolean,
  isDragging?: boolean,
): SxProps<Theme> => ({
  display: "flex",
  p: "6px 8px",
  borderRadius: "10px",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 1,
  opacity: isDone ? 0.55 : 1,
  backgroundColor: isDragging ? "action.hover" : "transparent",
  border: "1px solid",
  borderColor: isDragging ? "var(--list-accent)" : "transparent",
  boxShadow: isDragging ? "0 4px 16px var(--list-accent-border)" : "none",
  transition: "background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    backgroundColor: "action.hover",
    "& .task-item__delete": {
      opacity: 1,
    },
  },
  "& .task-item__content": {
    display: "flex",
    alignItems: "flex-start",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  "& .MuiCheckbox-root": {
    p: "4px",
    mt: "2px",
    flexShrink: 0,
    cursor: "pointer",
  },
  "& .task-item__delete": {
    opacity: 0,
    transition: "opacity 0.2s ease",
    mt: "2px",
    flexShrink: 0,
    cursor: "pointer",
  },
})
