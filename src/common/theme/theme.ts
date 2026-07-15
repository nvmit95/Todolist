import type { ThemeMode } from "@/app/app-slice.ts"
import { createTheme, type ThemeOptions } from "@mui/material/styles"

const sharedTypography: ThemeOptions["typography"] = {
  fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  h3: { fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em" },
  h4: { fontWeight: 700, letterSpacing: "-0.03em" },
  button: { fontWeight: 600, textTransform: "none" as const },
}

const lightPalette: ThemeOptions["palette"] = {
  mode: "light",
  primary: {
    main: "#6366f1",
    light: "#818cf8",
    dark: "#4f46e5",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ec4899",
    light: "#f472b6",
    dark: "#db2777",
    contrastText: "#ffffff",
  },
  success: {
    main: "#10b981",
    light: "#34d399",
    dark: "#059669",
  },
  background: {
    default: "#f0f2f8",
    paper: "#ffffff",
  },
  text: {
    primary: "#1e1b4b",
    secondary: "#64748b",
  },
  divider: "rgba(99, 102, 241, 0.12)",
}

const darkPalette: ThemeOptions["palette"] = {
  mode: "dark",
  primary: {
    main: "#818cf8",
    light: "#a5b4fc",
    dark: "#6366f1",
    contrastText: "#0f0a2e",
  },
  secondary: {
    main: "#f472b6",
    light: "#f9a8d4",
    dark: "#ec4899",
    contrastText: "#1a0a14",
  },
  success: {
    main: "#34d399",
    light: "#6ee7b7",
    dark: "#10b981",
  },
  background: {
    default: "#0c0e1a",
    paper: "#161829",
  },
  text: {
    primary: "#e8e6f5",
    secondary: "#94a3b8",
  },
  divider: "rgba(129, 140, 248, 0.15)",
}

const componentOverrides: ThemeOptions["components"] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: "thin",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        borderRadius: 16,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 24px rgba(99, 102, 241, 0.08), 0 1px 4px rgba(0,0,0,0.04)"
            : "0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(129, 140, 248, 0.08)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 8px 32px rgba(99, 102, 241, 0.14), 0 2px 8px rgba(0,0,0,0.06)"
              : "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(129, 140, 248, 0.15)",
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: "8px 18px",
      },
      contained: {
        boxShadow: "0 2px 8px rgba(99, 102, 241, 0.35)",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.45)",
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 10,
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.mode === "light" ? "#c7d2fe" : "#4338ca",
        "&.Mui-checked": {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        background:
          theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(22, 24, 41, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        transition: "background-color 0.2s ease, color 0.2s ease",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(99, 102, 241, 0.08)"
              : "rgba(129, 140, 248, 0.12)",
        },
      }),
    },
  },
  MuiPagination: {
    styleOverrides: {
      root: {
        "& .MuiPaginationItem-root": {
          borderRadius: 8,
        },
      },
    },
  },
}

export const getTheme = (themeMode: ThemeMode) => {
  return createTheme({
    cssVariables: true,
    palette: themeMode === "light" ? lightPalette : darkPalette,
    typography: sharedTypography,
    shape: { borderRadius: 12 },
    components: componentOverrides,
  })
}
