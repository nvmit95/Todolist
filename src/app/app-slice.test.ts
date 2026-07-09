import { describe, it, expect } from "vitest"
import {
  appSlice,
  changeThemeModeAC,
  setIsLoggedInAC,
  setAppErrorAC,
} from "@/app/app-slice"

const getInitialState = () => ({
  themeMode: "light" as const,
  status: "idle" as const,
  error: null as string | null,
  isLoggedIn: false,
})

describe("appSlice", () => {
  it("toggles theme mode", () => {
    const state = appSlice.reducer(
      getInitialState(),
      changeThemeModeAC({ themeMode: "dark" }),
    )

    expect(state.themeMode).toBe("dark")
  })

  it("sets login state", () => {
    const state = appSlice.reducer(
      getInitialState(),
      setIsLoggedInAC({ isLoggedIn: true }),
    )

    expect(state.isLoggedIn).toBe(true)
  })

  it("sets and clears app error", () => {
    const withError = appSlice.reducer(
      getInitialState(),
      setAppErrorAC({ error: "Something went wrong" }),
    )
    expect(withError.error).toBe("Something went wrong")

    const cleared = appSlice.reducer(
      withError,
      setAppErrorAC({ error: null }),
    )
    expect(cleared.error).toBeNull()
  })

  it("selectors return correct values", () => {
    const state = { app: { ...getInitialState(), isLoggedIn: true, themeMode: "dark" as const } }

    expect(appSlice.selectors.selectIsLoggedIn(state)).toBe(true)
    expect(appSlice.selectors.selectThemeMode(state)).toBe("dark")
    expect(appSlice.selectors.selectAppError(state)).toBeNull()
  })
})
