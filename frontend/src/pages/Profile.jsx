import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

import AppCard from "../components/AppCard";
import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import { getUserProfile } from "../services/userService";

function formatJoinDate(value) {
  if (!value) return "--";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const profileRes = await getUserProfile();
        if (isMounted) setProfileData(profileRes);
      } catch {
        // Fallback profile is handled gracefully
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <ProfileSkeleton />
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

  return (
    <DashboardLayout>
      <Stack spacing={2}>
        {/* Standard Page Header */}
        <PageHeader
          title="User Profile"
          description="Account credentials, verified resume status, and platform identity."
          action={
            <Button
              variant="outlined"
              size="small"
              startIcon={<DescriptionRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate(resume.uploaded ? "/analysis" : "/resume")}
            >
              {resume.uploaded ? "View Analysis" : "Upload Resume"}
            </Button>
          }
          sx={{ mb: 0 }}
        />

        {/* Profile Information Card */}
        <AppCard>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={1.75} alignItems="center">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "primary.main",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : <PersonRoundedIcon />}
              </Avatar>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                    {user.name}
                  </Typography>
                  <StatusChip label="Active" color="success" />
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0.5, sm: 2 }}
                  sx={{ mt: 0.5 }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                    <EmailRoundedIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>{user.email}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                    <CalendarMonthRoundedIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                      Joined {formatJoinDate(user.joined_at)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </AppCard>

        {/* Resume Summary Card */}
        <AppCard>
          <SectionHeader
            title="Resume & Evaluation Summary"
            subtitle="Current candidate credentials and analysis status."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" sx={{ fontSize: "0.6875rem", letterSpacing: "0.03em" }}>
                Resume Status
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
                {resume.uploaded ? (
                  <CheckCircleRoundedIcon color="success" sx={{ fontSize: 16 }} />
                ) : (
                  <RadioButtonUncheckedRoundedIcon color="disabled" sx={{ fontSize: 16 }} />
                )}
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                  {resume.uploaded ? "Uploaded" : "Not Uploaded"}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" sx={{ fontSize: "0.6875rem", letterSpacing: "0.03em" }}>
                Active Filename
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
                <DescriptionRoundedIcon color="primary" sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8125rem" }} noWrap title={resume.filename || "No file uploaded"}>
                  {resume.filename || "No file uploaded"}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" sx={{ fontSize: "0.6875rem", letterSpacing: "0.03em" }}>
                ATS Compatibility
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                <PsychologyRoundedIcon color={resume.ats_score != null ? "primary" : "disabled"} sx={{ fontSize: 16 }} />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: resume.ats_score != null ? "primary.main" : "text.secondary",
                  }}
                >
                  {resume.ats_score != null ? `${resume.ats_score}%` : "--"}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </AppCard>
      </Stack>
    </DashboardLayout>
  );
}
