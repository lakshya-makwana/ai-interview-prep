import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSnackbar } from "../context/SnackbarContext";
import {
  analyzeJob,
  deleteJob,
  getLatestJob,
} from "../services/jobService";

function splitLines(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.replace(/^[-*•\d.]+\s*/, "").trim())
    .filter(Boolean);
}

function ListSection({ title, items }) {
  const list = splitLines(items);

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      {list.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Not specified
        </Typography>
      ) : (
        <Stack spacing={0.75}>
          {list.map((item, index) => (
            <Stack key={`${item}-${index}`} direction="row" spacing={1} alignItems="flex-start">
              <CheckCircleOutlineRoundedIcon
                color="primary"
                sx={{ fontSize: 18, mt: 0.25, flexShrink: 0 }}
              />
              <Typography variant="body2" color="text.primary">
                {item}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function ChipSection({ title, items, color = "default" }) {
  const chips = splitLines(items);

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      {chips.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Not specified
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {chips.map((chip, index) => (
            <Chip
              key={`${chip}-${index}`}
              label={chip}
              color={color}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function JobDescription() {
  const { showSuccess, showError } = useSnackbar();

  const [jobText, setJobText] = useState("");
  const [analyzedJob, setAnalyzedJob] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavedJob() {
      try {
        const saved = await getLatestJob();
        if (saved) {
          setAnalyzedJob(saved);
          setJobText(saved.job_description || "");
        }
      } catch (err) {
        // 404 is normal if no job has been submitted yet
        if (err?.response?.status !== 404) {
          console.error("Failed to fetch saved job:", err);
        }
      } finally {
        setPageLoading(false);
      }
    }

    loadSavedJob();
  }, []);

  async function handleAnalyze() {
    if (!jobText.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const result = await analyzeJob(jobText.trim());
      setAnalyzedJob(result);
      showSuccess("Job description analyzed and saved successfully.");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        "Analysis failed. Please ensure the description is valid and try again.";
      setError(msg);
      showError(msg);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleClear() {
    try {
      setClearing(true);
      setError("");

      await deleteJob();
      setAnalyzedJob(null);
      setJobText("");
      showSuccess("Job description cleared.");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Failed to clear job description.";
      setError(msg);
      showError(msg);
    } finally {
      setClearing(false);
    }
  }

  const req = analyzedJob?.requirement;

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Job Description</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Paste a target software engineering job description to automatically extract key skills,
            requirements, and qualifications using Gemini AI.
          </Typography>
        </Box>

        {pageLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: analyzedJob ? "1fr 1fr" : "1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            {/* Input Card */}
            <AppCard>
              <SectionHeader
                title="Paste Job Description"
                subtitle="Provide the full text from the job posting."
                action={
                  analyzedJob ? (
                    <StatusChip label="Analyzed & Saved" color="success" />
                  ) : (
                    <StatusChip label="No Job Saved" color="warning" />
                  )
                }
              />

              <TextField
                multiline
                rows={12}
                fullWidth
                placeholder="Paste the target job description here (e.g. responsibilities, requirements, technical skills)..."
                value={jobText}
                onChange={(e) => {
                  setJobText(e.target.value);
                  if (error) setError("");
                }}
                disabled={analyzing || clearing}
                sx={{
                  bgcolor: "background.default",
                  borderRadius: 2,
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={analyzing || clearing || !jobText.trim()}
                  startIcon={
                    analyzing ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <AutoAwesomeRoundedIcon />
                    )
                  }
                >
                  {analyzing ? "Analyzing with Gemini..." : "Analyze"}
                </Button>

                {analyzedJob && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={handleClear}
                    disabled={analyzing || clearing}
                    startIcon={
                      clearing ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <DeleteOutlineRoundedIcon />
                      )
                    }
                  >
                    Clear
                  </Button>
                )}
              </Stack>
            </AppCard>

            {/* Structured Results Card */}
            {analyzedJob && (
              <AppCard>
                <SectionHeader
                  title="Extracted Job Intelligence"
                  subtitle="Structured requirements stored in PostgreSQL."
                />

                <Stack spacing={2.5}>
                  {/* Job Title & Company */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                        }}
                      >
                        <WorkOutlineRoundedIcon />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                          {analyzedJob.title || "Software Engineering Role"}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <BusinessRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {analyzedJob.company_name || "Company Not Specified"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Required Skills */}
                  <ChipSection
                    title="Required Skills"
                    items={req?.required_skills}
                    color="primary"
                  />

                  <Divider />

                  {/* Preferred Skills */}
                  <ChipSection
                    title="Preferred Skills"
                    items={req?.preferred_skills}
                    color="secondary"
                  />

                  <Divider />

                  {/* Technologies */}
                  <ChipSection
                    title="Technologies"
                    items={req?.technologies}
                    color="info"
                  />

                  <Divider />

                  {/* Domain Knowledge */}
                  <ChipSection
                    title="Domain Knowledge"
                    items={req?.domain_knowledge}
                    color="warning"
                  />

                  <Divider />

                  {/* Responsibilities */}
                  <ListSection
                    title="Responsibilities"
                    items={req?.responsibilities}
                  />

                  <Divider />

                  {/* Qualifications */}
                  <ListSection
                    title="Qualifications"
                    items={req?.qualifications}
                  />

                  <Divider />

                  {/* Experience Requirements */}
                  <ListSection
                    title="Experience Requirements"
                    items={req?.experience_requirements}
                  />
                </Stack>
              </AppCard>
            )}
          </Box>
        )}
      </Stack>
    </DashboardLayout>
  );
}
