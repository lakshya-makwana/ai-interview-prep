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
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: `${color}.main`,
              borderRadius: 0.75,
            }}
          >
            {icon}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.8125rem",
                lineHeight: 1.2,
                color: "text.primary",
              }}
              noWrap
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block", fontSize: "0.725rem", mt: 0.2 }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Stack>

        <StatusChip label={status} color={status === "Completed" ? "success" : "warning"} />
      </Stack>

      {!isLast && <Divider sx={{ my: 1.25 }} />}
    </Box>
  );
}

export default function RecentActivity() {
  const { dashboard } = useDashboard();

  const activities = [];

  if (dashboard.resume) {
    activities.push({
      icon: <DescriptionRoundedIcon sx={{ fontSize: 16 }} />,
      color: "success",
      title: "Resume Uploaded",
      subtitle: dashboard.resume.filename || "Resume file ready",
      status: "Completed",
    });
  }

  if (dashboard.analysis) {
    activities.push({
      icon: <PsychologyRoundedIcon sx={{ fontSize: 16 }} />,
      color: "primary",
      title: "AI Analysis Complete",
      subtitle: `ATS Score: ${dashboard.analysis.ats_score}%`,
      status: "Completed",
    });
  }

  activities.push({
    icon: <FlagRoundedIcon sx={{ fontSize: 16 }} />,
    color: "warning",
    title: "Next Milestone",
    subtitle: "Interview practice and Career Readiness",
    status: "Upcoming",
  });

  return (
    <AppCard>
      <SectionHeader title="Activity" subtitle="Recent account and preparation milestones." />

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
