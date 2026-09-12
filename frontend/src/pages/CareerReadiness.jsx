import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import { getCareerReadinessReport } from "../services/careerReadinessService";

function getScoreColor(score) {
  if (score >= 75) return "success.main";
  if (score >= 50) return "warning.main";
  return "error.main";
}

export default function CareerReadiness() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCareerReadinessReport();
      setReport(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load Career Readiness Report. Ensure your Resume, Job Match, and Interview are completed."
      );
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchReport() {
      try {
        const data = await getCareerReadinessReport();
        if (isMounted) setReport(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.detail ||
              "Unable to load Career Readiness Report. Ensure your Resume, Job Match, and Interview are completed."
          );
          setReport(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <SectionHeader
            title="Career Readiness Report"
            subtitle="Objective assessment combining deterministic Resume Match, Technical Interview evaluations, and prioritized skill gaps."
          />
          {report && (
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh Report
            </Button>
          )}
        </Box>

        {/* Global Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Missing Prerequisites Error / Guide State */}
        {!loading && error && (
          <Stack spacing={3}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>

            <AppCard>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Complete These Steps to Generate Your Report:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The Career Readiness Report requires a verified candidate profile, an analyzed job description, and at least one completed technical interview session.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="primary.main" gutterBottom>
                        1. Resume & Skills
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Upload your resume and verify your technical skills.
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => navigate("/resume")}>
                      Go to Resume
                    </Button>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="primary.main" gutterBottom>
                        2. Job Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Analyze target job requirements and check your match score.
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => navigate("/job-description")}>
                      Go to Job Match
                    </Button>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="primary.main" gutterBottom>
                        3. Technical Interview
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Answer 5 interview questions and receive AI evaluations.
                      </Typography>
                    </Box>
                    <Button variant="contained" size="small" onClick={() => navigate("/interview")}>
                      Start Interview
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </AppCard>
          </Stack>
        )}

        {/* Report Content */}
        {!loading && report && (
          <Stack spacing={4}>
            {/* 1. Overall Score Hero Card */}
            <AppCard sx={{ textAlign: "center", py: 5, px: 3 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  boxShadow: 3,
                }}
              >
                <AssessmentRoundedIcon sx={{ fontSize: 40 }} />
              </Box>

              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
                Overall Assessment
              </Typography>

              <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, mb: 1 }}>
                Career Readiness
              </Typography>

              <Typography
                variant="h1"
                fontWeight={900}
                sx={{
                  color: getScoreColor(report.career_readiness_score),
                  letterSpacing: -1,
                  my: 1,
                }}
              >
                {report.career_readiness_score}%
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520, mx: "auto" }}>
                Calculated deterministically using 40% Resume–Job Match and 60% Technical Interview Performance.
              </Typography>
            </AppCard>

            {/* 2. Score Breakdown Cards */}
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <CompareArrowsRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                      Resume Match (40%)
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ color: getScoreColor(report.resume_match_score) }}>
                    {report.resume_match_score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Verified Skills vs. Job Requirements
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <MicRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                      Interview Performance (60%)
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ color: getScoreColor(report.average_interview_score * 10) }}>
                    {report.average_interview_score} / 10
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Average of 5 Answer Evaluations ({Math.round(report.average_interview_score * 10)}%)
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <StarRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                      Career Readiness
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ color: getScoreColor(report.career_readiness_score) }}>
                    {report.career_readiness_score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Weighted Composite Score
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* 3. Strengths & Weaknesses */}
            <Grid container spacing={3}>
              {/* Strengths */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AppCard sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <ThumbUpAltRoundedIcon color="success" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={800}>
                      Identified Strengths
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {report.strengths.map((str, idx) => (
                      <Chip
                        key={idx}
                        label={str}
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.85rem", height: "auto", py: 0.5, "& .MuiChip-label": { whiteSpace: "normal" } }}
                      />
                    ))}
                  </Box>
                </AppCard>
              </Grid>

              {/* Weaknesses */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AppCard sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <WarningAmberRoundedIcon color="warning" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={800}>
                      Areas for Improvement
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {report.weaknesses.map((wk, idx) => (
                      <Chip
                        key={idx}
                        label={wk}
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.85rem", height: "auto", py: 0.5, "& .MuiChip-label": { whiteSpace: "normal" } }}
                      />
                    ))}
                  </Box>
                </AppCard>
              </Grid>
            </Grid>

            {/* 4. Missing Skills (Required & Preferred) */}
            <AppCard>
              <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                Skill Coverage Gaps
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Skills identified in the job description that were not matched in your verified profile.
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" fontWeight={700} color="error.main" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                    Missing Required Skills ({report.missing_required_skills.length})
                  </Typography>
                  {report.missing_required_skills.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {report.missing_required_skills.map((s, idx) => (
                        <Chip key={idx} label={s} color="error" variant="outlined" sx={{ fontWeight: 600 }} />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      All required skills matched!
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" fontWeight={700} color="warning.main" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                    Missing Preferred Skills ({report.missing_preferred_skills.length})
                  </Typography>
                  {report.missing_preferred_skills.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {report.missing_preferred_skills.map((s, idx) => (
                        <Chip key={idx} label={s} color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      All preferred skills matched!
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AppCard>

            {/* 5. Priority Skills (Numbered List) */}
            <AppCard>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <FormatListNumberedRoundedIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={800}>
                  Priority Skills to Learn First
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Prioritized systematically: 1. Missing Required Skills &rarr; 2. Weak Interview Topics &rarr; 3. Missing Preferred Skills.
              </Typography>

              {report.priority_skills.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {report.priority_skills.map((skill, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 2,
                        py: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            bgcolor: index === 0 ? "error.main" : index < 3 ? "warning.main" : "primary.main",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                            fontWeight: 800,
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={skill}
                        slotProps={{ primary: { fontWeight: 700, fontSize: "0.95rem" } }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No priority skill gaps identified. Excellent job!
                </Typography>
              )}
            </AppCard>

            {/* 6. Stored AI Feedback */}
            <AppCard>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <LightbulbRoundedIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={800}>
                  Interview Answer Feedback
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review feedback from your evaluated technical interview questions.
              </Typography>

              <Stack spacing={2.5}>
                {report.interview_feedback.map((item, idx) => (
                  <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                          Question {idx + 1}: {item.topic}
                        </Typography>
                        <Chip
                          label={`Score: ${item.overall_score} / 10`}
                          size="small"
                          sx={{ fontWeight: 700, bgcolor: "action.hover" }}
                        />
                      </Box>

                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                        {item.question_text}
                      </Typography>

                      {item.summary && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: "italic" }}>
                          &ldquo;{item.summary}&rdquo;
                        </Typography>
                      )}

                      <Divider sx={{ my: 1.5 }} />

                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", display: "block", mb: 0.5 }}>
                        Feedback
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                        {item.feedback}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </AppCard>
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
}
