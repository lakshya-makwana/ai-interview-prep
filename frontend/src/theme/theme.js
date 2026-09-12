import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#06B6D4",
      light: "#22D3EE",
      dark: "#0891B2",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#090A0F",
      paper: "#11141F",
    },
    text: {
      primary: "#EDEDED",
      secondary: "#8A93A6",
      disabled: "#525969",
    },
    divider: "rgba(255, 255, 255, 0.07)",
    action: {
      hover: "rgba(255, 255, 255, 0.035)",
      selected: "rgba(59, 130, 246, 0.09)",
      disabledBackground: "rgba(255, 255, 255, 0.04)",
      disabled: "rgba(255, 255, 255, 0.25)",
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.25,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.015em",
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      lineHeight: 1.35,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      letterSpacing: "-0.005em",
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "0.9375rem",
      fontWeight: 600,
      letterSpacing: "0em",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.45,
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 600,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.8125rem",
      letterSpacing: "0.005em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#090A0F",
          color: "#EDEDED",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 34,
          borderRadius: 6,
          padding: "5px 14px",
          boxShadow: "none",
          fontWeight: 500,
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#1D4ED8",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.12)",
          color: "#EDEDED",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.22)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
          },
        },
        sizeSmall: {
          minHeight: 28,
          padding: "3px 10px",
          fontSize: "0.75rem",
        },
        sizeLarge: {
          minHeight: 38,
          padding: "7px 18px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          backgroundImage: "none",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 8,
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          backgroundColor: alpha(theme.palette.common.white, 0.015),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.divider,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.common.white, 0.16),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          },
        }),
        input: {
          fontSize: "0.8125rem",
          padding: "8px 12px",
        },
        inputSizeSmall: {
          padding: "6px 10px",
          fontSize: "0.775rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: "0.725rem",
          height: 22,
        },
        sizeSmall: {
          height: 20,
          fontSize: "0.7rem",
        },
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        },
        bar: {
          borderRadius: 2,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
          padding: "7px 12px",
          fontSize: "0.8125rem",
        }),
        head: ({ theme }) => ({
          fontWeight: 600,
          color: theme.palette.text.secondary,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.025)",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          fontSize: "0.8125rem",
          padding: "6px 12px",
          border: `1px solid ${theme.palette.divider}`,
        }),
        standardSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.06)",
          borderColor: "rgba(16, 185, 129, 0.2)",
          color: "#34D399",
        },
        standardError: {
          backgroundColor: "rgba(239, 68, 68, 0.06)",
          borderColor: "rgba(239, 68, 68, 0.2)",
          color: "#F87171",
        },
        standardWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.06)",
          borderColor: "rgba(245, 158, 11, 0.2)",
          color: "#FBBF24",
        },
        standardInfo: {
          backgroundColor: "rgba(59, 130, 246, 0.06)",
          borderColor: "rgba(59, 130, 246, 0.2)",
          color: "#60A5FA",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 8,
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: "none",
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
  },
});

export default theme;
