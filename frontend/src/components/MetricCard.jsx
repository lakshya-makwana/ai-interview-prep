import { Box, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import AppCard from "./AppCard";

export default function MetricCard({
  label,
  value,
  valueColor,
  subtitle,
  helperText,
  icon,
  badge,
  trend,
  progress,
  progressColor = "primary",
  sx = {},
}) {
  const sub = helperText || subtitle;

  return (
    <AppCard sx={{ height: "100%", ...sx }}>
      <Stack spacing={0.75} sx={{ height: "100%", justifyContent: "space-between" }}>
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "capitalize",
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </Typography>
            {icon && (
              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  "& svg": { fontSize: 16 },
                }}
              >
                {icon}
              </Box>
            )}
          </Stack>

          <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "1.375rem",
                letterSpacing: "-0.02em",
                color: valueColor || "text.primary",
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>

            {badge && <Box sx={{ display: "inline-flex" }}>{badge}</Box>}

            {trend && (
              <Chip
                size="small"
                label={trend.label || trend.value}
                color={trend.positive ? "success" : trend.negative ? "warning" : "default"}
                sx={{
                  height: 18,
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  px: 0.25,
                }}
              />
            )}
          </Stack>
        </Box>

        <Box sx={{ mt: 0.5 }}>
          {typeof progress === "number" && (
            <Box sx={{ mb: sub ? 0.75 : 0 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, Math.max(0, progress))}
                color={progressColor}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          )}

          {sub && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
                fontSize: "0.7125rem",
                lineHeight: 1.35,
              }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </AppCard>
  );
}
