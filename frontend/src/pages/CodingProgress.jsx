import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import AppCard from "../components/AppCard";
import { getCodingProgress } from "../services/codingService";

function formatStatus(status) {
  if (!status) {
    return "No submissions yet";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isAccepted(status) {
  return status === "Accepted" || status === "accepted";
}

function ProgressStatCard({ title, value }) {
  return (
    <AppCard
      contentSx={{
        minHeight: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={700}
      >
        {title}
      </Typography>

      <Typography variant="h4">
        {value}
      </Typography>
    </AppCard>
  );
}

export default function CodingProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getCodingProgress();
        setProgress(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
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
            Loading coding progress...
          </Typography>
        </Stack>
      </DashboardLayout>
    );
  }

  const stats = progress || {
    total_solved: 0,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    total_submissions: 0,
    accepted_submissions: 0,
    acceptance_rate: 0,
    recent_submission_status: null,
  };

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <AppCard>
          <SectionHeader
            title="Coding Progress"
            subtitle="Solved problems and submission performance."
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            flexWrap="wrap"
          >
            <StatusChip
              label={`Accepted ${stats.accepted_submissions}`}
              color="success"
            />
            <StatusChip
              label={`Recent: ${formatStatus(
                stats.recent_submission_status
              )}`}
              color={
                isAccepted(stats.recent_submission_status)
                  ? "success"
                  : "primary"
              }
            />
          </Stack>
        </AppCard>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <ProgressStatCard
            title="Total Solved"
            value={stats.total_solved}
          />
          <ProgressStatCard
            title="Easy"
            value={stats.easy_solved}
          />
          <ProgressStatCard
            title="Medium"
            value={stats.medium_solved}
          />
          <ProgressStatCard
            title="Hard"
            value={stats.hard_solved}
          />
          <ProgressStatCard
            title="Acceptance Rate"
            value={`${stats.acceptance_rate}%`}
          />
          <ProgressStatCard
            title="Total Submissions"
            value={stats.total_submissions}
          />
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
