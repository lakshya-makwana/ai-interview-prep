import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  ButtonBase,
  CircularProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { analyzeResume } from "../services/analysisService";
import { useDashboard } from "../context/DashboardContext";

import AppCard from "./AppCard";
import LoadingOverlay from "./LoadingOverlay";
import SectionHeader from "./SectionHeader";
import StatusChip from "./StatusChip";

function ActionTile({ icon, title, subtitle, color = "primary", status, onClick, disabled }) {
  const theme = useTheme();
  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <ButtonBase
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={{
        width: "100%",
        minHeight: 118,
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: disabled ? "action.disabledBackground" : "background.default",
        textAlign: "left",
        alignItems: "stretch",
        justifyContent: "flex-start",
        transition: theme.transitions.create(["transform", "border-color", "background-color"]),
        "&:hover": disabled
          ? {}
          : {
              transform: "translateY(-2px)",
              borderColor: palette.main,
              bgcolor: alpha(palette.main, 0.08),
            },
      }}
    >
      <Stack sx={{ width: "100%" }} spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: palette.main,
              bgcolor: alpha(palette.main, 0.12),
            }}
          >
            {icon}
          </Box>
          {status && <StatusChip label={status} color={disabled ? "default" : color} />}
        </Stack>

        <Box>
          <Typography fontWeight={800}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </ButtonBase>
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
    } catch (err) {
      console.error(err);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LoadingOverlay open={loading} />

      <AppCard>
        <SectionHeader
          title="Preparation Center"
          subtitle="Continue the core interview preparation workflow."
          action={loading ? <CircularProgress size={22} /> : null}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <ActionTile
            icon={<DescriptionRoundedIcon />}
            title="Resume"
            subtitle="Upload or replace your resume."
            status="Ready"
            color="success"
            onClick={() => navigate("/resume")}
            disabled={loading}
          />

          <ActionTile
            icon={<PsychologyRoundedIcon />}
            title="AI Analysis"
            subtitle="Run Gemini resume analysis."
            status="Run"
            color="primary"
            onClick={handleAnalyze}
            disabled={loading}
          />

          <ActionTile
            icon={<VisibilityRoundedIcon />}
            title="Analysis Report"
            subtitle="Open your latest AI report."
            status="View"
            color="secondary"
            onClick={() => navigate("/analysis")}
            disabled={loading}
          />

          <ActionTile
            icon={<MicRoundedIcon />}
            title="Mock Interview"
            subtitle="Interview practice module."
            status="Soon"
            color="warning"
            disabled
          />
        </Box>
      </AppCard>
    </>
  );
}
