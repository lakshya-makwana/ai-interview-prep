import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";

import { useNavigate } from "react-router-dom";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import AnalysisSkeleton from "../components/skeletons/AnalysisSkeleton";
import { useDashboard } from "../context/DashboardContext";

function splitLines(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.replace(/^[-*•\d.]+\s*/, "").trim())
    .filter(Boolean);
}

function scoreColor(score) {
  if (score >= 85) return "success";
  if (score >= 70) return "primary";
  if (score >= 50) return "warning";
  return "error";
}

export default function Analysis() {
  const navigate = useNavigate();
  const { dashboard, loading } = useDashboard();

  if (loading) {
    return (
      <DashboardLayout>
        <AnalysisSkeleton />
      </DashboardLayout>
    );
  }

  const analysis = dashboard.analysis;
  const score = analysis?.ats_score ?? 0;
  const suggestions = splitLines(analysis?.suggestions);
  const color = scoreColor(score);

  return (
    <DashboardLayout>
      <Stack spacing={2.5}>
        {/* Standard Page Header */}
        <PageHeader
          title="AI Analysis"
          description="Review ATS score and prioritized recommendations extracted from your resume."
          action={
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/resume")}
            >
              Replace Resume
            </Button>
          }
        />

        {!analysis ? (
          <EmptyState
            icon={PsychologyRoundedIcon}
            title="No Analysis Report Available"
            description="Upload your PDF resume to generate an instant ATS compatibility score, identify missing skills, and unlock prioritized recommendations."
            actionLabel="Upload Resume"
            onAction={() => navigate("/resume")}
            secondaryActionLabel="Back to Dashboard"
            onSecondaryAction={() => navigate("/")}
          />
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "340px minmax(0, 1fr)" },
                gap: 2.5,
              }}
            >
              <AppCard>
                <SectionHeader title="ATS Score" subtitle="Overall resume compatibility." />

                <Stack spacing={2}>
                  <Typography variant="h2" color={`${color}.main`} sx={{ lineHeight: 1, fontWeight: 800 }}>
                    {score}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    color={color}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <StatusChip
                    label={score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Needs improvement" : "High priority"}
                    color={color}
                    sx={{ width: "fit-content" }}
                  />
                </Stack>
              </AppCard>

              <AppCard>
                <SectionHeader title="Report Summary" subtitle="Analyzed resume metadata." />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DescriptionRoundedIcon color="success" fontSize="small" />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={600}>Resume File</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {dashboard.resume?.filename || "Uploaded file"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PsychologyRoundedIcon color="primary" fontSize="small" />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={600}>Model Review</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gemini ATS review completed
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {analysis.summary && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {analysis.summary}
                    </Typography>
                  </>
                )}
              </AppCard>
            </Box>

            <AppCard>
              <SectionHeader
                title="Recommended Improvements"
                subtitle="Apply these actionable changes to improve your ATS score."
              />

              {suggestions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No written suggestions were returned with this report.
                </Typography>
              ) : (
                <Stack divider={<Divider flexItem />} spacing={1.5}>
                  {suggestions.map((item, index) => (
                    <Stack key={`${item}-${index}`} direction="row" spacing={1.5} alignItems="flex-start">
                      <CheckCircleRoundedIcon
                        color={index < 2 ? "warning" : "primary"}
                        fontSize="small"
                        sx={{ mt: 0.25, flexShrink: 0 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {index === 0 ? "High Priority" : index === 1 ? "Medium Priority" : "Suggested Improvement"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                          {item}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </AppCard>
          </>
        )}
      </Stack>
    </DashboardLayout>
  );
}
