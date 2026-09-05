import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4F8CFF",
    },
    secondary: {
      main: "#14B8A6",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#F59E0B",
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "\"Inter\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    h2: {
      fontSize: "3rem",
      fontWeight: 800,
      letterSpacing: 0,
    },
    h4: {
      fontSize: "2rem",
      fontWeight: 800,
      letterSpacing: 0,
    },
    h5: {
      fontSize: "1.35rem",
      fontWeight: 800,
      letterSpacing: 0,
    },
    h6: {
      fontSize: "1.05rem",
      fontWeight: 800,
      letterSpacing: 0,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0F172A",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          backgroundColor: alpha(theme.palette.common.white, 0.02),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.common.white, 0.08),
        }),
      },
    },
  },
});

export default theme;
