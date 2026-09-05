import { createContext, useContext, useState, useCallback } from "react";
import { Alert, Snackbar } from "@mui/material";

const SnackbarContext = createContext({
  showSnackbar: () => {},
  showSuccess: () => {},
  showError: () => {},
  showInfo: () => {},
  showWarning: () => {},
});

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const showSuccess = useCallback((message) => {
    showSnackbar(message, "success");
  }, [showSnackbar]);

  const showError = useCallback((message) => {
    showSnackbar(message, "error");
  }, [showSnackbar]);

  const showInfo = useCallback((message) => {
    showSnackbar(message, "info");
  }, [showSnackbar]);

  const showWarning = useCallback((message) => {
    showSnackbar(message, "warning");
  }, [showSnackbar]);

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSnackbar() {
  return useContext(SnackbarContext);
}
