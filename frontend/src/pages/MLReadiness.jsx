import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
  alpha,
  useTheme,
} from "@mui/material";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMLReadiness } from "../services/mlReadinessService";

export default function MLReadiness() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMLReadiness();
      setData(res);
    } catch (err) {
      console.error("Failed to load ML readiness:", err);
      setError(
        err?.response?.data?.detail ||
          "Failed to load ML readiness assessment. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getMLReadiness()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load ML readiness:", err);
          setError(
            err?.response?.data?.detail ||
              "Failed to load ML readiness assessment. Please verify your connection."
          );
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <Stack spacing={2.5}>
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              ML Readiness Gate
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deterministic data-quality and sample-size evaluation prior to Phase 8 model training.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={loadData}
            disabled={loading}
          >
            Re-evaluate
          </Button>
        </Box>

        {/* Global Error */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* Empty State when no records exist */}
        {!loading && data && data.total_dataset_records === 0 && (
          <EmptyState
            icon={FactCheckRoundedIcon}
            title="No Interview Data Collected"
            description="Complete technical interview sessions to begin gathering structured question-evaluation records. ML readiness can only be determined once interview data exists."
            actionLabel="Start Technical Interview"
            onAction={() => navigate("/interview")}
            secondaryActionLabel="Back to Dashboard"
            onSecondaryAction={() => navigate("/")}
          />
        )}

        {/* Loaded Assessment View */}
        {!loading && data && data.total_dataset_records > 0 && (
          <>
            {/* 1. Readiness Status Banner */}
            <AppCard
              sx={{
                borderLeft: 4,
                borderLeftColor: data.is_ready ? "success.main" : "warning.main",
                bgcolor: data.is_ready
                  ? alpha(theme.palette.success.main, 0.04)
                  : alpha(theme.palette.warning.main, 0.04),
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {data.is_ready ? (
                    <CheckCircleRoundedIcon color="success" sx={{ fontSize: 32 }} />
                  ) : (
                    <PendingRoundedIcon color="warning" sx={{ fontSize: 32 }} />
                  )}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="h6" fontWeight={700}>
                        {data.readiness_status}
                      </Typography>
                      <StatusChip
                        label={data.is_ready ? "Gate Passed" : "Gate Pending"}
                        color={data.is_ready ? "success" : "warning"}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, maxWidth: 840, lineHeight: 1.5 }}
                    >
                      {data.summary}
                    </Typography>
                  </Box>
                </Box>

                {!data.is_ready && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<MicRoundedIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate("/interview")}
                    sx={{ flexShrink: 0 }}
                  >
                    Collect More Interviews
                  </Button>
                )}
              </Box>
            </AppCard>

            {/* 2. Dataset Metrics Overview */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    Total Dataset Records
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {data.total_dataset_records}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
                      / 100 target
                    </Typography>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((data.total_dataset_records / 100) * 100, 100)}
                    color={data.total_dataset_records >= 100 ? "success" : "primary"}
                    sx={{ mt: 1.25 }}
                  />
                </AppCard>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    Completed Interviews
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {data.completed_interviews}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.25 }}>
                    Distinct evaluation sessions
                  </Typography>
                </AppCard>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    Answered Questions
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {data.answered_questions}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.25 }}>
                    Evaluated candidate responses
                  </Typography>
                </AppCard>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    Average Evaluation Score
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {data.average_score.toFixed(1)}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      / 10
                    </Typography>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.25 }}>
                    Range: {data.score_distribution.min_score} – {data.score_distribution.max_score}
                  </Typography>
                </AppCard>
              </Grid>
            </Grid>

            {/* 3. Criteria Checklist */}
            <AppCard>
              <SectionHeader
                title="Readiness Criteria Checklist"
                subtitle="All four deterministic engineering criteria must pass before machine learning training can begin."
              />

              <Grid container spacing={1.5}>
                {data.criteria.map((criterion) => (
                  <Grid key={criterion.name} size={{ xs: 12, md: 6 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        borderRadius: 1,
                        bgcolor: criterion.passed
                          ? alpha(theme.palette.success.main, 0.025)
                          : alpha(theme.palette.background.default, 0.4),
                        border: 1,
                        borderColor: criterion.passed
                          ? alpha(theme.palette.success.main, 0.3)
                          : "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                        {criterion.passed ? (
                          <CheckCircleRoundedIcon color="success" sx={{ fontSize: 20, mt: 0.2 }} />
                        ) : (
                          <CancelRoundedIcon color="error" sx={{ fontSize: 20, mt: 0.2 }} />
                        )}

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap>
                              {criterion.name}
                            </Typography>
                            <StatusChip
                              label={criterion.passed ? "Passed" : "Action Needed"}
                              color={criterion.passed ? "success" : "warning"}
                            />
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                            {criterion.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "0.75rem",
                              pt: 0.75,
                              borderTop: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Current: <strong>{criterion.current_value}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Target: <strong>{criterion.target_value}</strong>
                            </Typography>
                          </Box>

                          {criterion.detail && (
                            <Typography
                              variant="caption"
                              color={criterion.passed ? "text.secondary" : "warning.main"}
                              sx={{ display: "block", mt: 0.75, fontStyle: "italic" }}
                            >
                              {criterion.detail}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AppCard>

            {/* 4. Topic and Difficulty Distributions */}
            <Grid container spacing={2}>
              {/* Topic Distribution Table */}
              <Grid size={{ xs: 12, md: 7 }}>
                <AppCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Box sx={{ p: 2, pb: 1.25 }}>
                    <SectionHeader
                      title="Topic Coverage"
                      subtitle="Record distribution across technical domains."
                      sx={{ mb: 0 }}
                    />
                  </Box>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Topic</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Records</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Share</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.topic_distribution.map((item) => (
                          <TableRow key={item.topic} hover>
                            <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                              {item.topic}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.8125rem" }}>
                              {item.count}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                              {item.percentage}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AppCard>
              </Grid>

              {/* Difficulty Distribution Cards */}
              <Grid size={{ xs: 12, md: 5 }}>
                <AppCard>
                  <SectionHeader
                    title="Difficulty Coverage"
                    subtitle="Representation across complexity tiers."
                  />

                  <Stack spacing={1.5}>
                    {data.difficulty_distribution.map((item) => {
                      const colorMap = {
                        Easy: "success",
                        Medium: "primary",
                        Hard: "warning",
                      };
                      const color = colorMap[item.difficulty] || "primary";

                      return (
                        <Paper
                          key={item.difficulty}
                          variant="outlined"
                          sx={{ p: 1.5, borderRadius: 1 }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {item.difficulty}
                              </Typography>
                              <Chip
                                label={`${item.count} records`}
                                size="small"
                                color={item.count > 0 ? color : "default"}
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.6875rem" }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              {item.percentage}%
                            </Typography>
                          </Box>

                          <LinearProgress
                            variant="determinate"
                            value={item.percentage}
                            color={color}
                            sx={{ height: 5 }}
                          />
                        </Paper>
                      );
                    })}
                  </Stack>
                </AppCard>
              </Grid>
            </Grid>

            {/* 5. Deterministic Recommendations */}
            <AppCard>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <LightbulbRoundedIcon color="primary" sx={{ fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Deterministic Next Steps
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {data.recommendations.map((rec, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      mb: 0.5,
                      borderRadius: 1,
                      bgcolor: "action.hover",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 26, color: "primary.main" }}>
                      <RuleRoundedIcon sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec}
                      slotProps={{ primary: { fontSize: "0.8125rem", color: "text.primary" } }}
                    />
                  </ListItem>
                ))}
              </List>
            </AppCard>
          </>
        )}
      </Stack>
    </DashboardLayout>
  );
}
