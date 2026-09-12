import React from "react";
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
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        textAlign: "center",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 180,
        ...sx,
      }}
    >
      {Icon && (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: "rgba(59, 130, 246, 0.08)",
            color: "primary.main",
            display: "grid",
            placeItems: "center",
            mb: 1.25,
            "& svg": {
              fontSize: 20,
            },
          }}
        >
          {React.isValidElement(Icon) ? (
            Icon
          ) : typeof Icon === "function" || (typeof Icon === "object" && Icon !== null) ? (
            <Icon />
          ) : null}
        </Box>
      )}

      {title && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.primary",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 420,
            fontSize: "0.8125rem",
            lineHeight: 1.5,
            mb: action || actionLabel ? 2 : 0,
          }}
        >
          {description}
        </Typography>
      )}

      {action ? (
        action
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          {actionLabel && onAction && (
            <Button
              variant="contained"
              size="small"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outlined"
              size="small"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </Stack>
      )}
    </Paper>
  );
}
