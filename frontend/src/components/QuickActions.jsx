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
import { useSnackbar } from "../context/SnackbarContext";

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
        minHeight: 88,
        p: 1.5,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: disabled ? "action.disabledBackground" : "background.paper",
        textAlign: "left",
        alignItems: "stretch",
        justifyContent: "flex-start",
        transition: theme.transitions.create(["border-color", "background-color"]),
        "&:hover": disabled
          ? {}
          : {
              borderColor: alpha(palette.main, 0.4),
              bgcolor: alpha(palette.main, 0.03),
            },
      }}
    >
      <Stack sx={{ width: "100%" }} spacing={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0.75,
              display: "grid",
              placeItems: "center",
              color: palette.main,
              bgcolor: alpha(palette.main, 0.08),
            }}
          >
            {icon}
          </Box>
          {status && <StatusChip label={status} color={disabled ? "default" : color} />}
        </Stack>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: "0.8125rem",
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              fontSize: "0.725rem",
              mt: 0.25,
            }}
          >
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
  const { showError } = useSnackbar();
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    try {
      setLoading(true);
      await analyzeResume();
      await refreshDashboard();
      navigate("/analysis");
    } catch (err) {
      console.error(err);
      showError("Analysis failed. Please ensure a valid resume is uploaded.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LoadingOverlay open={loading} />

      <AppCard>
        <SectionHeader
          title="Preparation Actions"
          subtitle="Core execution steps in your preparation workflow."
          action={loading ? <CircularProgress size={16} /> : null}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.25,
          }}
        >
          <ActionTile
            icon={<DescriptionRoundedIcon sx={{ fontSize: 16 }} />}
            title="Resume"
            subtitle="Upload or update resume."
            status="Ready"
            color="success"
            onClick={() => navigate("/resume")}
            disabled={loading}
          />

          <ActionTile
            icon={<PsychologyRoundedIcon sx={{ fontSize: 16 }} />}
            title="Run Analysis"
            subtitle="Analyze resume with Gemini."
            status="Run"
            color="primary"
            onClick={handleAnalyze}
            disabled={loading}
          />

          <ActionTile
            icon={<VisibilityRoundedIcon sx={{ fontSize: 16 }} />}
            title="Analysis Report"
            subtitle="Inspect evaluation results."
            status="View"
            color="secondary"
            onClick={() => navigate("/analysis")}
            disabled={loading}
          />

          <ActionTile
            icon={<MicRoundedIcon sx={{ fontSize: 16 }} />}
            title="Technical Interview"
            subtitle="Practice mock questions."
            status="Ready"
            color="warning"
            onClick={() => navigate("/interview")}
            disabled={loading}
          />
        </Box>
      </AppCard>
    </>
  );
}
