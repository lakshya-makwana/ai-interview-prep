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

import DatasetRoundedIcon from "@mui/icons-material/DatasetRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import { getDataset, getDatasetStatistics } from "../services/datasetService";

function RowItem({ row, isOpen, onToggle }) {
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" };
      case "medium":
        return { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" };
      case "hard":
        return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
      default:
        return { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1" };
    }
  };

  const diffStyle = getDifficultyColor(row.difficulty);

  return (
    <>
      <TableRow
        hover
        onClick={onToggle}
        sx={{
          cursor: "pointer",
          backgroundColor: isOpen ? "#f8fafc" : "inherit",
          "& > *": { borderBottom: isOpen ? "unset" : undefined },
          transition: "background-color 0.15s ease",
        }}
      >
        <TableCell sx={{ width: 48, pr: 0 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {isOpen ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap", color: "#64748b", fontSize: "0.85rem" }}>
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
            sx={{
              backgroundColor: "#f1f5f9",
              color: "#334155",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={row.difficulty}
            size="small"
            sx={{
              backgroundColor: diffStyle.bg,
              color: diffStyle.color,
              borderColor: diffStyle.border,
              borderWidth: 1,
              borderStyle: "solid",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </TableCell>
        <TableCell sx={{ maxWidth: 360 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#1e293b",
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
          <Chip
            label={`${row.overall_score.toFixed(1)} / 10`}
            size="small"
            sx={{
              backgroundColor: row.overall_score >= 8.0 ? "#ecfdf5" : row.overall_score >= 6.0 ? "#eff6ff" : "#fffbeb",
              color: row.overall_score >= 8.0 ? "#065f46" : row.overall_score >= 6.0 ? "#1e40af" : "#92400e",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          />
        </TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: "#f8fafc" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2.5, px: 1 }}>
              <Grid container spacing={3}>
                {/* Candidate Answer Box */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#64748b" }}>
                    Candidate Answer
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: "#ffffff",
                      borderRadius: 2,
                      borderColor: "#e2e8f0",
                      maxHeight: 220,
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: 1.6 }}>
                      {row.candidate_answer}
                    </Typography>
                  </Paper>

                  {/* Feedback Card */}
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#64748b", display: "block", mt: 2 }}>
                    AI Evaluator Feedback
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: "#f0fdf4",
                      borderColor: "#bbf7d0",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <LightbulbRoundedIcon sx={{ color: "#16a34a", fontSize: 20, mt: 0.2 }} />
                      <Typography variant="body2" sx={{ color: "#166534", lineHeight: 1.6 }}>
                        {row.feedback}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Score Breakdown & Chips */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#64748b" }}>
                    Dimension Scores
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: "#ffffff",
                      borderRadius: 2,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Technical Correctness</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.technical_correctness.toFixed(1)}/10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.technical_correctness * 10} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Completeness</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.completeness.toFixed(1)}/10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.completeness * 10} color="secondary" sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Relevance</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.relevance.toFixed(1)}/10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.relevance * 10} color="success" sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Communication</Typography>
                          <Typography variant="caption" fontWeight={700}>{row.communication.toFixed(1)}/10</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={row.communication * 10} color="warning" sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Strengths & Missing Concepts */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#166534", display: "block", mb: 0.5 }}>
                      Demonstrated Strengths
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                      {Array.isArray(row.strengths) && row.strengths.length > 0 ? (
                        row.strengths.map((s, idx) => (
                          <Chip key={idx} label={s} size="small" sx={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: "0.75rem" }} />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">None logged</Typography>
                      )}
                    </Stack>

                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#b45309", display: "block", mb: 0.5 }}>
                      Missing Concepts / Growth Areas
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {Array.isArray(row.missing_concepts) && row.missing_concepts.length > 0 ? (
                        row.missing_concepts.map((m, idx) => (
                          <Chip key={idx} label={m} size="small" sx={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "0.75rem" }} />
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 12 }}>
        <CircularProgress size={44} thickness={4} />
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Loading interview dataset...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DatasetRoundedIcon sx={{ fontSize: 32, color: "#3b82f6" }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>
              Interview History
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#64748b" }}>
            Structured interview dataset collected for performance evaluation and future ML pipelines
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Refresh Dataset">
            <IconButton onClick={fetchData} sx={{ border: "1px solid #e2e8f0" }}>
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<MicRoundedIcon />}
            onClick={() => navigate("/interview")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            New Interview
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Summary KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "#eff6ff", color: "#2563eb" }}>
                  <HistoryRoundedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Interviews
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {stats.total_interviews}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "#f0fdf4", color: "#16a34a" }}>
                  <QuestionAnswerRoundedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Answered
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {stats.total_answered_questions}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "#fdf4ff", color: "#a855f7" }}>
                  <DatasetRoundedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Dataset Rows
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {stats.total_dataset_records}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "#fffbeb", color: "#d97706" }}>
                  <StarRoundedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Avg Score
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {stats.average_overall_score > 0 ? `${stats.average_overall_score.toFixed(1)} / 10` : "—"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dataset Metadata Chips: Topics & Difficulty */}
      {records.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderRadius: 3, borderColor: "#e2e8f0" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "#64748b", display: "block", mb: 1 }}>
                Topics Encountered ({stats.topics_encountered.length})
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {stats.topics_encountered.map((topic, i) => (
                  <Chip
                    key={i}
                    label={topic}
                    size="small"
                    sx={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1", borderWidth: 1, borderStyle: "solid", fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "#64748b", display: "block", mb: 1 }}>
                Difficulty Distribution
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={`Easy: ${stats.difficulty_distribution?.Easy || 0}`}
                  size="small"
                  sx={{ backgroundColor: "#ecfdf5", color: "#065f46", fontWeight: 600 }}
                />
                <Chip
                  label={`Medium: ${stats.difficulty_distribution?.Medium || 0}`}
                  size="small"
                  sx={{ backgroundColor: "#eff6ff", color: "#1e40af", fontWeight: 600 }}
                />
                <Chip
                  label={`Hard: ${stats.difficulty_distribution?.Hard || 0}`}
                  size="small"
                  sx={{ backgroundColor: "#fef2f2", color: "#991b1b", fontWeight: 600 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Empty State */}
      {records.length === 0 ? (
        <Card variant="outlined" sx={{ p: 6, textAlign: "center", borderRadius: 3, borderColor: "#e2e8f0" }}>
          <HistoryRoundedIcon sx={{ fontSize: 56, color: "#94a3b8", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
            No Interview Records Yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 460, mx: "auto", mb: 3 }}>
            Complete your first technical interview to start collecting structured data for analytics and your career readiness roadmap.
          </Typography>
          <Button
            variant="contained"
            startIcon={<MicRoundedIcon />}
            onClick={() => navigate("/interview")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              backgroundColor: "#2563eb",
            }}
          >
            Start Technical Interview
          </Button>
        </Card>
      ) : (
        /* Dataset Table */
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", overflow: "hidden" }}>
          <Table aria-label="interview dataset table">
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ width: 48 }} />
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>Topic</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>Question</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.8rem" }}>Overall Score</TableCell>
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
      )}
    </Box>
  );
}
