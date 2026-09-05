import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import theme from "./theme/theme";

import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { SnackbarProvider } from "./context/SnackbarContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SnackbarProvider>
        <AuthProvider>
          <DashboardProvider>
            <App />
          </DashboardProvider>
        </AuthProvider>
      </SnackbarProvider>

    </ThemeProvider>
  </React.StrictMode>
);