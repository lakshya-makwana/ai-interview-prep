import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getCurrentInterview,
  getInterviewEvaluation,
  startInterview,
  submitAnswer,
} from "../services/interviewService";

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

function getScoreColor(score) {
  if (score >= 8) return "success.main";
  if (score >= 6) return "warning.main";
  return "error.main";
}

export default function Interview() {
  const { id: urlInterviewId } = useParams();
  const navigate = useNavigate();

  // Screen views: 'loading' | 'start' | 'active' | 'completed' | 'review'
  const [view, setView] = useState("loading");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  // Active interview state
  const [interviewId, setInterviewId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

  // Review state
  const [completedInterview, setCompletedInterview] = useState(null);

  // Initialize view based on URL param or current active interview
  useEffect(() => {
    let isMounted = true;

    async function initInterviewState() {
      setError("");

      // 1. If URL has :id (e.g. /interview/5), directly load evaluation for this interview
      if (urlInterviewId) {
        try {
          setLoading(true);
          const report = await getInterviewEvaluation(urlInterviewId);
          if (isMounted) {
            setInterviewId(report.interview_id);
            setCompletedInterview(report);
            setView("review");
          }
        } catch (err) {
          if (isMounted) {
            setError(
              err.response?.data?.detail || "Failed to load interview evaluation."
            );
            setView("start");
          }
        } finally {
          if (isMounted) setLoading(false);
        }
        return;
      }

      // 2. If on /interview without :id, check if there is an in-progress interview
      try {
        const data = await getCurrentInterview();
        if (isMounted) {
          setInterviewId(data.interview_id);
          setTotalQuestions(data.total_questions);
          setCurrentQuestionNumber(data.current_question_number);
          setCurrentQuestion(data.current_question);
          setView("active");
        }
      } catch {
        if (isMounted) {
          // If 404, no active interview, show start screen
          setView("start");
        }
      }
    }

    initInterviewState();

    return () => {
      isMounted = false;
    };
  }, [urlInterviewId]);

  // Handle Start Interview
  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await startInterview();
      setInterviewId(data.interview_id);
      setTotalQuestions(data.total_questions);
      setCurrentQuestionNumber(data.current_question_number);
      setCurrentQuestion(data.current_question);
      setAnswerText("");
      setView("active");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to start interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Answer Submission (responsive, no evaluation wait during questions 1-4)
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    if (!answerText.trim()) {
      setError("Please type your answer before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await submitAnswer(currentQuestion.id, answerText.trim());

      if (data.is_completed) {
        setInterviewId(data.interview_id);
        setView("completed");
      } else {
        setCurrentQuestionNumber(data.current_question_number);
        setCurrentQuestion(data.next_question);
        setAnswerText("");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to submit answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle View Interview Review & Evaluation
  const handleViewInterview = async () => {
    if (!interviewId) return;
    setEvaluating(true);
    setError("");

    try {
      const data = await getInterviewEvaluation(interviewId);
      setCompletedInterview(data);
      navigate(`/interview/${interviewId}`, { replace: true });
      setView("review");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load interview evaluation."
      );
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader
            title="Technical Interview Session"
            subtitle="Text-based technical interview with AI-powered multi-dimensional answer evaluation."
          />
        </Box>

        {/* Global Error Banner */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* 1. Loading View */}
        {view === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {/* 2. Start Screen */}
        {view === "start" && (
          <AppCard sx={{ textAlign: "center", py: 6, px: 4 }}>
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
                mb: 3,
                boxShadow: 3,
              }}
            >
              <QuizRoundedIcon sx={{ fontSize: 38 }} />
            </Box>

            <Typography variant="h4" fontWeight={800} gutterBottom>
              Technical Interview
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 580, mx: "auto", mb: 4 }}>
              Answer five technical questions covering core computer science and engineering fundamentals. Upon completion, each answer is thoroughly analyzed by AI with individual scorecards, identified strengths, missing concepts, and targeted feedback.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              sx={{ mb: 5 }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minWidth: 160,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  justifyContent: "center",
                }}
              >
                <HelpOutlineRoundedIcon color="primary" />
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Format
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Five Questions
                  </Typography>
                </Box>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minWidth: 160,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  justifyContent: "center",
                }}
              >
                <TimerRoundedIcon color="warning" />
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Estimated Time
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    15–20 minutes
                  </Typography>
                </Box>
              </Paper>
            </Stack>

            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowRoundedIcon />}
              onClick={handleStartInterview}
              disabled={loading}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: 2.5,
              }}
            >
              {loading ? "Starting Interview..." : "Start Interview"}
            </Button>
          </AppCard>
        )}

        {/* 3. Active Interview Screen */}
        {view === "active" && currentQuestion && (
          <AppCard>
            {/* Progress Bar & Question Counter */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                  Question {currentQuestionNumber} of {totalQuestions}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={currentQuestion.topic}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label={currentQuestion.difficulty}
                    size="small"
                    color={getDifficultyColor(currentQuestion.difficulty)}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(currentQuestionNumber / totalQuestions) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "action.hover",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Question Text */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, mb: 1 }}>
                Question Prompt
              </Typography>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.5 }}>
                {currentQuestion.question_text}
              </Typography>
            </Box>

            {/* Candidate Answer Input */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                Your Answer
              </Typography>
              <TextField
                multiline
                rows={7}
                fullWidth
                placeholder="Type your structured technical answer here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={loading}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Action Bar */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<SendRoundedIcon />}
                onClick={handleSubmitAnswer}
                disabled={loading || !answerText.trim()}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                {loading
                  ? "Submitting..."
                  : currentQuestionNumber === totalQuestions
                  ? "Submit & Finish"
                  : "Submit Answer"}
              </Button>
            </Box>
          </AppCard>
        )}

        {/* 4. Completion Screen */}
        {view === "completed" && (
          <AppCard sx={{ textAlign: "center", py: 6, px: 4 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "success.main",
                color: "success.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: 3,
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 42 }} />
            </Box>

            <Typography variant="h4" fontWeight={800} gutterBottom>
              Interview Completed
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: "auto", mb: 4 }}>
              Congratulations! All five questions have been answered. Ready to view the AI-generated evaluation and feedback for each question?
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              sx={{ mb: 5 }}
            >
              <Paper variant="outlined" sx={{ p: 2.5, minWidth: 160, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Total Questions
                </Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  5
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5, minWidth: 160, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Answered Questions
                </Typography>
                <Typography variant="h5" fontWeight={800} color="success.main">
                  5
                </Typography>
              </Paper>
            </Stack>

            {evaluating ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <CircularProgress size={36} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Evaluating your answers with Gemini AI... Please wait a few seconds.
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={handleViewInterview}
                disabled={evaluating}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  borderRadius: 2.5,
                }}
              >
                View Interview & Evaluations
              </Button>
            )}
          </AppCard>
        )}

        {/* 5. Review Screen */}
        {view === "review" && completedInterview && (
          <Stack spacing={4}>
            {/* Review Header Banner */}
            <AppCard>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Interview Review & AI Evaluation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detailed per-question breakdown, technical correctness, completeness, relevance, communication, and actionable feedback.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ReplayRoundedIcon />}
                  onClick={() => {
                    setInterviewId(null);
                    setCompletedInterview(null);
                    navigate("/interview", { replace: true });
                    setView("start");
                  }}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Start New Interview
                </Button>
              </Box>
            </AppCard>

            {/* Questions with Answer and AI Evaluation */}
            {completedInterview.questions.map((q) => (
              <AppCard key={q.id}>
                {/* Question Info */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                    Question {q.display_order} of {completedInterview.total_questions}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={q.topic}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={q.difficulty}
                      size="small"
                      color={getDifficultyColor(q.difficulty)}
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                </Box>

                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, lineHeight: 1.4 }}>
                  {q.question_text}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Candidate Answer */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.8, display: "block", mb: 1 }}>
                    Your Submitted Answer
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                        color: q.candidate_answer ? "text.primary" : "text.secondary",
                        fontStyle: q.candidate_answer ? "normal" : "italic",
                      }}
                    >
                      {q.candidate_answer || "No answer provided."}
                    </Typography>
                  </Paper>
                </Box>

                {/* AI Evaluation Section */}
                {q.evaluation ? (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <AutoAwesomeRoundedIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight={800}>
                        AI Answer Evaluation
                      </Typography>
                    </Box>

                    {/* 1. Overall Summary */}
                    {q.evaluation.summary && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 3,
                          borderRadius: 2,
                          bgcolor: "primary.50",
                          borderColor: "primary.200",
                          borderLeftWidth: 4,
                          borderLeftColor: "primary.main",
                        }}
                      >
                        <Typography variant="caption" color="primary.dark" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.8, display: "block", mb: 0.5 }}>
                          Overall Summary
                        </Typography>
                        <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ lineHeight: 1.5 }}>
                          {q.evaluation.summary}
                        </Typography>
                      </Paper>
                    )}

                    {/* 2. Score Card */}
                    <Card variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                      <Grid container spacing={3} alignItems="center">
                        {/* Overall Score Circle/Badge */}
                        <Grid size={{ xs: 12, sm: 3 }} sx={{ textAlign: "center", borderRight: { sm: 1 }, borderColor: { sm: "divider" } }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Overall Score
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight={900}
                            sx={{ color: getScoreColor(q.evaluation.overall_score), my: 0.5 }}
                          >
                            {q.evaluation.overall_score}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            out of 10
                          </Typography>
                        </Grid>

                        {/* Metric Breakdown Progress Bars */}
                        <Grid size={{ xs: 12, sm: 9 }}>
                          <Grid container spacing={2}>
                            {/* Technical Correctness */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  Technical Correctness
                                </Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ color: getScoreColor(q.evaluation.technical_correctness) }}>
                                  {q.evaluation.technical_correctness} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.technical_correctness / 10) * 100}
                                color={q.evaluation.technical_correctness >= 8 ? "success" : q.evaluation.technical_correctness >= 6 ? "warning" : "error"}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Grid>

                            {/* Completeness */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  Completeness
                                </Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ color: getScoreColor(q.evaluation.completeness) }}>
                                  {q.evaluation.completeness} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.completeness / 10) * 100}
                                color={q.evaluation.completeness >= 8 ? "success" : q.evaluation.completeness >= 6 ? "warning" : "error"}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Grid>

                            {/* Relevance */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  Relevance
                                </Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ color: getScoreColor(q.evaluation.relevance) }}>
                                  {q.evaluation.relevance} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.relevance / 10) * 100}
                                color={q.evaluation.relevance >= 8 ? "success" : q.evaluation.relevance >= 6 ? "warning" : "error"}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Grid>

                            {/* Communication */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  Communication
                                </Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ color: getScoreColor(q.evaluation.communication) }}>
                                  {q.evaluation.communication} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.communication / 10) * 100}
                                color={q.evaluation.communication >= 8 ? "success" : q.evaluation.communication >= 6 ? "warning" : "error"}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>

                    {/* 3. Strengths */}
                    <Box sx={{ mb: 2.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <ThumbUpAltRoundedIcon color="success" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={700}>
                          Strengths
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {q.evaluation.strengths?.map((str, idx) => (
                          <Chip
                            key={idx}
                            label={str}
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* 4. Missing Concepts */}
                    <Box sx={{ mb: 2.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <WarningAmberRoundedIcon color="warning" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={700}>
                          Missing Concepts & Blind Spots
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {q.evaluation.missing_concepts?.map((mc, idx) => (
                          <Chip
                            key={idx}
                            label={mc}
                            color="warning"
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* 5. Feedback Card */}
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LightbulbRoundedIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={700}>
                          Actionable Feedback
                        </Typography>
                      </Box>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          borderColor: "divider",
                        }}
                      >
                        <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
                          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                            {q.evaluation.feedback}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                      Evaluation pending or not requested for this question.
                    </Alert>
                  </Box>
                )}
              </AppCard>
            ))}
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
}
