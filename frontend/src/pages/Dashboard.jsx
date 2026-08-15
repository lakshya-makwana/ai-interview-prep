import DashboardLayout from "../layouts/DashboardLayout";

import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

import {
  Box,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";

import { useDashboard } from "../context/DashboardContext";

export default function Dashboard() {

  const { dashboard, loading } = useDashboard();

  if (loading) {

    return (
      <DashboardLayout>
        <Typography variant="h5">
          Loading Dashboard...
        </Typography>
      </DashboardLayout>
    );

  }

  const ats =
    dashboard.analysis
      ? `${dashboard.analysis.ats_score}%`
      : "--";

  const resume =
    dashboard.resume
      ? "Uploaded"
      : "Not Uploaded";

  const analysis =
    dashboard.analysis
      ? "Completed"
      : "Pending";

  const progress =
    dashboard.analysis
      ? "40%"
      : dashboard.resume
      ? "20%"
      : "0%";

  const currentStep =
    dashboard.analysis
      ? 2
      : dashboard.resume
      ? 1
      : 0;

  const recommendations =
    dashboard.analysis
      ? dashboard.analysis.suggestions
          .split("\n")
          .filter(Boolean)
          .slice(0, 4)
      : [];

  return (

    <DashboardLayout>

      <Box sx={{ mb: 4 }}>

        <Typography
          variant="h4"
          fontWeight={700}
        >
          AI Interview Preparation Platform
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Upload your resume, improve your ATS score and prepare for technical interviews.
        </Typography>

      </Box>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="ATS Score"
            value={ats}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="Resume"
            value={resume}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="Analysis"
            value={analysis}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="Progress"
            value={progress}
          />
        </Grid>

      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 1 }}
      >

        <Grid size={{ xs: 12, lg: 7 }}>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#162033",
              border: "1px solid rgba(255,255,255,.08)",
              mb: 3,
            }}
          >

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 3 }}
            >
              Interview Journey
            </Typography>

            <Stepper
              activeStep={currentStep}
              alternativeLabel
            >

              <Step>
                <StepLabel>
                  Upload Resume
                </StepLabel>
              </Step>

              <Step>
                <StepLabel>
                  AI Analysis
                </StepLabel>
              </Step>

              <Step>
                <StepLabel>
                  Mock Interview
                </StepLabel>
              </Step>

              <Step>
                <StepLabel>
                  Coding Practice
                </StepLabel>
              </Step>

              <Step>
                <StepLabel>
                  HR Round
                </StepLabel>
              </Step>

            </Stepper>

          </Paper>

          <QuickActions />

        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>

          <RecentActivity />

        </Grid>

      </Grid>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          bgcolor: "#162033",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 3 }}
        >
          AI Recommendations
        </Typography>

        {recommendations.length === 0 ? (

          <Typography color="text.secondary">
            Upload and analyze your resume to receive AI-powered recommendations.
          </Typography>

        ) : (

          <List>

            {recommendations.map((item) => (

              <ListItem
                key={item}
                disablePadding
                sx={{ mb: 2 }}
              >

                <ListItemIcon>

                  <CheckCircleRoundedIcon
                    color="success"
                  />

                </ListItemIcon>

                <ListItemText
                  primary={item}
                />

              </ListItem>

            ))}

          </List>

        )}

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#94A3B8",
          }}
        >

          <TipsAndUpdatesRoundedIcon />

          <Typography variant="body2">
            Complete more interview modules to unlock personalized recommendations.
          </Typography>

        </Box>

      </Paper>

    </DashboardLayout>

  );

}