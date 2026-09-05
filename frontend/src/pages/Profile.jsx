import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
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

import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

import AppCard from "../components/AppCard";
import DashboardLayout from "../layouts/DashboardLayout";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import { getFavorites } from "../services/codingService";
import { getUserProfile } from "../services/userService";

function formatStatus(status) {
  if (!status) {
    return "--";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusColor(status) {
  if (status === "Accepted" || status === "accepted") {
    return "success";
  }

  if (
    status === "Wrong Answer" ||
    status === "wrong_answer"
  ) {
    return "warning";
  }

  return "error";
}

function formatSubmissionDate(value) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleString();
}

function formatJoinDate(value) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({ title, value, subtitle, color = "primary" }) {
  let valueColor = "text.primary";
  if (color === "success") valueColor = "success.main";
  else if (color === "warning") valueColor = "warning.main";
  else if (color === "error") valueColor = "error.main";
  else if (color === "info") valueColor = "info.main";

  return (
    <AppCard
      contentSx={{
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 110,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={700}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight={800}
        color={valueColor}
        sx={{ my: 1 }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}
    </AppCard>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [profileRes, favRes] = await Promise.all([
          getUserProfile(),
          getFavorites().catch(() => ({ favorites: [] })),
        ]);

        setProfileData(profileRes);
        setFavorites(favRes?.favorites || []);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: 360 }}
        >
          <CircularProgress />
          <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Loading user profile...
          </Typography>
        </Stack>
      </DashboardLayout>
    );
  }

  const user = profileData?.user || {
    name: "User",
    email: "",
    joined_at: null,
  };

  const resume = profileData?.resume || {
    uploaded: false,
    filename: null,
    ats_score: null,
  };

  const coding = profileData?.coding || {
    total_solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    total_submissions: 0,
    acceptance_rate: 0,
    favorite_language: "N/A",
    recent_activity: [],
  };

  const recentActivity = coding.recent_activity || [];

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* ==================== 1. Profile Information ==================== */}
        <AppCard>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Stack
              direction="row"
              spacing={2.5}
              alignItems="center"
            >
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "primary.main",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  boxShadow: 2,
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : <PersonRoundedIcon />}
              </Avatar>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography variant="h4" fontWeight={800}>
                    {user.name}
                  </Typography>
                  <StatusChip
                    label="Active"
                    color="success"
                  />
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0.5, sm: 2 }}
                  sx={{ mt: 1 }}
                >
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    color="text.secondary"
                  >
                    <EmailRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      {user.email}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    color="text.secondary"
                  >
                    <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      Joined {formatJoinDate(user.joined_at)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </AppCard>

        {/* ==================== 2. Resume Summary ==================== */}
        <AppCard>
          <SectionHeader
            title="Resume Summary"
            subtitle="Overview of your uploaded resume and ATS evaluation."
            action={
              <Button
                variant={resume.uploaded ? "outlined" : "contained"}
                size="small"
                onClick={() =>
                  navigate(resume.uploaded ? "/analysis" : "/resume")
                }
              >
                View Analysis
              </Button>
            }
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
              mt: 1,
            }}
          >
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
              >
                Resume Status
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                {resume.uploaded ? (
                  <CheckCircleRoundedIcon color="success" />
                ) : (
                  <RadioButtonUncheckedRoundedIcon color="disabled" />
                )}
                <Typography fontWeight={700}>
                  {resume.uploaded ? "Uploaded" : "Not Uploaded"}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
              >
                Filename
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <DescriptionRoundedIcon color="primary" />
                <Typography
                  fontWeight={600}
                  noWrap
                  title={resume.filename || "No file uploaded"}
                >
                  {resume.filename || "No resume uploaded"}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
              >
                ATS Score
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <PsychologyRoundedIcon color={resume.ats_score != null ? "primary" : "disabled"} />
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color={resume.ats_score != null ? "primary.main" : "text.secondary"}
                >
                  {resume.ats_score != null ? `${resume.ats_score}%` : "--"}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </AppCard>

        {/* ==================== 3. Coding Statistics ==================== */}
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mb: 2 }}
          >
            Coding Statistics
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <StatCard
              title="Problems Solved"
              value={coding.total_solved}
              subtitle="All unique problems solved"
              color="primary"
            />
            <StatCard
              title="Easy"
              value={coding.easy}
              subtitle="Easy level problems"
              color="success"
            />
            <StatCard
              title="Medium"
              value={coding.medium}
              subtitle="Medium level problems"
              color="warning"
            />
            <StatCard
              title="Hard"
              value={coding.hard}
              subtitle="Hard level problems"
              color="error"
            />
            <StatCard
              title="Total Submissions"
              value={coding.total_submissions}
              subtitle="Evaluated solutions"
              color="primary"
            />
            <StatCard
              title="Acceptance Rate"
              value={`${coding.acceptance_rate}%`}
              subtitle="Accepted / Submissions"
              color="info"
            />
            <StatCard
              title="Favorite Language"
              value={coding.favorite_language}
              subtitle="Most submitted language"
              color="primary"
            />
          </Box>
        </Box>

        {/* ==================== 4. Recent Activity ==================== */}
        <AppCard>
          <SectionHeader
            title="Recent Activity"
            subtitle="Your latest 10 coding submissions."
            action={
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/coding/submissions")}
              >
                All Submissions
              </Button>
            }
          />

          {recentActivity.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">
                No recent submissions found.
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => navigate("/coding")}
              >
                Start Coding
              </Button>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                mt: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Problem</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Language</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Runtime</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Submission Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      onClick={() =>
                        navigate(`/coding/submissions/${item.id}`)
                      }
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography fontWeight={600}>
                            {item.problem_name || item.question_title}
                          </Typography>
                          <OpenInNewRoundedIcon
                            sx={{
                              fontSize: 16,
                              color: "text.disabled",
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={formatStatus(item.status)}
                          color={getStatusColor(item.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.language}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {item.runtime_ms != null
                          ? `${item.runtime_ms} ms`
                          : "--"}
                      </TableCell>
                      <TableCell color="text.secondary">
                        {formatSubmissionDate(item.submitted_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AppCard>

        {/* ==================== 5. Favorites Summary ==================== */}
        <AppCard>
          <SectionHeader
            title="Favorites Summary"
            subtitle="Your saved practice problems for quick review."
            action={
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/coding/favorites")}
              >
                View All Favorites
              </Button>
            }
          />

          {favorites.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <BookmarkRoundedIcon
                sx={{ fontSize: 44, color: "text.disabled", mb: 1 }}
              />
              <Typography variant="body1">
                No favorite problems saved yet.
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Bookmark problems during practice to access them quickly here.
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => navigate("/coding")}
              >
                Explore Problems
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
                mt: 2,
              }}
            >
              {favorites.slice(0, 6).map((fav) => {
                const question = fav.question;
                if (!question) return null;

                let difficultyColor = "default";
                if (question.difficulty === "easy") difficultyColor = "success";
                if (question.difficulty === "medium") difficultyColor = "warning";
                if (question.difficulty === "hard") difficultyColor = "error";

                return (
                  <Paper
                    key={fav.id || question.id}
                    elevation={0}
                    onClick={() => navigate(`/coding/${question.slug}`)}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "border-color 0.2s, background-color 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1.5}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          fontWeight={700}
                          noWrap
                          title={question.title}
                        >
                          {question.title}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 0.75 }}
                        >
                          <Chip
                            label={(question.difficulty || "").toUpperCase()}
                            color={difficultyColor}
                            size="small"
                          />
                          {question.category && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {question.category.replaceAll("_", " ")}
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <OpenInNewRoundedIcon
                        color="action"
                        sx={{ fontSize: 20 }}
                      />
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          )}
        </AppCard>
      </Stack>
    </DashboardLayout>
  );
}
