import DashboardLayout from "../layouts/DashboardLayout";

import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

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

      <Paper
        elevation={0}
        sx={{
          p: 5,
          mb: 4,
          borderRadius: 5,
          background:
            "linear-gradient(135deg,#2563EB,#1D4ED8)",
        }}
      >

        <Typography
          variant="h3"
          fontWeight={800}
        >
          👋 Welcome Back
        </Typography>

        <Typography
          sx={{
            mt: 1,
            opacity: 0.9,
            fontSize: 18,
          }}
        >
          Your AI Career Assistant
        </Typography>

        <Chip
          icon={<AutoAwesomeIcon />}
          label="Powered by Gemini AI"
          sx={{
            mt: 3,
            bgcolor: "rgba(255,255,255,0.15)",
            color: "white",
          }}
        />

      </Paper>

      <Grid container spacing={3}>

        <Grid xs={12} md={4}>
          <DashboardCard
            title="ATS Score"
            value={ats}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardCard
            title="Resume"
            value={resume}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardCard
            title="Analysis"
            value={analysis}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <QuickActions />
        </Grid>

        <Grid xs={12} md={4}>
          <RecentActivity />
        </Grid>

      </Grid>

      {dashboard.analysis && (

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 5,
            background: "#1E293B",
          }}
        >

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              mb: 3,
            }}
          >

            🎯 Latest AI Suggestions

          </Typography>

          {dashboard.analysis.suggestions
            .split("\n")
            .slice(0,3)
            .map((item)=>(
              <Typography
                key={item}
                sx={{
                  mb:2,
                  fontSize:16,
                }}
              >
                ✅ {item}
              </Typography>
            ))}

        </Paper>

      )}

    </DashboardLayout>

  );

}