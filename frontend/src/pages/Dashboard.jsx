import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";

import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import { getDashboardData } from "../services/dashboardService";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {

    async function loadDashboard() {

      const data = await getDashboardData();

      setDashboard(data);

    }

    loadDashboard();

  }, []);

  if (!dashboard) {

    return (
      <MainLayout>

        <Typography>

          Loading...

        </Typography>

      </MainLayout>
    );

  }

  const atsScore =
    dashboard.analysis?.ats_score != null
      ? `${dashboard.analysis.ats_score}%`
      : "--";

  const resumeStatus =
    dashboard.resume ? "Uploaded" : "Not Uploaded";

  const analysisStatus =
    dashboard.analysis ? "Ready" : "Not Analyzed";

  return (

    <MainLayout>

      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>

          <StatCard
            title="ATS Score"
            value={atsScore}
          />

        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>

          <StatCard
            title="Resume"
            value={resumeStatus}
          />

        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>

          <StatCard
            title="Analysis"
            value={analysisStatus}
          />

        </Grid>

      </Grid>

    </MainLayout>

  );

}