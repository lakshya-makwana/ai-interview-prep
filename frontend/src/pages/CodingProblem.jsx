import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  useParams,
} from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import {
  addFavorite,
  getQuestion,
  getSampleTestCases,
  removeFavorite,
} from "../services/codingService";

import CodeEditor from "../components/coding/CodeEditor";
import { starterCode } from "../utils/starterCode";

import {
  runCode,
  submitCode,
} from "../services/codeExecutionService";

export default function CodingProblem() {
  const { slug } = useParams();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [visibleHints, setVisibleHints] = useState(0);

  async function handleRun() {
    try {
      setRunning(true);
      setSubmitResult(null);

      const result = await runCode(
        language,
        code,
        stdin
      );

      if (result.stderr) {
        setConsoleOutput(result.stderr);
      } else {
        setConsoleOutput(result.stdout);
      }

    } catch (err) {
      console.error(err);
      setConsoleOutput("Failed to execute code.");
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setSubmitResult(null);

      const result = await submitCode(
        question.id,
        language,
        code
      );

      setSubmitResult(result);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      const errorMessage =
        typeof detail === "string"
          ? detail
          : "Failed to submit solution.";

      setSubmitResult({
        status: "Submission Failed",
        passed: 0,
        total: 0,
        score: 0,
        runtime_ms: 0,
        stderr: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    async function loadQuestion() {
      try {
        const data = await getQuestion(slug);
        setQuestion(data);
        setVisibleHints(0);

        const testCaseData = await getSampleTestCases(
          data.id
        );

        setSampleTestCases(
          testCaseData.test_cases || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestion();
  }, [slug]);

  useEffect(() => {
    setCode(starterCode[language] || "");
  }, [language]);

  function handleSampleClick(testCase) {
    setStdin(testCase.input);
  }

  async function handleToggleFavorite() {
    try {
      if (question.is_favorited) {
        await removeFavorite(question.id);
      } else {
        await addFavorite(question.id);
      }

      setQuestion((currentQuestion) => ({
        ...currentQuestion,
        is_favorited: !currentQuestion.is_favorited,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  function handleShowHint() {
    setVisibleHints((currentVisibleHints) =>
      Math.min(
        currentVisibleHints + 1,
        question.hints.length
      )
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 8,
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!question) {
    return (
      <DashboardLayout>
        <Typography variant="h5">
          Problem not found.
        </Typography>
      </DashboardLayout>
    );
  }

  const difficultyColor =
    question.difficulty === "easy"
      ? "success"
      : question.difficulty === "medium"
      ? "warning"
      : "error";

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "45% 55%",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL */}

        <Paper
          elevation={2}
          sx={{
            height: "82vh",
            overflowY: "auto",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography
              variant="h4"
              fontWeight={700}
            >
              {question.title}
            </Typography>

            <Tooltip
              title={
                question.is_favorited
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <IconButton onClick={handleToggleFavorite}>
                {question.is_favorited ? (
                  <BookmarkRoundedIcon color="primary" />
                ) : (
                  <BookmarkBorderRoundedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            mb={3}
          >
            <Chip
              label={question.difficulty.toUpperCase()}
              color={difficultyColor}
            />

            <Chip
              label={question.category.replaceAll("_", " ")}
            />

            <Chip
              label={`${question.acceptance_rate}% Acceptance`}
            />

            <Chip
              label={`${question.estimated_time} mins`}
            />

            {(question.tags || []).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                variant="outlined"
              />
            ))}

            {(question.companies || []).map((company) => (
              <Chip
                key={company.id}
                label={company.name}
              />
            ))}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Description
          </Typography>

          <Typography
            whiteSpace="pre-wrap"
            mb={4}
          >
            {question.description}
          </Typography>

          {question.constraints && (
            <>
              <Typography
                variant="h6"
                gutterBottom
              >
                Constraints
              </Typography>

              <Typography
                whiteSpace="pre-wrap"
                mb={4}
              >
                {question.constraints}
              </Typography>
            </>
          )}

          {question.input_format && (
            <>
              <Typography
                variant="h6"
                gutterBottom
              >
                Input Format
              </Typography>

              <Typography
                whiteSpace="pre-wrap"
                mb={4}
              >
                {question.input_format}
              </Typography>
            </>
          )}

          {question.output_format && (
            <>
              <Typography
                variant="h6"
                gutterBottom
              >
                Output Format
              </Typography>

              <Typography
                whiteSpace="pre-wrap"
                mb={4}
              >
                {question.output_format}
              </Typography>
            </>
          )}

          {question.explanation && (
            <>
              <Typography
                variant="h6"
                gutterBottom
              >
                Explanation
              </Typography>

              <Typography whiteSpace="pre-wrap">
                {question.explanation}
              </Typography>
            </>
          )}

          {(question.hints || []).length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                >
                  Hints
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleShowHint}
                  disabled={
                    visibleHints >= question.hints.length
                  }
                >
                  Show Hint
                </Button>
              </Stack>

              <Stack spacing={1}>
                {question.hints
                  .slice(0, visibleHints)
                  .map((hint, index) => (
                    <Paper
                      key={hint.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Typography fontWeight={700}>
                        Hint {index + 1}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        whiteSpace="pre-wrap"
                      >
                        {hint.hint_text}
                      </Typography>
                    </Paper>
                  ))}
              </Stack>
            </>
          )}

          {(question.related_problems || []).length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h6"
                gutterBottom
              >
                Related Problems
              </Typography>

              <Stack spacing={1}>
                {question.related_problems.map(
                  (relatedProblem) => (
                    <Link
                      key={relatedProblem.id}
                      component={RouterLink}
                      to={`/coding/${relatedProblem.slug}`}
                      underline="hover"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {relatedProblem.title}
                    </Link>
                  )
                )}
              </Stack>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Sample Test Cases
          </Typography>

          {sampleTestCases.length === 0 ? (
            <Typography color="text.secondary">
              No sample test cases available.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {sampleTestCases.map((testCase, index) => (
                <Paper
                  key={testCase.id}
                  variant="outlined"
                  onClick={() =>
                    handleSampleClick(testCase)
                  }
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                  >
                    Sample {index + 1}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    Input
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      mb: 2,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "grey.100",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {testCase.input}
                  </Box>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    Expected Output
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "grey.100",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {testCase.expected_output}
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        {/* RIGHT PANEL */}

        <Paper
          elevation={2}
          sx={{
            height: "82vh",
            p: 3,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <TextField
              select
              size="small"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              sx={{
                width: 170,
              }}
            >
              <MenuItem value="python">
                Python
              </MenuItem>

              <MenuItem value="java">
                Java
              </MenuItem>

              <MenuItem value="cpp">
                C++
              </MenuItem>

              <MenuItem value="c">
                C
              </MenuItem>
            </TextField>

            <Stack
              direction="row"
              spacing={2}
            >
              <Button
                variant="outlined"
                onClick={handleRun}
                disabled={running || submitting}
            >
                {running ? "Running..." : "Run"}
            </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={running || submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </Stack>
          </Stack>

          {/* Monaco Editor */}

          <Box
            sx={{
              flex: 1,
              minHeight: 220,
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CodeEditor
              language={language}
              code={code}
              setCode={setCode}
            />
          </Box>

          {/* Custom Input */}

          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Custom Input
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              value={stdin}
              onChange={(e) =>
                setStdin(e.target.value)
              }
              placeholder="Enter stdin for your program..."
            />
          </Paper>

          {/* Console */}

          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              height: 180,
              overflowY: "auto",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Console
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                }}
            >
                {consoleOutput || "Run your code to see the output..."}
            </Typography>
          </Paper>

          {submitResult && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 2,
                borderColor:
                  submitResult.status === "Accepted"
                    ? "success.main"
                    : "error.main",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color={
                  submitResult.status === "Accepted"
                    ? "success.main"
                    : "error.main"
                }
              >
                {submitResult.status}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Passed {submitResult.passed} / {submitResult.total}
              </Typography>

              <Typography>
                Score: {submitResult.score}%
              </Typography>

              <Typography>
                Runtime: {submitResult.runtime_ms} ms
              </Typography>

              {submitResult.stderr && (
                <Typography
                  sx={{
                    mt: 1,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {submitResult.stderr}
                </Typography>
              )}
            </Paper>
          )}
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
