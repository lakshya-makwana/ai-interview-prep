import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import { getProgress } from "../services/progressService";

function getScoreColor(score) {
  if (score >= 8.0) return "success.main";
  if (score >= 6.5) return "primary.main";
  if (score >= 5.0) return "warning.main";
  return "error.main";
}

function getTrendChip(status) {
  switch (status) {
    case "Improving":
      return {
        label: "Improving",
        color: "success",
        icon: <TrendingUpRoundedIcon sx={{ fontSize: "14px !important" }} />,
      };
    case "Declining":
      return {
        label: "Declining",
        color: "warning",
        icon: <TrendingDownRoundedIcon sx={{ fontSize: "14px !important" }} />,
      };
    default:
      return {
        label: "Stable",
        color: "default",
        icon: <TrendingFlatRoundedIcon sx={{ fontSize: "14px !important" }} />,
      };
  }
}

function getConsistencyChip(rating) {
  switch (rating) {
    case "Highly Consistent":
      return { color: "success", variant: "filled" };
    case "Moderately Consistent":
      return { color: "info", variant: "outlined" };
    default:
      return { color: "warning", variant: "outlined" };
  }
}

export default function Progress() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProgress();
      setReport(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load candidate progress intelligence. Please try again."
      );
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const summary = report?.summary;
  const interviewHistory = report?.interview_history || [];
  const topicTrends = report?.topic_trends || [];
  const initialScore = interviewHistory.length > 0 ? interviewHistory[0].average_score : null;

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        {/* Page Header */}
        <SectionHeader
          title="Progress Intelligence"
          subtitle="Track your interview performance trajectory, skill topic mastery, and score consistency over time."
          action={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={fetchProgress}
                disabled={loading}
                sx={{ textTransform: "none", fontSize: "0.8125rem" }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<MicRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={() => navigate("/interview")}
                sx={{ textTransform: "none", fontSize: "0.8125rem" }}
              >
                Start Practice Interview
              </Button>
            </Stack>
          }
          sx={{ mb: 2.5 }}
        />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchProgress}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Content */}
        {!loading && report && (
          <Stack spacing={2.5}>
            {/* Insufficient Data State (< 2 completed interviews) */}
            {!report.has_sufficient_data && (
              <Stack spacing={2.5}>
                <EmptyState
                  icon={TimelineRoundedIcon}
                  title="Insufficient Interview History"
                  description="Progress Intelligence requires at least two completed interview sessions to calculate longitudinal trends, performance trajectories, and topic progression."
                  actionLabel="Start an Interview"
                  onAction={() => navigate("/interview")}
                  secondaryActionLabel="View Interview History"
                  onSecondaryAction={() => navigate("/interview-history")}
                />

                {summary && summary.total_interviews === 1 && (
                  <AppCard>
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Baseline Established
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            1 of 2 interviews completed. Complete 1 more interview to unlock trend analytics.
                          </Typography>
                        </Box>
                        <Chip
                          label={`Baseline Score: ${summary.average_score?.toFixed(1)} / 10`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={50}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Stack>
                  </AppCard>
                )}
              </Stack>
            )}

            {/* Sufficient Data State (>= 2 completed interviews) */}
            {report.has_sufficient_data && (
              <>
                {/* Metric Summary Cards */}
                <Grid container spacing={2}>
                  {/* Card 1: Completed Sessions */}
                  <Grid item xs={12} sm={6} md={3}>
                    <AppCard>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          Completed Sessions
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: "-0.02em" }}>
                          {summary?.total_interviews}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {summary?.total_questions_answered} total questions answered
                        </Typography>
                      </Stack>
                    </AppCard>
                  </Grid>

                  {/* Card 2: Overall Average Score */}
                  <Grid item xs={12} sm={6} md={3}>
                    <AppCard>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          Average Performance
                        </Typography>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                              color: getScoreColor(summary?.average_score || 0),
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {summary?.average_score?.toFixed(1)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            / 10
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Range: {summary?.lowest_score?.toFixed(1)} min — {summary?.highest_score?.toFixed(1)} max
                        </Typography>
                      </Stack>
                    </AppCard>
                  </Grid>

                  {/* Card 3: Net Trajectory */}
                  <Grid item xs={12} sm={6} md={3}>
                    <AppCard>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          Net Trajectory
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                              color:
                                (summary?.net_improvement || 0) > 0
                                  ? "success.main"
                                  : (summary?.net_improvement || 0) < 0
                                  ? "warning.main"
                                  : "text.primary",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {(summary?.net_improvement || 0) > 0 ? "+" : ""}
                            {summary?.net_improvement?.toFixed(1)} pts
                          </Typography>
                          <Chip
                            size="small"
                            label={`${(summary?.improvement_percentage || 0) > 0 ? "+" : ""}${summary?.improvement_percentage?.toFixed(1)}%`}
                            color={
                              (summary?.improvement_percentage || 0) > 0
                                ? "success"
                                : (summary?.improvement_percentage || 0) < 0
                                ? "warning"
                                : "default"
                            }
                            sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Baseline: {initialScore?.toFixed(1)} → Latest: {summary?.latest_score?.toFixed(1)}
                        </Typography>
                      </Stack>
                    </AppCard>
                  </Grid>

                  {/* Card 4: Consistency Rating */}
                  <Grid item xs={12} sm={6} md={3}>
                    <AppCard>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          Session Consistency
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.25 }}>
                          <Chip
                            size="small"
                            label={summary?.consistency_rating || "Evaluated"}
                            color={getConsistencyChip(summary?.consistency_rating).color}
                            variant={getConsistencyChip(summary?.consistency_rating).variant}
                            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ pt: 0.5 }}>
                          Evaluated across all completed interviews
                        </Typography>
                      </Stack>
                    </AppCard>
                  </Grid>
                </Grid>

                {/* Session Breakdown Table */}
                <AppCard>
                  <SectionHeader
                    title="Interview Performance History"
                    subtitle="Chronological score breakdown across completed interview sessions"
                    action={
                      <Button
                        size="small"
                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                        onClick={() => navigate("/interview-history")}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        View Full History
                      </Button>
                    }
                  />

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "background.default" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Session</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Role / Focus</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                            Questions
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                            Overall Score
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                            Technical
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                            Communication
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                            Trend vs Prior
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {interviewHistory.map((item, idx) => {
                          const prev = idx > 0 ? interviewHistory[idx - 1] : null;
                          const delta = prev ? item.average_score - prev.average_score : null;

                          return (
                            <TableRow key={item.interview_id} hover>
                              <TableCell sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                                #{item.interview_number}
                              </TableCell>
                              <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                                {item.date
                                  ? new Date(item.date).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "—"}
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.8125rem" }}>
                                <Typography variant="body2" fontWeight={500} sx={{ fontSize: "0.8125rem" }}>
                                  {item.focus || "Technical Practice Interview"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: "0.8125rem" }}>
                                {item.total_questions}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  size="small"
                                  label={`${item.average_score.toFixed(1)} / 10`}
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.75rem",
                                    bgcolor:
                                      item.average_score >= 8.0
                                        ? "rgba(16, 185, 129, 0.1)"
                                        : item.average_score >= 6.5
                                        ? "rgba(59, 130, 246, 0.1)"
                                        : item.average_score >= 5.0
                                        ? "rgba(245, 158, 11, 0.1)"
                                        : "rgba(239, 68, 68, 0.1)",
                                    color:
                                      item.average_score >= 8.0
                                        ? "success.main"
                                        : item.average_score >= 6.5
                                        ? "primary.main"
                                        : item.average_score >= 5.0
                                        ? "warning.main"
                                        : "error.main",
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                                {item.technical_score.toFixed(1)}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                                {item.communication_score.toFixed(1)}
                              </TableCell>
                              <TableCell align="right">
                                {delta === null ? (
                                  <Chip
                                    size="small"
                                    label="Baseline"
                                    variant="outlined"
                                    sx={{ fontSize: "0.7rem", height: 20 }}
                                  />
                                ) : (
                                  <Chip
                                    size="small"
                                    label={`${delta > 0 ? "+" : ""}${delta.toFixed(1)} pts`}
                                    color={delta > 0 ? "success" : delta < 0 ? "warning" : "default"}
                                    sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AppCard>

                {/* Topic Mastery & Trajectories Table */}
                {topicTrends && topicTrends.length > 0 && (
                  <AppCard>
                    <SectionHeader
                      title="Topic Mastery & Trajectories"
                      subtitle="Longitudinal performance across early vs. later session halves per technical topic"
                    />

                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: "background.default" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Topic</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                              Evaluations Count
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                              First Score
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                              Latest Score
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                              Trajectory Shift
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {topicTrends.map((item) => {
                            const trendConfig = getTrendChip(item.status);
                            return (
                              <TableRow key={item.topic} hover>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                                  {item.topic}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: "0.8125rem" }}>
                                  {item.evaluations_count}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                                  {item.first_score.toFixed(1)} / 10
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                                  {item.latest_score.toFixed(1)} / 10
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 600,
                                      color:
                                        item.delta > 0
                                          ? "success.main"
                                          : item.delta < 0
                                          ? "warning.main"
                                          : "text.secondary",
                                    }}
                                  >
                                    {item.delta > 0 ? "+" : ""}
                                    {item.delta.toFixed(1)} pts
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    size="small"
                                    icon={trendConfig.icon}
                                    label={trendConfig.label}
                                    color={trendConfig.color}
                                    sx={{
                                      fontSize: "0.7rem",
                                      height: 22,
                                      fontWeight: 600,
                                      "& .MuiChip-icon": { ml: 0.5 },
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AppCard>
                )}

                {/* Topic Highlights: Strongest & Focus Areas */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <AppCard sx={{ height: "100%" }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
                          <Typography variant="subtitle2" fontWeight={600}>
                            Strongest Topics
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Topics where you consistently score highest across interviews:
                        </Typography>

                        {report.strongest_topics && report.strongest_topics.length > 0 ? (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {report.strongest_topics.map((topic) => (
                              <Chip
                                key={topic}
                                label={topic}
                                size="small"
                                color="success"
                                variant="outlined"
                                icon={<StarRoundedIcon sx={{ fontSize: "14px !important" }} />}
                                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            Additional practice questions needed to identify dominant strengths.
                          </Typography>
                        )}
                      </Stack>
                    </AppCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <AppCard sx={{ height: "100%" }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WarningAmberRoundedIcon sx={{ fontSize: 18, color: "warning.main" }} />
                          <Typography variant="subtitle2" fontWeight={600}>
                            Focus Areas / Weakest Topics
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Topics prioritized for improvement in subsequent adaptive sessions:
                        </Typography>

                        {report.weakest_topics && report.weakest_topics.length > 0 ? (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {report.weakest_topics.map((topic) => (
                              <Chip
                                key={topic}
                                label={topic}
                                size="small"
                                color="warning"
                                variant="outlined"
                                icon={<TrendingDownRoundedIcon sx={{ fontSize: "14px !important" }} />}
                                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            No underperforming topics identified. All evaluated topics meet standard readiness.
                          </Typography>
                        )}
                      </Stack>
                    </AppCard>
                  </Grid>
                </Grid>

                {/* Deterministic Progress Insights */}
                {report.insights && report.insights.length > 0 && (
                  <AppCard>
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <InsightsRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Deterministic Progress Insights
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Rule-based analysis calculated from your session trends, score deltas, and topic trajectories.
                      </Typography>

                      <Divider sx={{ my: 0.5 }} />

                      <List disablePadding sx={{ "& > :not(:last-child)": { mb: 1 } }}>
                        {report.insights.map((insight, idx) => (
                          <ListItem
                            key={idx}
                            disableGutters
                            sx={{
                              p: 1.25,
                              borderRadius: 1,
                              bgcolor: "action.hover",
                              alignItems: "flex-start",
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
                              <LightbulbRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={insight}
                              primaryTypographyProps={{
                                variant: "body2",
                                sx: { fontSize: "0.8125rem", lineHeight: 1.5 },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </AppCard>
                )}
              </>
            )}
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
}
