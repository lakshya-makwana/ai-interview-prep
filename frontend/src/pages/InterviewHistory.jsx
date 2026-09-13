import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import { getDataset, getDatasetStatistics } from "../services/datasetService";

function getDifficultyColor(diff) {
  switch (diff?.toLowerCase()) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "default";
  }
}

function RowItem({ row, isOpen, onToggle }) {
  return (
    <>
      <TableRow
        hover
        onClick={onToggle}
        sx={{
          cursor: "pointer",
          backgroundColor: isOpen ? "action.hover" : "inherit",
          "& > *": { borderBottom: isOpen ? "unset" : undefined },
        }}
      >
        <TableCell sx={{ width: 44, pr: 0 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {isOpen ? <KeyboardArrowUpRoundedIcon fontSize="small" /> : <KeyboardArrowDownRoundedIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap", color: "text.secondary", fontSize: "0.8rem" }}>
          {row.created_at ? new Date(row.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) : "—"}
        </TableCell>
        <TableCell>
          <Chip
            label={row.topic}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={row.difficulty}
            size="small"
            color={getDifficultyColor(row.difficulty)}
            sx={{ fontWeight: 600 }}
          />
        </TableCell>
        <TableCell sx={{ maxWidth: 360 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {row.question_text}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <StatusChip
            label={`${row.overall_score.toFixed(1)} / 10`}
            color={row.overall_score >= 8.0 ? "success" : row.overall_score >= 6.0 ? "primary" : "warning"}
          />
        </TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: "action.hover" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2.5, px: 1 }}>
              <Grid container spacing={2.5}>
                {/* Candidate Answer Box */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "text.secondary", display: "block" }}>
                    Candidate Answer
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: "background.paper",
                      borderRadius: 1.5,
                      maxHeight: 200,
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {row.candidate_answer || "No answer recorded."}
                    </Typography>
                  </Paper>

                  {/* Feedback Card */}
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "text.secondary", display: "block", mt: 2 }}>
                    AI Evaluator Feedback
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: "rgba(16, 185, 129, 0.06)",
                      borderColor: "rgba(16, 185, 129, 0.25)",
                      borderRadius: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <LightbulbRoundedIcon sx={{ color: "success.main", fontSize: 18, mt: 0.2 }} />
                      <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                        {row.feedback}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Score Breakdown & Chips */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "text.secondary", display: "block" }}>
                    Dimension Scores
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: "background.paper",
                      borderRadius: 1.5,
                    }}
                  >
                    <Stack spacing={1.25}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Technical Correctness</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.technical_correctness.toFixed(1)} / 10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.technical_correctness * 10} sx={{ height: 5, borderRadius: 2.5, mt: 0.5 }} />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Completeness</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.completeness.toFixed(1)} / 10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.completeness * 10} color="secondary" sx={{ height: 5, borderRadius: 2.5, mt: 0.5 }} />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Relevance</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.relevance.toFixed(1)} / 10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.relevance * 10} color="success" sx={{ height: 5, borderRadius: 2.5, mt: 0.5 }} />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Communication</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.communication.toFixed(1)} / 10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.communication * 10} color="warning" sx={{ height: 5, borderRadius: 2.5, mt: 0.5 }} />
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Strengths & Missing Concepts */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: "block", mb: 0.5, textTransform: "uppercase" }}>
                      Demonstrated Strengths
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                      {Array.isArray(row.strengths) && row.strengths.length > 0 ? (
                        row.strengths.map((s, idx) => (
                          <Chip key={idx} label={s} size="small" color="success" variant="outlined" />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">None logged</Typography>
                      )}
                    </Stack>

                    <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700, display: "block", mb: 0.5, textTransform: "uppercase" }}>
                      Missing Concepts & Gaps
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {Array.isArray(row.missing_concepts) && row.missing_concepts.length > 0 ? (
                        row.missing_concepts.map((m, idx) => (
                          <Chip key={idx} label={m} size="small" color="warning" variant="outlined" />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">None logged</Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function InterviewHistory() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    total_interviews: 0,
    total_answered_questions: 0,
    total_dataset_records: 0,
    average_overall_score: 0.0,
    topics_encountered: [],
    difficulty_distribution: { Easy: 0, Medium: 0, Hard: 0 },
  });
  const [openRowId, setOpenRowId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [datasetData, statsData] = await Promise.all([
        getDataset(),
        getDatasetStatistics(),
      ]);
      setRecords(datasetData);
      setStats(statsData);
      if (datasetData.length > 0) {
        setOpenRowId(datasetData[0].id);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load interview dataset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [datasetData, statsData] = await Promise.all([
          getDataset(),
          getDatasetStatistics(),
        ]);
        if (!ignore) {
          setRecords(datasetData);
          setStats(statsData);
          if (datasetData.length > 0) {
            setOpenRowId(datasetData[0].id);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.detail || "Failed to load interview dataset.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleRow = (id) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  return (
    <DashboardLayout>
      <Stack spacing={2.5}>
        {/* Standard Page Header */}
        <PageHeader
          title="Interview History"
          description="Structured interview dataset collected for evaluation analytics and progress tracking."
          action={
            <Stack direction="row" spacing={1.5}>
              <Tooltip title="Refresh Dataset">
                <IconButton onClick={fetchData} size="small" sx={{ border: 1, borderColor: "divider" }}>
                  <RefreshRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                size="small"
                startIcon={<MicRoundedIcon fontSize="small" />}
                onClick={() => navigate("/interview")}
              >
                New Interview
              </Button>
            </Stack>
          }
        />

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            {/* Summary KPI Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "action.hover", color: "primary.main" }}>
                      <HistoryRoundedIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                        Interviews
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {stats.total_interviews}
                      </Typography>
                    </Box>
                  </Stack>
                </AppCard>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "action.hover", color: "success.main" }}>
                      <QuestionAnswerRoundedIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                        Answered
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {stats.total_answered_questions}
                      </Typography>
                    </Box>
                  </Stack>
                </AppCard>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "action.hover", color: "secondary.main" }}>
                      <TableChartRoundedIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                        Dataset Rows
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {stats.total_dataset_records}
                      </Typography>
                    </Box>
                  </Stack>
                </AppCard>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <AppCard contentSx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "action.hover", color: "warning.main" }}>
                      <StarRoundedIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                        Avg Score
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {stats.average_overall_score > 0 ? `${stats.average_overall_score.toFixed(1)} / 10` : "—"}
                      </Typography>
                    </Box>
                  </Stack>
                </AppCard>
              </Grid>
            </Grid>

            {/* Topics & Difficulty Chips */}
            {records.length > 0 && (
              <AppCard contentSx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" fontWeight={700} textTransform="uppercase" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                      Topics Encountered ({stats.topics_encountered.length})
                    </Typography>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                      {stats.topics_encountered.map((topic, i) => (
                        <Chip
                          key={i}
                          label={topic}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" fontWeight={700} textTransform="uppercase" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                      Difficulty Distribution
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`Easy: ${stats.difficulty_distribution?.Easy || 0}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        label={`Medium: ${stats.difficulty_distribution?.Medium || 0}`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                      <Chip
                        label={`Hard: ${stats.difficulty_distribution?.Hard || 0}`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AppCard>
            )}

            {/* Dataset Table / Empty State */}
            {records.length === 0 ? (
              <EmptyState
                icon={HistoryRoundedIcon}
                title="No Interview Records Yet"
                description="Complete your first technical interview session to start collecting structured records for analytics and career readiness."
                actionLabel="Start Interview"
                onAction={() => navigate("/interview")}
              />
            ) : (
              <AppCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <SectionHeader
                  title="Structured Question Records"
                  subtitle="Click any row to expand answer text, evaluation feedback, and dimension scores."
                  sx={{ p: 2, pb: 1, mb: 0 }}
                />

                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 0, border: "none", overflow: "hidden" }}>
                  <Table aria-label="interview dataset table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 44 }} />
                        <TableCell>Date</TableCell>
                        <TableCell>Topic</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Question</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.map((row) => (
                        <RowItem
                          key={row.id}
                          row={row}
                          isOpen={openRowId === row.id}
                          onToggle={() => handleToggleRow(row.id)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AppCard>
            )}
          </>
        )}
      </Stack>
    </DashboardLayout>
  );
}
