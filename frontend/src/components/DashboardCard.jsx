import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import AppCard from "./AppCard";
import StatusChip from "./StatusChip";

const cardConfig = {
  "ATS Score": {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />,
    color: "primary",
  },
  Resume: {
    icon: <DescriptionRoundedIcon sx={{ fontSize: 16 }} />,
    color: "success",
  },
  Analysis: {
    icon: <PsychologyRoundedIcon sx={{ fontSize: 16 }} />,
    color: "secondary",
  },
  Progress: {
    icon: <TaskAltRoundedIcon sx={{ fontSize: 16 }} />,
    color: "warning",
  },
};

function getStatus(title, value) {
  if (title === "ATS Score") {
    if (value === "--") return { label: "Not analyzed", color: "default" };
    const score = Number.parseInt(value, 10);
    if (score >= 85) return { label: "Excellent", color: "success" };
    if (score >= 70) return { label: "Good", color: "primary" };
    return { label: "Needs work", color: "warning" };
  }

  if (title === "Resume") {
    return value === "Uploaded"
      ? { label: "Ready", color: "success" }
      : { label: "Pending", color: "warning" };
  }

  if (title === "Analysis") {
    return value === "Completed"
      ? { label: "Ready", color: "success" }
      : { label: "Pending", color: "warning" };
  }

  return { label: "Preparation", color: "primary" };
}

export default function DashboardCard({ title, value, progress }) {
  const theme = useTheme();
  const config = cardConfig[title] || cardConfig.Progress;
  const palette = theme.palette[config.color] || theme.palette.primary;
  const status = getStatus(title, value);

  return (
    <AppCard
      sx={{
        transition: theme.transitions.create(["border-color"]),
        "&:hover": {
          borderColor: alpha(palette.main, 0.3),
        },
      }}
      contentSx={{
        height: "100%",
        minHeight: 104,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.6875rem",
            letterSpacing: "0.03em",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 0.75,
            display: "grid",
            placeItems: "center",
            color: palette.main,
            bgcolor: alpha(palette.main, 0.08),
          }}
        >
          {config.icon}
        </Box>
      </Stack>

      <Box sx={{ my: 0.75 }}>
        <Typography
          variant="h6"
          sx={{
            lineHeight: 1,
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </Typography>

        {typeof progress === "number" && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, height: 4, borderRadius: 2 }}
          />
        )}
      </Box>

      <StatusChip label={status.label} color={status.color} sx={{ width: "fit-content" }} />
    </AppCard>
  );
}
