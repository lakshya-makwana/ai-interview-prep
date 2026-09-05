import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";

import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import ResumeSkeleton from "../components/skeletons/ResumeSkeleton";
import { useDashboard } from "../context/DashboardContext";
import { useSnackbar } from "../context/SnackbarContext";
import { uploadResume } from "../services/resumeService";
import { analyzeResume } from "../services/analysisService";

export default function Resume() {
  const navigate = useNavigate();
  const { dashboard, loading: dashboardLoading, refreshDashboard } = useDashboard();
  const { showSuccess, showError } = useSnackbar();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (dashboardLoading) {
    return (
      <DashboardLayout>
        <ResumeSkeleton />
      </DashboardLayout>
    );
  }

  async function handleUpload() {
    if (!file) {
      setError("Please choose a PDF resume first.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setError("");

      await uploadResume(file);
      await analyzeResume();
      await refreshDashboard();

      setFile(null);
      const successMsg = "Resume uploaded and analyzed successfully.";
      setSuccess(successMsg);
      showSuccess(successMsg);

      navigate("/analysis");
    } catch (err) {
      console.error(err);
      const errorMsg = "Upload or analysis failed. Please ensure the file is a valid PDF and try again.";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Resume</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Upload the resume you want Gemini to analyze for ATS compatibility and interview preparation.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)" },
            gap: 3,
          }}
        >
          <AppCard>
            <SectionHeader
              title="Upload Resume"
              subtitle="PDF files work best for consistent text extraction."
              action={<StatusChip label={dashboard.resume ? "Resume saved" : "No resume"} color={dashboard.resume ? "success" : "warning"} />}
            />

            <Box
              component="label"
              sx={{
                minHeight: 280,
                border: 1,
                borderStyle: "dashed",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3,
                cursor: "pointer",
                transition: (theme) => theme.transitions.create(["border-color", "background-color"]),
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <input
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  if (selected) {
                    setFile(selected);
                    setError("");
                    setSuccess("");
                  }
                }}
              />

              <Stack alignItems="center" spacing={2}>
                <CloudUploadRoundedIcon color="primary" sx={{ fontSize: 64 }} />
                <Box>
                  <Typography variant="h6">
                    {file ? file.name : "Choose a resume PDF"}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Click this area to select a file from your device.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleUpload}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadRoundedIcon />}
              >
                {loading ? "Uploading..." : dashboard.resume ? "Replace Resume" : "Upload Resume"}
              </Button>

              <Button variant="outlined" size="large" onClick={() => navigate("/analysis")}>
                View Analysis
              </Button>
            </Stack>

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </AppCard>

          <AppCard>
            <SectionHeader title="Current Resume" subtitle="The file used for your latest analysis." />

            {dashboard.resume ? (
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "action.hover",
                      color: "primary.main",
                    }}
                  >
                    <DescriptionRoundedIcon />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800} noWrap>
                      {dashboard.resume.filename || "Uploaded resume"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ready for AI analysis
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PsychologyRoundedIcon color={dashboard.analysis ? "success" : "disabled"} />
                    <Typography color={dashboard.analysis ? "text.primary" : "text.secondary"}>
                      {dashboard.analysis ? "Analysis completed" : "Analysis pending"}
                    </Typography>
                  </Stack>

                  {dashboard.analysis && (
                    <StatusChip label={`ATS Score ${dashboard.analysis.ats_score}%`} color="primary" />
                  )}
                </Stack>
              </Stack>
            ) : (
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{
                  py: 4,
                  px: 2,
                  textAlign: "center",
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    bgcolor: "rgba(79, 140, 255, 0.1)",
                    color: "primary.main",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <DescriptionRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography fontWeight={700} gutterBottom>
                    No Resume Uploaded
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select a PDF file on the left to upload your resume and run automated AI analysis.
                  </Typography>
                </Box>
              </Stack>
            )}
          </AppCard>
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
