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
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">AI Analysis</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Review your ATS score and prioritized improvements from the latest Gemini analysis.
          </Typography>
        </Box>

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
                gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0, 1fr)" },
                gap: 3,
              }}
            >
              <AppCard>
                <SectionHeader title="ATS Score" subtitle="Current resume compatibility." />

                <Stack spacing={2.5}>
                  <Typography variant="h2" color={`${color}.main`} sx={{ lineHeight: 1 }}>
                    {score}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    color={color}
                    sx={{ height: 10, borderRadius: 999 }}
                  />
                  <StatusChip
                    label={score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Needs improvement" : "High priority"}
                    color={color}
                    sx={{ width: "fit-content" }}
                  />
                </Stack>
              </AppCard>

              <AppCard>
                <SectionHeader title="Report Summary" subtitle="What the system analyzed." />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <DescriptionRoundedIcon color="success" />
                    <Box>
                      <Typography fontWeight={800}>Resume</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dashboard.resume?.filename || "Uploaded file"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <PsychologyRoundedIcon color="primary" />
                    <Box>
                      <Typography fontWeight={800}>AI Analysis</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gemini resume review completed
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {analysis.summary && (
                  <>
                    <Divider sx={{ my: 2.5 }} />
                    <Typography color="text.secondary">{analysis.summary}</Typography>
                  </>
                )}
              </AppCard>
            </Box>

            <AppCard>
              <SectionHeader
                title="Recommended Improvements"
                subtitle="Apply these changes before rerunning analysis."
                action={<Button variant="outlined" onClick={() => navigate("/resume")}>Replace resume</Button>}
              />

              {suggestions.length === 0 ? (
                <Typography color="text.secondary">
                  No written suggestions were returned with this report.
                </Typography>
              ) : (
                <Stack divider={<Divider flexItem />} spacing={1.5}>
                  {suggestions.map((item, index) => (
                    <Stack key={`${item}-${index}`} direction="row" spacing={1.5} alignItems="flex-start">
                      <CheckCircleRoundedIcon color={index < 2 ? "warning" : "primary"} />
                      <Box>
                        <Typography fontWeight={800}>
                          {index === 0 ? "High priority" : index === 1 ? "Medium priority" : "Improvement"}
                        </Typography>
                        <Typography color="text.secondary">{item}</Typography>
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
