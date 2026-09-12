import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMatchingReport } from "../services/matchingService";

function getScoreColor(score) {
  if (score >= 75) return "success.main";
  if (score >= 50) return "primary.main";
  if (score >= 30) return "warning.main";
  return "error.main";
}

function getEvidenceChip(evidence) {
  switch (evidence) {
    case "Strong":
      return (
        <Chip
          icon={<CheckCircleRoundedIcon />}
          label="Strong (1.0)"
          size="small"
          color="success"
          sx={{ fontWeight: 600 }}
        />
      );
    case "Partial":
      return (
        <Chip
          icon={<WarningAmberRoundedIcon />}
          label="Partial (0.5)"
          size="small"
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      );
    case "Missing":
    default:
      return (
        <Chip
          icon={<CancelRoundedIcon />}
          label="Missing (0.0)"
          size="small"
          variant="outlined"
          color="error"
          sx={{ fontWeight: 600 }}
        />
      );
  }
}

export default function JobMatch() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // 404 or other
  const [errorMessage, setErrorMessage] = useState("");

  const handleRefresh = async () => {
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage("");
    try {
      const data = await getMatchingReport();
      setReport(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorStatus(404);
        setErrorMessage(
          err.response.data?.detail || "Candidate profile or job description is missing."
        );
      } else {
        setErrorStatus(500);
        setErrorMessage(
          err.response?.data?.detail || "Failed to load matching report. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await getMatchingReport();
        if (isMounted) {
          setReport(data);
          setErrorStatus(null);
          setErrorMessage("");
        }
      } catch (err) {
        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setErrorStatus(404);
            setErrorMessage(
              err.response.data?.detail || "Candidate profile or job description is missing."
            );
          } else {
            setErrorStatus(500);
            setErrorMessage(
              err.response?.data?.detail || "Failed to load matching report. Please try again."
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <SectionHeader
            title="Resume ↔ Job Matching Engine"
            subtitle="Deterministic weighted matching between your verified candidate profile and AI-extracted job requirements."
          />
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Refresh Match
          </Button>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* 404 / Missing Pre-requisite alert */}
        {!loading && errorStatus === 404 && (
          <AppCard sx={{ textAlign: "center", py: 5, px: 3 }}>
            <CompareArrowsRoundedIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Missing Requirements for Job Matching
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
              {errorMessage}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<DescriptionRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/resume")}
                sx={{ borderRadius: 2 }}
              >
                Go to Resume & Verify Skills
              </Button>
              <Button
                variant="contained"
                startIcon={<WorkOutlineRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/job-description")}
                sx={{ borderRadius: 2 }}
              >
                Analyze Job Description
              </Button>
            </Stack>
          </AppCard>
        )}

        {/* General Error */}
        {!loading && errorStatus && errorStatus !== 404 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Report Content */}
        {!loading && !errorStatus && report && (
          <Stack spacing={4}>
            {/* Overall Match Card */}
            <AppCard>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4 }}>
                {/* Score Section */}
                <Box sx={{ textAlign: "center", minWidth: 220 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontWeight: 700 }}>
                    OVERALL MATCH
                  </Typography>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{ color: getScoreColor(report.match_score), my: 0.5 }}
                  >
                    {report.match_score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Deterministic Weighted Score
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

                {/* Formula breakdown info */}
                <Box sx={{ flex: 1, width: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Match Completion
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} color={getScoreColor(report.match_score)}>
                      {report.match_score}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(report.match_score, 100)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getScoreColor(report.match_score),
                        borderRadius: 5,
                      },
                      mb: 2,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Calculated using verified evidence: Required skills (weight = 2.0), Preferred skills (weight = 1.0). Strong match gives 100% weight credit, alias match gives 50%.
                  </Typography>
                </Box>
              </Box>
            </AppCard>

            {/* Summary Metrics */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }, gap: 2 }}>
              <AppCard sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  MATCHED SKILLS
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "success.main" }}>
                  {report.matched_skills.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {report.total_required_skills + report.total_preferred_skills} total
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  REQUIRED MATCHED
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "primary.main" }}>
                  {report.matched_required_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {report.total_required_skills} required
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  PREFERRED MATCHED
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "secondary.main" }}>
                  {report.matched_preferred_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {report.total_preferred_skills} preferred
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  MISSING REQUIRED
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: report.missing_required_skills.length > 0 ? "error.main" : "text.secondary" }}>
                  {report.missing_required_skills.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  high priority gaps
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  MISSING PREFERRED
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: report.missing_preferred_skills.length > 0 ? "warning.main" : "text.secondary" }}>
                  {report.missing_preferred_skills.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  secondary gaps
                </Typography>
              </AppCard>
            </Box>

            {/* Missing Skills Section */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              {/* Missing Required Skills */}
              <AppCard>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <CancelRoundedIcon color="error" fontSize="small" />
                  Missing Required Skills
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Critical requirements not found in your verified profile.
                </Typography>

                {report.missing_required_skills.length === 0 ? (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    Great job! You have satisfied all required skills for this position.
                  </Alert>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {report.missing_required_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                )}
              </AppCard>

              {/* Missing Preferred Skills */}
              <AppCard>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningAmberRoundedIcon color="warning" fontSize="small" />
                  Missing Preferred Skills
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nice-to-have skills that could give you an extra competitive edge.
                </Typography>

                {report.missing_preferred_skills.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    All preferred skills matched or none were specified.
                  </Alert>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {report.missing_preferred_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        color="warning"
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                )}
              </AppCard>
            </Box>

            {/* Skill Comparison Table */}
            <AppCard>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Skill Comparison & Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Detailed breakdown of each requirement, candidate evidence category, weight multiplier, and score contribution.
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "action.hover" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Skill</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Required / Preferred</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Evidence</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Contribution</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.comparison.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{row.skill}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.requirement_type === "Required" ? "Required (2.0x)" : "Preferred (1.0x)"}
                            size="small"
                            variant="outlined"
                            color={row.requirement_type === "Required" ? "primary" : "secondary"}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{getEvidenceChip(row.candidate_evidence)}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={row.contribution > 0 ? "success.main" : "text.secondary"}
                          >
                            {row.contribution > 0 ? `+${row.contribution}%` : "0.0%"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AppCard>
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
}
