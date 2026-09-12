import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";

import { useNavigate } from "react-router-dom";

import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";
import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { useDashboard } from "../context/DashboardContext";

function splitSuggestions(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.replace(/^[-*•\d.]+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
}

function JourneyItem({ done, title, subtitle }) {
  const Icon = done ? CheckCircleRoundedIcon : RadioButtonUncheckedRoundedIcon;

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Icon color={done ? "success" : "disabled"} />
      <Box>
        <Typography fontWeight={800}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { dashboard, loading } = useDashboard();

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const hasResume = Boolean(dashboard.resume);
  const hasAnalysis = Boolean(dashboard.analysis);
  const ats = hasAnalysis ? `${dashboard.analysis.ats_score}%` : "--";
  const progress = hasAnalysis ? 40 : hasResume ? 20 : 0;
  const recommendations = splitSuggestions(dashboard.analysis?.suggestions);

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <AppCard>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Box sx={{ maxWidth: 760 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
                <StatusChip label="Resume" color={hasResume ? "success" : "warning"} />
                <StatusChip label="Analysis" color={hasAnalysis ? "success" : "default"} />
                <StatusChip label="Interview" color="default" />
                <StatusChip label="Progress" color="primary" />
              </Stack>

              <Typography variant="h4">AI Interview Preparation Platform</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Upload your resume, improve your ATS score, and follow a clear path toward interview readiness.
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: 280 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={700}>
                  Interview readiness
                </Typography>
                <Typography fontWeight={800}>{progress}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 9, borderRadius: 999 }} />
            </Box>
          </Stack>
        </AppCard>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
            gap: 3,
          }}
        >
          <DashboardCard title="ATS Score" value={ats} />
          <DashboardCard title="Resume" value={hasResume ? "Uploaded" : "Not Uploaded"} />
          <DashboardCard title="Analysis" value={hasAnalysis ? "Completed" : "Pending"} />
          <DashboardCard title="Progress" value={`${progress}%`} progress={progress} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.9fr) minmax(0, 1.1fr)" },
            gap: 3,
          }}
        >
          <AppCard>
            <SectionHeader
              title="Interview Journey"
              subtitle="The v1 workflow is focused on resume quality and analysis."
            />

            <Stack spacing={2.25}>
              <JourneyItem
                done={hasResume}
                title="Resume Uploaded"
                subtitle={hasResume ? dashboard.resume.filename || "Resume ready for review" : "Upload a PDF resume to begin."}
              />
              <JourneyItem
                done={hasAnalysis}
                title="Resume Analyzed"
                subtitle={hasAnalysis ? "Your latest AI report is available." : "Run Gemini analysis after uploading a resume."}
              />
              <JourneyItem done={false} title="Mock Interview" subtitle="Simulate live technical interview rounds." />
              <JourneyItem done={false} title="HR Interview" subtitle="Practice behavioral and culture-fit scenarios." />
            </Stack>
          </AppCard>

          <QuickActions />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.1fr) minmax(0, 0.9fr)" },
            gap: 3,
          }}
        >
          <AppCard>
            <SectionHeader
              title="AI Recommendations"
              subtitle="Top resume improvements from your latest analysis."
              action={
                hasAnalysis ? (
                  <Button size="small" variant="outlined" onClick={() => navigate("/analysis")}>
                    Full report
                  </Button>
                ) : null
              }
            />

            {recommendations.length === 0 ? (
              <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                <TipsAndUpdatesRoundedIcon />
                <Typography>
                  Upload and analyze your resume to unlock personalized recommendations.
                </Typography>
              </Stack>
            ) : (
              <Stack divider={<Divider flexItem />} spacing={1.5}>
                {recommendations.map((item, index) => (
                  <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                    <StatusChip
                      label={index === 0 ? "High" : index === 1 ? "Medium" : "Improve"}
                      color={index === 0 ? "warning" : "primary"}
                    />
                    <Typography>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </AppCard>

          <RecentActivity />
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
