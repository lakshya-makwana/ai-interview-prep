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

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
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
          icon={<CheckCircleRoundedIcon fontSize="small" />}
          label="Strong (1.0)"
          size="small"
          color="success"
        />
      );
    case "Partial":
      return (
        <Chip
          icon={<WarningAmberRoundedIcon fontSize="small" />}
          label="Partial (0.5)"
          size="small"
          color="warning"
        />
      );
    case "Missing":
    default:
      return (
        <Chip
          icon={<CancelRoundedIcon fontSize="small" />}
          label="Missing (0.0)"
          size="small"
          variant="outlined"
          color="error"
        />
      );
  }
}

export default function JobMatch() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
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
      <Stack spacing={3}>
        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Job Match
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Deterministic weighted matching between verified candidate skills and AI-extracted job requirements.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon fontSize="small" />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh Match
          </Button>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* 404 / Missing Pre-requisite alert */}
        {!loading && errorStatus === 404 && (
          <EmptyState
            icon={CompareArrowsRoundedIcon}
            title="Prerequisites Needed for Matching"
            description={errorMessage}
            actionLabel="Verify Skills"
            onAction={() => navigate("/resume")}
            secondaryActionLabel="Analyze Job Description"
            onSecondaryAction={() => navigate("/job-description")}
          />
        )}

        {/* General Error */}
        {!loading && errorStatus && errorStatus !== 404 && (
          <Alert severity="error">
            {errorMessage}
          </Alert>
        )}

        {/* Report Content */}
        {!loading && !errorStatus && report && (
          <Stack spacing={3}>
            {/* Overall Match Card */}
            <AppCard>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4 }}>
                {/* Score Section */}
                <Box sx={{ textAlign: "center", minWidth: 200 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: "0.06em", fontWeight: 700, textTransform: "uppercase" }}>
                    Overall Match
                  </Typography>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{ color: getScoreColor(report.match_score), my: 0.5 }}
                  >
                    {report.match_score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Weighted Deterministic Score
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
                      height: 8,
                      borderRadius: 4,
                      mb: 1.5,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getScoreColor(report.match_score),
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Required skills (2.0x weight), Preferred skills (1.0x weight). Exact match provides 100% credit; partial match provides 50%.
                  </Typography>
                </Box>
              </Box>
            </AppCard>

            {/* Summary Metrics */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }, gap: 2 }}>
              <AppCard sx={{ textAlign: "center" }} contentSx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                  Matched Skills
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "success.main" }}>
                  {report.matched_skills.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {report.total_required_skills + report.total_preferred_skills} total
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center" }} contentSx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                  Required Matched
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "primary.main" }}>
                  {report.matched_required_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {report.total_required_skills} required
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center" }} contentSx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                  Preferred Matched
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "secondary.main" }}>
                  {report.matched_preferred_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {report.total_preferred_skills} preferred
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center" }} contentSx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                  Missing Required
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: report.missing_required_skills.length > 0 ? "error.main" : "text.secondary" }}>
                  {report.missing_required_skills.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  high priority gaps
                </Typography>
              </AppCard>

              <AppCard sx={{ textAlign: "center" }} contentSx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                  Missing Preferred
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
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
              {/* Missing Required Skills */}
              <AppCard>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <CancelRoundedIcon color="error" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Missing Required Skills
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Critical requirements not found in your verified candidate profile.
                </Typography>

                {report.missing_required_skills.length === 0 ? (
                  <Alert severity="success">
                    All required skills have been matched.
                  </Alert>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {report.missing_required_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        color="error"
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              </AppCard>

              {/* Missing Preferred Skills */}
              <AppCard>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <WarningAmberRoundedIcon color="warning" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Missing Preferred Skills
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Optional skills that could provide a competitive advantage.
                </Typography>

                {report.missing_preferred_skills.length === 0 ? (
                  <Alert severity="info">
                    All preferred skills matched or none were specified.
                  </Alert>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {report.missing_preferred_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        color="warning"
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              </AppCard>
            </Box>

            {/* Skill Comparison Table */}
            <AppCard>
              <SectionHeader
                title="Skill Comparison & Breakdown"
                subtitle="Detailed breakdown of requirements, evidence categories, and weighted contribution."
              />

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Skill</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Evidence</TableCell>
                      <TableCell align="right">Contribution</TableCell>
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
      </Stack>
    </DashboardLayout>
  );
}
