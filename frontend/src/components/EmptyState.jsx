import { Box, Button, Paper, Stack, Typography } from "@mui/material";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  secondaryActionLabel,
  onSecondaryAction,
  sx = {},
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 5 },
        textAlign: "center",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 280,
        ...sx,
      }}
    >
      {Icon && (
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "rgba(79, 140, 255, 0.1)",
            color: "primary.main",
            display: "grid",
            placeItems: "center",
            mb: 2,
            "& svg": {
              fontSize: 32,
            },
          }}
        >
          {typeof Icon === "function" ? <Icon /> : Icon}
        </Box>
      )}

      {title && (
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 460, mb: action || actionLabel ? 3 : 0 }}
        >
          {description}
        </Typography>
      )}

      {action ? (
        action
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {actionLabel && onAction && (
            <Button
              variant="contained"
              onClick={onAction}
              sx={{ px: 3, fontWeight: 700 }}
            >
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outlined"
              onClick={onSecondaryAction}
              sx={{ px: 3, fontWeight: 700 }}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </Stack>
      )}
    </Paper>
  );
}
