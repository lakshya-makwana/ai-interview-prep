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
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Icon color={done ? "success" : "disabled"} sx={{ fontSize: 16, mt: 0.2 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.3 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.725rem", mt: 0.2 }}>
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
  const progress = hasAnalysis ? 50 : hasResume ? 25 : 0;
  const recommendations = splitSuggestions(dashboard.analysis?.suggestions);

  return (
    <DashboardLayout>
      <Stack spacing={2}>
        {/* Standard Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 1.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.01em" }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: "0.8125rem" }}>
              Preparation progress, resume ATS evaluation, and core interview milestones.
            </Typography>
          </Box>

          <Box sx={{ width: { xs: "100%", sm: 180 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: "0.7rem" }}>
                Readiness Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                {progress}%
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 4, borderRadius: 2 }} />
          </Box>
        </Box>

        {/* Metric Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
            gap: 1.5,
          }}
        >
          <DashboardCard title="ATS Score" value={ats} />
          <DashboardCard title="Resume" value={hasResume ? "Uploaded" : "Not Uploaded"} />
          <DashboardCard title="Analysis" value={hasAnalysis ? "Completed" : "Pending"} />
          <DashboardCard title="Progress" value={`${progress}%`} progress={progress} />
        </Box>

        {/* Journey and Quick Actions */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.95fr) minmax(0, 1.05fr)" },
            gap: 1.5,
          }}
        >
          <AppCard>
            <SectionHeader
              title="Interview Journey"
              subtitle="Core progress milestones toward job readiness."
            />

            <Stack spacing={1.5}>
              <JourneyItem
                done={hasResume}
                title="Resume Uploaded"
                subtitle={hasResume ? dashboard.resume.filename || "Resume ready for review" : "Upload a PDF resume to begin."}
              />
              <JourneyItem
                done={hasAnalysis}
                title="Resume Analyzed"
                subtitle={hasAnalysis ? "AI evaluation report generated." : "Run Gemini analysis after uploading a resume."}
              />
              <JourneyItem
                done={false}
                title="Technical Interview"
                subtitle="Practice mock technical questions with AI evaluation."
              />
              <JourneyItem
                done={false}
                title="Career Readiness Report"
                subtitle="Evaluate weighted job match and priority skill roadmap."
              />
            </Stack>
          </AppCard>

          <QuickActions />
        </Box>

        {/* Recommendations and Recent Activity */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) minmax(0, 0.95fr)" },
            gap: 1.5,
          }}
        >
          <AppCard>
            <SectionHeader
              title="AI Recommendations"
              subtitle="Top resume improvements extracted from your latest evaluation."
              action={
                hasAnalysis ? (
                  <Button size="small" variant="outlined" onClick={() => navigate("/analysis")}>
                    Full report
                  </Button>
                ) : null
              }
            />

            {recommendations.length === 0 ? (
              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" sx={{ py: 1.5 }}>
                <TipsAndUpdatesRoundedIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                  Upload and analyze your resume to unlock recommendations.
                </Typography>
              </Stack>
            ) : (
              <Stack divider={<Divider flexItem />} spacing={1.25}>
                {recommendations.map((item, index) => (
                  <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
                    <StatusChip
                      label={index === 0 ? "High" : index === 1 ? "Medium" : "Improve"}
                      color={index === 0 ? "warning" : "primary"}
                    />
                    <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "text.primary" }}>
                      {item}
                    </Typography>
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
