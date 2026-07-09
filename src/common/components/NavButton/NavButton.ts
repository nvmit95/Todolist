import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"

type Props = {
  background?: string
}

export const NavButton = styled(Button)<Props>(({ background, theme }) => ({
  minWidth: "100px",
  fontWeight: 600,
  borderRadius: 10,
  textTransform: "none",
  margin: "0 4px",
  padding: "6px 20px",
  fontSize: "0.875rem",
  color: background ? theme.palette.primary.contrastText : theme.palette.primary.main,
  background: background || "transparent",
  border: background ? "none" : `1.5px solid ${theme.palette.primary.main}`,
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    background: background
      ? theme.palette.primary.dark
      : "rgba(99, 102, 241, 0.08)",
    boxShadow: background ? "0 2px 8px rgba(99, 102, 241, 0.35)" : "none",
  },
}))
