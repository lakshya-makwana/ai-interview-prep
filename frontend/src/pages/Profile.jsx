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
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import { getUserProfile } from "../services/userService";

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

export default function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const profileRes = await getUserProfile();
        setProfileData(profileRes);
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
      </Stack>
    </DashboardLayout>
  );
}

