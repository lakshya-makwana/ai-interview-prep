import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";

import LoadingOverlay from "./LoadingOverlay";

import { analyzeResume } from "../services/analysisService";
import { useDashboard } from "../context/DashboardContext";

function ActionTile({
  icon,
  title,
  subtitle,
  color,
  onClick,
  disabled = false,
}) {

  return (

    <Card
      elevation={0}
      onClick={!disabled ? onClick : undefined}
      sx={{
        cursor: disabled ? "default" : "pointer",
        borderRadius: 3,
        bgcolor: "#1E293B",
        border: "1px solid rgba(255,255,255,.08)",
        transition: ".25s",

        "&:hover": disabled
          ? {}
          : {
              transform: "translateY(-4px)",
              borderColor: color,
            },
      }}
    >

      <CardContent sx={{ p: 3 }}>

        <Box
          sx={{
            color,
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <Typography
          fontWeight={700}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {subtitle}
        </Typography>

      </CardContent>

    </Card>

  );

}

export default function QuickActions() {

  const navigate = useNavigate();

  const { refreshDashboard } = useDashboard();

  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {

    try {

      setLoading(true);

      await analyzeResume();

      await refreshDashboard();

      navigate("/analysis");

    }

    catch (err) {

      console.error(err);

      alert("Analysis failed.");

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <>
      <LoadingOverlay open={loading} />

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: "#162033",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Preparation Center
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Continue your interview preparation.
          </Typography>

          <Grid container spacing={2}>

            <Grid xs={12} sm={6}>

              <ActionTile
                icon={<DescriptionRoundedIcon fontSize="large" />}
                title="Resume"
                subtitle="Upload or replace your resume"
                color="#22C55E"
                onClick={() => navigate("/resume")}
              />

            </Grid>

            <Grid xs={12} sm={6}>

              <ActionTile
                icon={<PsychologyRoundedIcon fontSize="large" />}
                title="AI Analysis"
                subtitle="Analyze your resume with Gemini"
                color="#2563EB"
                onClick={handleAnalyze}
              />

            </Grid>

            <Grid xs={12} sm={6}>

              <ActionTile
                icon={<VisibilityRoundedIcon fontSize="large" />}
                title="Analysis Report"
                subtitle="View your latest report"
                color="#A855F7"
                onClick={() => navigate("/analysis")}
              />

            </Grid>

            <Grid xs={12} sm={6}>

              <ActionTile
                icon={<MicRoundedIcon fontSize="large" />}
                title="Mock Interview"
                subtitle="Coming in Phase 2"
                color="#F59E0B"
                disabled
              />

            </Grid>

          </Grid>

          {loading && (

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >

              <CircularProgress />

            </Box>

          )}

        </CardContent>

      </Card>

    </>
  );

}