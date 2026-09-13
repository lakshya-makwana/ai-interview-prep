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
import PageHeader from "../components/PageHeader";
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
      <Stack spacing={2.5}>
        {/* Standard Page Header */}
        <PageHeader
          title="Career Readiness"
          description="Objective assessment combining deterministic Resume Match, Technical Interview evaluations, and prioritized skill gaps."
          action={
            report ? (
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshRoundedIcon fontSize="small" />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh Report
              </Button>
            ) : null
          }
        />

        {/* Global Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* Missing Prerequisites Error / Guide State */}
        {!loading && error && (
          <Stack spacing={3}>
            <Alert severity="info">
              {error}
            </Alert>

            <AppCard>
              <SectionHeader
                title="Steps to Generate Your Readiness Report"
                subtitle="The Career Readiness Report requires a verified candidate profile, an analyzed job description, and a completed technical interview."
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main" gutterBottom>
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
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main" gutterBottom>
                        2. Job Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Analyze target job requirements and check your match score.
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => navigate("/job-description")}>
                      Go to Job Description
                    </Button>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main" gutterBottom>
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
          <Stack spacing={3}>
            {/* 1. Overall Score Card */}
            <AppCard sx={{ textAlign: "center", py: 3, px: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <AssessmentRoundedIcon />
              </Box>

              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Composite Assessment
              </Typography>

              <Typography variant="h5" fontWeight={700} sx={{ mt: 0.25, mb: 0.5 }}>
                Career Readiness Score
              </Typography>

              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  color: getScoreColor(report.career_readiness_score),
                  my: 0.5,
                }}
              >
                {report.career_readiness_score}%
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: "auto" }}>
                Calculated deterministically: 40% Resume Match and 60% Technical Interview Performance.
              </Typography>
            </AppCard>

            {/* 2. Score Breakdown Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, mb: 0.5 }}>
                    <CompareArrowsRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                      Resume Match (40%)
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={800} sx={{ color: getScoreColor(report.resume_match_score) }}>
                    {report.resume_match_score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                    Verified Skills vs. Job Requirements
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, mb: 0.5 }}>
                    <MicRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                      Interview Score (60%)
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={800} sx={{ color: getScoreColor(report.average_interview_score * 10) }}>
                    {report.average_interview_score} / 10
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                    Average of 5 Answer Evaluations ({Math.round(report.average_interview_score * 10)}%)
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, mb: 0.5 }}>
                    <StarRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                      Composite Readiness
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={800} sx={{ color: getScoreColor(report.career_readiness_score) }}>
                    {report.career_readiness_score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                    Weighted Composite Score
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* 3. Strengths & Weaknesses */}
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <AppCard sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <ThumbUpAltRoundedIcon color="success" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Identified Strengths
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {report.strengths.map((str, idx) => (
                      <Chip
                        key={idx}
                        label={str}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </AppCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <AppCard sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <WarningAmberRoundedIcon color="warning" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Areas for Improvement
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {report.weaknesses.map((wk, idx) => (
                      <Chip
                        key={idx}
                        label={wk}
                        color="warning"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </AppCard>
              </Grid>
            </Grid>

            {/* 4. Missing Skills */}
            <AppCard>
              <SectionHeader
                title="Skill Coverage Gaps"
                subtitle="Skills identified in the job description that were not matched in your verified profile."
              />

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" fontWeight={700} color="error.main" textTransform="uppercase" display="block" sx={{ mb: 1 }}>
                    Missing Required Skills ({report.missing_required_skills.length})
                  </Typography>
                  {report.missing_required_skills.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {report.missing_required_skills.map((s, idx) => (
                        <Chip key={idx} label={s} color="error" variant="outlined" size="small" />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="success.main">
                      All required skills matched.
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" fontWeight={700} color="warning.main" textTransform="uppercase" display="block" sx={{ mb: 1 }}>
                    Missing Preferred Skills ({report.missing_preferred_skills.length})
                  </Typography>
                  {report.missing_preferred_skills.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {report.missing_preferred_skills.map((s, idx) => (
                        <Chip key={idx} label={s} color="warning" variant="outlined" size="small" />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="success.main">
                      All preferred skills matched.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AppCard>

            {/* 5. Priority Skills List */}
            <AppCard>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <FormatListNumberedRoundedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Priority Skills to Learn First
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Prioritized systematically: Missing Required Skills &rarr; Weak Interview Topics &rarr; Missing Preferred Skills.
              </Typography>

              {report.priority_skills.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {report.priority_skills.map((skill, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 1.5,
                        py: 1,
                        mb: 0.75,
                        borderRadius: 1.5,
                        bgcolor: "action.hover",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: 1,
                            bgcolor: index === 0 ? "error.main" : index < 3 ? "warning.main" : "primary.main",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={skill}
                        slotProps={{ primary: { fontWeight: 600, fontSize: "0.875rem" } }}
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

            {/* 6. Interview Feedback */}
            <AppCard>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <LightbulbRoundedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Interview Answer Feedback
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Summary feedback from your latest evaluated interview session.
              </Typography>

              <Stack spacing={2}>
                {report.interview_feedback.map((item, idx) => (
                  <Card key={idx} variant="outlined" sx={{ borderRadius: 1.5 }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                          Question {idx + 1}: {item.topic}
                        </Typography>
                        <Chip
                          label={`Score: ${item.overall_score} / 10`}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>

                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        {item.question_text}
                      </Typography>

                      {item.summary && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: "italic" }}>
                          &ldquo;{item.summary}&rdquo;
                        </Typography>
                      )}

                      <Divider sx={{ my: 1.25 }} />

                      <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" display="block" sx={{ mb: 0.25 }}>
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
      </Stack>
    </DashboardLayout>
  );
}
