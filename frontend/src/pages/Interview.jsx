import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AppCard from "../components/AppCard";
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

  // Conversational chat feed history
  const [chatHistory, setChatHistory] = useState([]);

  // Review state
  const [completedInterview, setCompletedInterview] = useState(null);

  // Adaptive Interview Context
  const [interviewFocus, setInterviewFocus] = useState(null);
  const [interviewTopics, setInterviewTopics] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function initInterviewState() {
      setError("");

      if (urlInterviewId) {
        try {
          setLoading(true);
          const report = await getInterviewEvaluation(urlInterviewId);
          if (isMounted) {
            setInterviewId(report.interview_id);
            setCompletedInterview(report);
            if (report.interview_focus) setInterviewFocus(report.interview_focus);
            if (report.topics) setInterviewTopics(report.topics);
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

      try {
        const data = await getCurrentInterview();
        if (isMounted) {
          setInterviewId(data.interview_id);
          setTotalQuestions(data.total_questions);
          setCurrentQuestionNumber(data.current_question_number);
          setCurrentQuestion(data.current_question);
          if (data.interview_focus) setInterviewFocus(data.interview_focus);
          if (data.topics) setInterviewTopics(data.topics);

          if (data.current_question) {
            setChatHistory([
              {
                sender: "ai",
                questionNumber: data.current_question_number,
                text: data.current_question.question_text,
                topic: data.current_question.topic,
                difficulty: data.current_question.difficulty,
              },
            ]);
          }

          setView("active");
        }
      } catch {
        if (isMounted) {
          setView("start");
        }
      }
    }

    initInterviewState();

    return () => {
      isMounted = false;
    };
  }, [urlInterviewId]);

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await startInterview();
      setInterviewId(data.interview_id);
      setTotalQuestions(data.total_questions);
      setCurrentQuestionNumber(data.current_question_number);
      setCurrentQuestion(data.current_question);
      if (data.interview_focus) setInterviewFocus(data.interview_focus);
      if (data.topics) setInterviewTopics(data.topics);
      setAnswerText("");

      if (data.current_question) {
        setChatHistory([
          {
            sender: "ai",
            questionNumber: 1,
            text: data.current_question.question_text,
            topic: data.current_question.topic,
            difficulty: data.current_question.difficulty,
          },
        ]);
      }

      setView("active");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to start interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    if (!answerText.trim()) {
      setError("Please type your answer before submitting.");
      return;
    }

    const submittedAnswer = answerText.trim();
    setLoading(true);
    setError("");

    const updatedHistory = [
      ...chatHistory,
      { sender: "candidate", text: submittedAnswer },
    ];
    setChatHistory(updatedHistory);
    setAnswerText("");

    try {
      const data = await submitAnswer(currentQuestion.id, submittedAnswer);

      if (data.is_completed) {
        setInterviewId(data.interview_id);
        setView("completed");
      } else {
        setCurrentQuestionNumber(data.current_question_number);
        setCurrentQuestion(data.next_question);

        if (data.next_question) {
          setChatHistory([
            ...updatedHistory,
            {
              sender: "ai",
              questionNumber: data.current_question_number,
              text: data.next_question.question_text,
              topic: data.next_question.topic,
              difficulty: data.next_question.difficulty,
            },
          ]);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to submit answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
      <Stack spacing={3}>
        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Technical Interview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Interactive technical interview session with multi-dimensional AI answer evaluation.
            </Typography>
          </Box>

          {view === "review" && (
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReplayRoundedIcon fontSize="small" />}
                onClick={() => {
                  setInterviewId(null);
                  setCompletedInterview(null);
                  navigate("/interview", { replace: true });
                  setView("start");
                }}
              >
                Start New
              </Button>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                onClick={() => navigate("/career-readiness")}
              >
                Career Readiness
              </Button>
            </Stack>
          )}
        </Box>

        {/* Global Error Banner */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* 1. Loading View */}
        {view === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* 2. Start Screen */}
        {view === "start" && (
          <AppCard sx={{ textAlign: "center", py: 4, px: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <QuizRoundedIcon />
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Technical Interview Session
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 540, mx: "auto", mb: 3 }}>
              Answer five core technical questions tailored to your target profile. Answers are evaluated across Technical Correctness, Completeness, Relevance, and Communication.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 3.5 }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 1.75,
                  minWidth: 150,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  justifyContent: "center",
                }}
              >
                <HelpOutlineRoundedIcon color="primary" fontSize="small" />
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Format
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    5 Questions
                  </Typography>
                </Box>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.75,
                  minWidth: 150,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  justifyContent: "center",
                }}
              >
                <TimerRoundedIcon color="warning" fontSize="small" />
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
              startIcon={<PlayArrowRoundedIcon fontSize="small" />}
              onClick={handleStartInterview}
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? "Starting Interview..." : "Start Interview"}
            </Button>
          </AppCard>
        )}

        {/* 3. Active Conversational Chat Screen */}
        {view === "active" && currentQuestion && (
          <AppCard>
            {/* Interview Focus & Priority Topics Header */}
            {(interviewFocus || (interviewTopics && interviewTopics.length > 0)) && (
              <Box
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: 2,
                  bgcolor: (t) =>
                    t.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                {interviewFocus && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                      }}
                    >
                      Interview Focus
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                      {interviewFocus}
                    </Typography>
                  </Box>
                )}

                {interviewTopics && interviewTopics.length > 0 && (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", sm: "flex-end" }, gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Current Focus
                    </Typography>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                      {interviewTopics.map((topic, idx) => {
                        const isCurrent = currentQuestion?.topic === topic;
                        return (
                          <Chip
                            key={idx}
                            label={topic}
                            size="small"
                            variant={isCurrent ? "filled" : "outlined"}
                            color={isCurrent ? "primary" : "default"}
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              fontWeight: isCurrent ? 700 : 500,
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            {/* Progress Indicator */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                    Question {currentQuestionNumber} of {totalQuestions}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <TimerRoundedIcon sx={{ fontSize: 13 }} />
                    ~{Math.max(2, (totalQuestions - currentQuestionNumber + 1) * 3)} mins remaining
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={currentQuestion.topic}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    label={currentQuestion.difficulty}
                    size="small"
                    color={getDifficultyColor(currentQuestion.difficulty)}
                  />
                </Stack>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(currentQuestionNumber / totalQuestions) * 100}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* Chat Messages */}
            <Box sx={{ minHeight: 260, mb: 2.5 }}>
              {chatHistory.map((msg, index) =>
                msg.sender === "ai" ? (
                  <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2.5 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34, mt: 0.25, borderRadius: 1.5 }}>
                      <SmartToyRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ maxWidth: "85%" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.primary">
                          AI Interviewer
                        </Typography>
                        {msg.topic && (
                          <Chip
                            label={msg.topic}
                            size="small"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.7rem" }}
                          />
                        )}
                      </Box>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                          {msg.text}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ) : (
                  <Box key={index} sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, alignItems: "flex-start", mb: 2.5 }}>
                    <Box sx={{ maxWidth: "85%", textAlign: "right" }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        You
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "primary.dark",
                          color: "primary.contrastText",
                          textAlign: "left",
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {msg.text}
                        </Typography>
                      </Paper>
                    </Box>
                    <Avatar sx={{ bgcolor: "secondary.main", width: 34, height: 34, mt: 0.25, borderRadius: 1.5 }}>
                      <PersonRoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                )
              )}
            </Box>

            {/* Input Dock */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end", pt: 2, borderTop: 1, borderColor: "divider" }}>
              <TextField
                multiline
                minRows={3}
                maxRows={6}
                fullWidth
                placeholder="Type your answer to the interviewer..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={loading}
                sx={{ bgcolor: "background.default" }}
              />
              <Button
                variant="contained"
                endIcon={<SendRoundedIcon fontSize="small" />}
                onClick={handleSubmitAnswer}
                disabled={loading || !answerText.trim()}
                sx={{
                  minHeight: 44,
                  px: 2.5,
                  flexShrink: 0,
                }}
              >
                {loading
                  ? "Submitting..."
                  : currentQuestionNumber === totalQuestions
                  ? "Finish"
                  : "Submit"}
              </Button>
            </Box>
          </AppCard>
        )}

        {/* 4. Completion Screen */}
        {view === "completed" && (
          <AppCard sx={{ textAlign: "center", py: 4, px: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "success.main",
                color: "success.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckCircleRoundedIcon />
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Interview Completed
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", mb: 3 }}>
              All five questions have been answered. View the AI evaluation to inspect score breakdowns, strengths, and targeted feedback.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 3.5 }}
            >
              <Paper variant="outlined" sx={{ p: 2, minWidth: 140, borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Total Questions
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  5
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, minWidth: 140, borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Answered Questions
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  5
                </Typography>
              </Paper>
            </Stack>

            {evaluating ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                  Evaluating answers with Gemini AI... Please wait a moment.
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                startIcon={<AutoAwesomeRoundedIcon fontSize="small" />}
                endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                onClick={handleViewInterview}
                disabled={evaluating}
                sx={{ px: 3.5 }}
              >
                View Evaluations
              </Button>
            )}
          </AppCard>
        )}

        {/* 5. Review Screen */}
        {view === "review" && completedInterview && (
          <Stack spacing={3}>
            {/* Review Summary: Interview Focus & Topics Covered */}
            <AppCard>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                    }}
                  >
                    Interview Focus
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                    {completedInterview.interview_focus || interviewFocus || "Technical Interview"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", sm: "flex-end" }, gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Topics Covered
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {(completedInterview.topics && completedInterview.topics.length > 0
                      ? completedInterview.topics
                      : Array.from(new Set(completedInterview.questions.map((q) => q.topic)))
                    ).map((topic, idx) => (
                      <Chip
                        key={idx}
                        label={topic}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                          height: 24,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </AppCard>

            {completedInterview.questions.map((q) => (
              <AppCard key={q.id}>
                {/* AI Interviewer Question */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, mt: 0.25, borderRadius: 1.5 }}>
                    <SmartToyRoundedIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ maxWidth: "90%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={700} color="text.primary">
                        AI Interviewer
                      </Typography>
                      <Chip
                        label={q.topic}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ height: 18, fontSize: "0.7rem" }}
                      />
                      <Chip
                        label={q.difficulty}
                        size="small"
                        color={getDifficultyColor(q.difficulty)}
                        sx={{ height: 18, fontSize: "0.7rem" }}
                      />
                    </Box>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.5 }}>
                        {q.question_text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>

                {/* Candidate Response */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, alignItems: "flex-start", mb: 2.5 }}>
                  <Box sx={{ maxWidth: "90%", textAlign: "right" }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      You
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        border: 1,
                        borderColor: "divider",
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.6,
                          fontStyle: q.candidate_answer ? "normal" : "italic",
                          color: q.candidate_answer ? "text.primary" : "text.secondary",
                        }}
                      >
                        {q.candidate_answer || "No answer provided."}
                      </Typography>
                    </Paper>
                  </Box>
                  <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32, mt: 0.25, borderRadius: 1.5 }}>
                    <PersonRoundedIcon fontSize="small" />
                  </Avatar>
                </Box>

                {/* AI Evaluation */}
                {q.evaluation ? (
                  <Box sx={{ mt: 2.5, pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <AutoAwesomeRoundedIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle2" fontWeight={700}>
                        AI Answer Evaluation
                      </Typography>
                    </Box>

                    {/* Overall Summary */}
                    {q.evaluation.summary && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.75,
                          mb: 2.5,
                          borderRadius: 1.5,
                          bgcolor: "rgba(59, 130, 246, 0.06)",
                          borderColor: "rgba(59, 130, 246, 0.25)",
                        }}
                      >
                        <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ textTransform: "uppercase", display: "block", mb: 0.5 }}>
                          Evaluation Summary
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                          {q.evaluation.summary}
                        </Typography>
                      </Paper>
                    )}

                    {/* Score Breakdown */}
                    <Card variant="outlined" sx={{ p: 2, mb: 2.5, borderRadius: 1.5 }}>
                      <Grid container spacing={2.5} alignItems="center">
                        <Grid size={{ xs: 12, sm: 3 }} sx={{ textAlign: "center", borderRight: { sm: 1 }, borderColor: { sm: "divider" } }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                            Overall Score
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{ color: getScoreColor(q.evaluation.overall_score), my: 0.5 }}
                          >
                            {q.evaluation.overall_score}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            out of 10
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 9 }}>
                          <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Technical Correctness
                                </Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ color: getScoreColor(q.evaluation.technical_correctness) }}>
                                  {q.evaluation.technical_correctness} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.technical_correctness / 10) * 100}
                                sx={{ height: 5, borderRadius: 2.5 }}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Completeness
                                </Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ color: getScoreColor(q.evaluation.completeness) }}>
                                  {q.evaluation.completeness} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.completeness / 10) * 100}
                                color="secondary"
                                sx={{ height: 5, borderRadius: 2.5 }}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Relevance
                                </Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ color: getScoreColor(q.evaluation.relevance) }}>
                                  {q.evaluation.relevance} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.relevance / 10) * 100}
                                color="success"
                                sx={{ height: 5, borderRadius: 2.5 }}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Communication
                                </Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ color: getScoreColor(q.evaluation.communication) }}>
                                  {q.evaluation.communication} / 10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(q.evaluation.communication / 10) * 100}
                                color="warning"
                                sx={{ height: 5, borderRadius: 2.5 }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>

                    {/* Strengths */}
                    {q.evaluation.strengths?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                          <ThumbUpAltRoundedIcon color="success" fontSize="small" />
                          <Typography variant="caption" fontWeight={700} textTransform="uppercase">
                            Strengths
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                          {q.evaluation.strengths.map((str, idx) => (
                            <Chip
                              key={idx}
                              label={str}
                              color="success"
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Missing Concepts */}
                    {q.evaluation.missing_concepts?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                          <WarningAmberRoundedIcon color="warning" fontSize="small" />
                          <Typography variant="caption" fontWeight={700} textTransform="uppercase">
                            Missing Concepts & Gaps
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                          {q.evaluation.missing_concepts.map((mc, idx) => (
                            <Chip
                              key={idx}
                              label={mc}
                              color="warning"
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Actionable Feedback */}
                    {q.evaluation.feedback && (
                      <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                          <LightbulbRoundedIcon color="primary" fontSize="small" />
                          <Typography variant="caption" fontWeight={700} textTransform="uppercase">
                            Actionable Feedback
                          </Typography>
                        </Box>
                        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
                          <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                              {q.evaluation.feedback}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info" variant="outlined">
                      Evaluation pending or not requested for this question.
                    </Alert>
                  </Box>
                )}
              </AppCard>
            ))}
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
}
