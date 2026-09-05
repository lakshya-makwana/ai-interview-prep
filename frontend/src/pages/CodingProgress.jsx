import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import EmptyState from "../components/EmptyState";
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
  const navigate = useNavigate();
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
        <Stack spacing={3}>
          <AppCard>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={20} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={110} height={28} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rounded" width={150} height={28} sx={{ borderRadius: 1 }} />
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <AppCard key={i} contentSx={{ minHeight: 130 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={44} sx={{ my: 1 }} />
              </AppCard>
            ))}
          </Box>
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

        {stats.total_submissions === 0 && (
          <EmptyState
            icon={TrendingUpRoundedIcon}
            title="Start Solving Problems"
            description="You have not submitted any solutions yet. Practice algorithmic problems across easy, medium, and hard tiers to see detailed metrics, acceptance rates, and streaks here."
            actionLabel="Explore Coding Problems"
            onAction={() => navigate("/coding")}
          />
        )}
      </Stack>
    </DashboardLayout>
  );
}
