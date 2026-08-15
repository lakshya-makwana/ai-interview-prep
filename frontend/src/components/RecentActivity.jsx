import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";

import { useDashboard } from "../context/DashboardContext";

export default function RecentActivity() {

  const { dashboard } = useDashboard();

  const activities = [];

  if (dashboard.resume) {
    activities.push({
      icon: <DescriptionRoundedIcon />,
      color: "#22C55E",
      title: "Resume Uploaded",
      subtitle: dashboard.resume.filename,
      status: "Completed",
    });
  }

  if (dashboard.analysis) {
    activities.push({
      icon: <PsychologyRoundedIcon />,
      color: "#2563EB",
      title: "AI Analysis Complete",
      subtitle: `ATS Score: ${dashboard.analysis.ats_score}%`,
      status: "Completed",
    });
  }

  activities.push({
    icon: <FlagRoundedIcon />,
    color: "#F59E0B",
    title: "Next Step",
    subtitle: "Mock Interview (Coming Soon)",
    status: "Upcoming",
  });

  return (

    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: "#162033",
        border: "1px solid rgba(255,255,255,.08)",
        height: "100%",
      }}
    >

      <CardContent sx={{ p: 3 }}>

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Recent Activity
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Your latest progress.
        </Typography>

        <Stack spacing={2}>

          {activities.map((activity, index) => (

            <Box key={index}>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >

                  <Avatar
                    sx={{
                      bgcolor: activity.color,
                      width: 42,
                      height: 42,
                    }}
                  >
                    {activity.icon}
                  </Avatar>

                  <Box>

                    <Typography
                      fontWeight={600}
                    >
                      {activity.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {activity.subtitle}
                    </Typography>

                  </Box>

                </Box>

                <Chip
                  label={activity.status}
                  size="small"
                  color={
                    activity.status === "Completed"
                      ? "success"
                      : "warning"
                  }
                />

              </Box>

              {index !== activities.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}

            </Box>

          ))}

        </Stack>

      </CardContent>

    </Card>

  );

}