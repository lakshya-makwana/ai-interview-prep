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
    icon: <TrendingUpRoundedIcon />,
    color: "primary",
  },
  Resume: {
    icon: <DescriptionRoundedIcon />,
    color: "success",
  },
  Analysis: {
    icon: <PsychologyRoundedIcon />,
    color: "secondary",
  },
  Progress: {
    icon: <TaskAltRoundedIcon />,
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
      : { label: "Upload needed", color: "warning" };
  }

  if (title === "Analysis") {
    return value === "Completed"
      ? { label: "Report ready", color: "success" }
      : { label: "Pending", color: "warning" };
  }

  return { label: "Interview journey", color: "primary" };
}

export default function DashboardCard({ title, value, progress }) {
  const theme = useTheme();
  const config = cardConfig[title] || cardConfig.Progress;
  const palette = theme.palette[config.color] || theme.palette.primary;
  const status = getStatus(title, value);

  return (
    <AppCard
      sx={{
        transition: theme.transitions.create(["transform", "border-color", "box-shadow"]),
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: palette.main,
          boxShadow: `0 16px 40px ${alpha(palette.main, 0.14)}`,
        },
      }}
      contentSx={{
        height: "100%",
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          {title}
        </Typography>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color: palette.main,
            bgcolor: alpha(palette.main, 0.12),
          }}
        >
          {config.icon}
        </Box>
      </Stack>

      <Box>
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          {value}
        </Typography>

        {typeof progress === "number" && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 2, height: 7, borderRadius: 999 }}
          />
        )}
      </Box>

      <StatusChip label={status.label} color={status.color} sx={{ width: "fit-content" }} />
    </AppCard>
  );
}
