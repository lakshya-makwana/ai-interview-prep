import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useDashboard } from "../context/DashboardContext";

export default function RecentActivity() {

  const { dashboard } = useDashboard();

  const activities = [];

  if (dashboard.resume) {
    activities.push({
      icon: <UploadFileIcon />,
      title: "Resume Uploaded",
      subtitle: dashboard.resume.filename,
      color: "#2563EB",
    });
  }

  if (dashboard.analysis) {
    activities.push({
      icon: <PsychologyIcon />,
      title: "AI Analysis Completed",
      subtitle: `ATS Score: ${dashboard.analysis.ats_score}%`,
      color: "#16A34A",
    });
  }

  activities.push({
    icon: <CheckCircleIcon />,
    title: "Dashboard Ready",
    subtitle: "Everything is synchronized",
    color: "#F59E0B",
  });

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 5,
        background: "#1E293B",
      }}
    >
      <CardContent sx={{ p: 4 }}>

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mb: 3 }}
        >
          📅 Recent Activity
        </Typography>

        <Stack spacing={2}>

          {activities.map((item, index) => (
            <Box key={index}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >

                <Avatar
                  sx={{
                    bgcolor: item.color,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Box>

                  <Typography
                    fontWeight={700}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.subtitle}
                  </Typography>

                </Box>

              </Box>

              {index !== activities.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}

            </Box>
          ))}

        </Stack>

      </CardContent>
    </Card>
  );
}