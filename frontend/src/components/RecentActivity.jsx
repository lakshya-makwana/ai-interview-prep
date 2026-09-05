import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";

import { useDashboard } from "../context/DashboardContext";

import AppCard from "./AppCard";
import SectionHeader from "./SectionHeader";
import StatusChip from "./StatusChip";

function ActivityItem({ icon, title, subtitle, color, status, isLast }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: `${color}.main`,
            }}
          >
            {icon}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} noWrap>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          </Box>
        </Stack>

        <StatusChip label={status} color={status === "Completed" ? "success" : "warning"} />
      </Stack>

      {!isLast && <Divider sx={{ my: 2 }} />}
    </Box>
  );
}

export default function RecentActivity() {
  const { dashboard } = useDashboard();

  const activities = [];

  if (dashboard.resume) {
    activities.push({
      icon: <DescriptionRoundedIcon />,
      color: "success",
      title: "Resume Uploaded",
      subtitle: dashboard.resume.filename || "Resume file ready",
      status: "Completed",
    });
  }

  if (dashboard.analysis) {
    activities.push({
      icon: <PsychologyRoundedIcon />,
      color: "primary",
      title: "AI Analysis Complete",
      subtitle: `ATS Score: ${dashboard.analysis.ats_score}%`,
      status: "Completed",
    });
  }

  activities.push({
    icon: <FlagRoundedIcon />,
    color: "warning",
    title: "Next Step",
    subtitle: "Mock Interview module",
    status: "Upcoming",
  });

  return (
    <AppCard>
      <SectionHeader title="Recent Activity" subtitle="Your latest preparation milestones." />

      <Stack>
        {activities.map((activity, index) => (
          <ActivityItem
            key={`${activity.title}-${index}`}
            {...activity}
            isLast={index === activities.length - 1}
          />
        ))}
      </Stack>
    </AppCard>
  );
}
