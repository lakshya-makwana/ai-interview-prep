import { useEffect, useState } from "react";

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
  TextField,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getCurrentInterview,
  getInterviewById,
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

export default function Interview() {
  // Screen views: 'loading' | 'start' | 'active' | 'completed' | 'review'
  const [view, setView] = useState("loading");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Active interview state
  const [interviewId, setInterviewId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

  // Review state
  const [completedInterview, setCompletedInterview] = useState(null);

  // Check for in-progress interview on load
  useEffect(() => {
    let isMounted = true;

    async function checkActiveInterview() {
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

    checkActiveInterview();

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Handle Answer Submission
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

  // Handle View Interview Review
  const handleViewInterview = async () => {
    if (!interviewId) return;
    setLoading(true);
    setError("");

    try {
      const data = await getInterviewById(interviewId);
      setCompletedInterview(data);
      setView("review");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load interview review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader
            title="Technical Interview Session"
            subtitle="Text-based interview engine designed to test core engineering fundamentals."
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
              Answer five technical questions covering core computer science and software engineering fundamentals. You can answer each question in your own words.
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

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
              Congratulations! You have completed all technical questions for this interview session. All your answers have been recorded.
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

            <Button
              variant="contained"
              size="large"
              startIcon={<VisibilityRoundedIcon />}
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={handleViewInterview}
              disabled={loading}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: 2.5,
              }}
            >
              {loading ? "Loading Review..." : "View Interview"}
            </Button>
          </AppCard>
        )}

        {/* 5. Review Screen */}
        {view === "review" && completedInterview && (
          <Stack spacing={3}>
            <AppCard>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Interview Review
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review of all five technical questions and your submitted responses.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ReplayRoundedIcon />}
                  onClick={() => {
                    setInterviewId(null);
                    setCompletedInterview(null);
                    setView("start");
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Start New Interview
                </Button>
              </Box>
            </AppCard>

            {completedInterview.questions.map((q) => (
              <AppCard key={q.id}>
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
              </AppCard>
            ))}
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
}
