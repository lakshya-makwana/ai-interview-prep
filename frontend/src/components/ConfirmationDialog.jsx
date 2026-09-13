import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          borderRadius: 1.5,
          p: 0.5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 1 }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pb: 1.5 }}>
        {message && (
          <DialogContentText sx={{ color: "text.secondary", fontSize: "0.8125rem", lineHeight: 1.5 }}>
            {message}
          </DialogContentText>
        )}
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, pt: 1, gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          disabled={loading}
          sx={{ textTransform: "none", fontSize: "0.8125rem" }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          size="small"
          color={destructive ? "error" : "primary"}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ textTransform: "none", fontSize: "0.8125rem" }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
