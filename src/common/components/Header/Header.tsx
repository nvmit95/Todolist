import {
  changeThemeModeAC,
  selectAppStatus,
  selectIsLoggedIn,
  selectThemeMode,
  setIsLoggedInAC,
} from "@/app/app-slice.ts"
import { baseApi } from "@/app/baseApi"
import { NavButton } from "@/common/components/NavButton/NavButton"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { useLogoutMutation } from "@/features/auth/api/authApi"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import styles from "./Header.module.css"

export const Header = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)

  const [logout] = useLogoutMutation()

  const dispatch = useAppDispatch()

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logoutHandler = () => {
    logout()
      .then((res) => {
        if (res.data?.resultCode === ResultCode.Success) {
          dispatch(setIsLoggedInAC({ isLoggedIn: false }))
          localStorage.removeItem(AUTH_TOKEN)
        }
      })
      .then(() => {
        dispatch(baseApi.util.invalidateTags(["Todolist", "Task"]))
      })
  }

  return (
    <AppBar position="sticky" sx={{ mb: "24px" }}>
      <Toolbar disableGutters>
        <Container maxWidth="lg" sx={containerSx}>
          <div className={styles.brand}>
            <CheckCircleOutlineIcon className={styles.logo} />
            <Typography variant="h6" className={styles.brandName}>
              TodoList
            </Typography>
          </div>

          <div className={styles.actions}>
            {isLoggedIn && (
              <NavButton onClick={logoutHandler} variant="outlined">
                Sign out
              </NavButton>
            )}
            <Tooltip title={themeMode === "light" ? "Dark mode" : "Light mode"}>
              <IconButton onClick={changeMode} color="inherit" aria-label="Toggle theme">
                {themeMode === "light" ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <LightModeOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && (
        <LinearProgress
          color="primary"
          sx={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
        />
      )}
    </AppBar>
  )
}
