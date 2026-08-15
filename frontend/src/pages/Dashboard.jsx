import DashboardLayout from "../layouts/DashboardLayout";

import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

import { Grid, Typography } from "@mui/material";

import { useDashboard } from "../context/DashboardContext";

export default function Dashboard() {

  const { dashboard, loading } = useDashboard();

  if (loading) {
    return (
      <DashboardLayout>
        <Typography>
          Loading...
        </Typography>
      </DashboardLayout>
    );
  }

  const ats = dashboard.analysis
    ? `${dashboard.analysis.ats_score}%`
    : "--";

  const resume = dashboard.resume
    ? "Uploaded"
    : "Not Uploaded";

  const analysis = dashboard.analysis
    ? "Completed"
    : "Not Available";

  return (
    <DashboardLayout>

      <Typography
        variant="h4"
        sx={{
          mb: 4,
        }}
      >
        Welcome Back 👋
      </Typography>

      <Grid
        container
        spacing={3}
      >

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <DashboardCard
            title="ATS Score"
            value={ats}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <DashboardCard
            title="Resume"
            value={resume}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <DashboardCard
            title="Analysis"
            value={analysis}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <QuickActions />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <RecentActivity />
        </Grid>

      </Grid>

    </DashboardLayout>
  );
}