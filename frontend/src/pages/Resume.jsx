import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import ResumeSkeleton from "../components/skeletons/ResumeSkeleton";
import { useDashboard } from "../context/DashboardContext";
import { useSnackbar } from "../context/SnackbarContext";
import { uploadResume } from "../services/resumeService";
import { analyzeResume } from "../services/analysisService";
import {
  confirmSkills,
  getCandidateProfile,
  updateVerifiedSkills,
} from "../services/candidateProfileService";

export default function Resume() {
  const navigate = useNavigate();
  const { dashboard, loading: dashboardLoading, refreshDashboard } = useDashboard();
  const { showSuccess, showError } = useSnackbar();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Candidate Profile (Phase 1.5)
  const [profile, setProfile] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [confirmingSkills, setConfirmingSkills] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const data = await getCandidateProfile();
      setProfile(data);

      if (data.skills_verified || (data.verified_skills && data.verified_skills.length > 0)) {
        setSkillsList(data.verified_skills || []);
      } else {
        setSkillsList(data.extracted_skills || []);
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        console.error("Failed to load candidate profile:", err);
      }
      setProfile(null);
      setSkillsList([]);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (dashboard.resume) {
      getCandidateProfile()
        .then((data) => {
          if (!isMounted) return;
          setProfile(data);
          if (data.skills_verified || (data.verified_skills && data.verified_skills.length > 0)) {
            setSkillsList(data.verified_skills || []);
          } else {
            setSkillsList(data.extracted_skills || []);
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          if (err?.response?.status !== 404) {
            console.error("Failed to load candidate profile:", err);
          }
          setProfile(null);
          setSkillsList([]);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [dashboard.resume]);

  if (dashboardLoading) {
    return (
      <DashboardLayout>
        <ResumeSkeleton />
      </DashboardLayout>
    );
  }

  async function handleUpload() {
    if (!file) {
      setError("Please choose a PDF resume first.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setError("");

      await uploadResume(file);
      await analyzeResume();
      await refreshDashboard();
      await fetchProfile();

      setFile(null);
      const successMsg = "Resume uploaded and analyzed successfully.";
      setSuccess(successMsg);
      showSuccess(successMsg);
    } catch (err) {
      console.error(err);
      const errorMsg = "Upload or analysis failed. Please ensure the file is a valid PDF and try again.";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  function handleSkillChange(index, value) {
    const updated = [...skillsList];
    updated[index] = value;
    setSkillsList(updated);
  }

  function handleRemoveSkill(index) {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  }

  function handleAddSkill() {
    setSkillsList([...skillsList, ""]);
  }

  async function handleSaveSkills() {
    try {
      setSavingSkills(true);
      const cleaned = skillsList.map((s) => s.trim()).filter(Boolean);
      const updated = await updateVerifiedSkills(cleaned);
      setProfile(updated);
      setSkillsList(updated.verified_skills || []);
      showSuccess("Skills updated successfully.");
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.detail || "Failed to update skills.");
    } finally {
      setSavingSkills(false);
    }
  }

  async function handleConfirmSkills() {
    try {
      setConfirmingSkills(true);
      const cleaned = skillsList.map((s) => s.trim()).filter(Boolean);
      if (cleaned.length > 0) {
        await updateVerifiedSkills(cleaned);
      }
      const updated = await confirmSkills();
      setProfile(updated);
      setSkillsList(updated.verified_skills || []);
      showSuccess("Skills verified successfully.");
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.detail || "Failed to confirm skills.");
    } finally {
      setConfirmingSkills(false);
    }
  }

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Resume & Skills
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Upload your resume, review ATS analysis, and verify candidate skills for job matching.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<PsychologyRoundedIcon fontSize="small" />}
            onClick={() => navigate("/analysis")}
          >
            View Analysis
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)" },
            gap: 2.5,
          }}
        >
          {/* Upload Card */}
          <AppCard>
            <SectionHeader
              title="Upload Resume"
              subtitle="PDF files work best for structured text extraction."
              action={
                <StatusChip
                  label={dashboard.resume ? "Resume saved" : "No resume"}
                  color={dashboard.resume ? "success" : "warning"}
                />
              }
            />

            <Box
              component="label"
              sx={{
                minHeight: 220,
                border: 1,
                borderStyle: "dashed",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3,
                cursor: "pointer",
                transition: (theme) => theme.transitions.create(["border-color", "background-color"]),
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <input
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  if (selected) {
                    setFile(selected);
                    setError("");
                    setSuccess("");
                  }
                }}
              />

              <Stack alignItems="center" spacing={1.5}>
                <CloudUploadRoundedIcon color="primary" sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {file ? file.name : "Choose a resume PDF"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    Click to browse or drop a PDF file here.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2.5 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadRoundedIcon fontSize="small" />}
              >
                {loading ? "Uploading..." : dashboard.resume ? "Replace Resume" : "Upload Resume"}
              </Button>

              <Button variant="outlined" onClick={() => navigate("/analysis")}>
                View Analysis
              </Button>
            </Stack>

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </AppCard>

          {/* Current Resume Card */}
          <AppCard>
            <SectionHeader title="Current Resume" subtitle="The active file used for analysis." />

            {dashboard.resume ? (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "action.hover",
                      color: "primary.main",
                    }}
                  >
                    <DescriptionRoundedIcon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                      {dashboard.resume.filename || "Uploaded resume"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ready for AI analysis
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <PsychologyRoundedIcon color={dashboard.analysis ? "success" : "disabled"} fontSize="small" />
                    <Typography variant="body2" color={dashboard.analysis ? "text.primary" : "text.secondary"}>
                      {dashboard.analysis ? "Analysis completed" : "Analysis pending"}
                    </Typography>
                  </Stack>

                  {dashboard.analysis && (
                    <StatusChip label={`ATS Score: ${dashboard.analysis.ats_score}%`} color="primary" />
                  )}

                  {profile && (
                    <StatusChip
                      label={profile.skills_verified ? "Skills Verified" : "Verification Pending"}
                      color={profile.skills_verified ? "success" : "warning"}
                    />
                  )}
                </Stack>
              </Stack>
            ) : (
              <EmptyState
                icon={DescriptionRoundedIcon}
                title="No Resume Uploaded"
                description="Upload a PDF file to begin analysis and skill extraction."
              />
            )}
          </AppCard>
        </Box>

        {/* Phase 1.5: Candidate Skill Verification Section */}
        {dashboard.resume && (
          <AppCard>
            <SectionHeader
              title="Candidate Skill Verification"
              subtitle="Review, edit, and confirm AI-extracted skills before job matching."
              action={
                profile?.skills_verified ? (
                  <Chip
                    icon={<CheckCircleRoundedIcon fontSize="small" />}
                    label="Skills Verified"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    label="Unverified"
                    color="warning"
                    size="small"
                  />
                )
              }
            />

            {profileLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <Stack spacing={2}>
                {profile?.skills_verified && (
                  <Alert severity="success" icon={<VerifiedUserRoundedIcon fontSize="small" />}>
                    Skills Verified. These skills are confirmed as your trusted profile for job matching.
                  </Alert>
                )}

                <Typography variant="body2" color="text.secondary">
                  {profile?.skills_verified
                    ? "Your skills have been confirmed. You can modify and re-save if needed."
                    : "The skills below were extracted by Gemini AI from your resume. Review and confirm them for matching."}
                </Typography>

                {/* Editable Skills List */}
                <Stack spacing={1.25}>
                  {skillsList.map((skill, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                    >
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="e.g. Python, Docker, PostgreSQL..."
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        disabled={savingSkills || confirmingSkills}
                        sx={{ bgcolor: "background.default" }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveSkill(index)}
                        disabled={savingSkills || confirmingSkills}
                        size="small"
                        aria-label="Remove skill"
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}

                  {skillsList.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      No skills listed. Click &quot;Add Skill&quot; below to add skills manually.
                    </Typography>
                  )}
                </Stack>

                {/* Add Skill Button */}
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddRoundedIcon fontSize="small" />}
                    onClick={handleAddSkill}
                    disabled={savingSkills || confirmingSkills}
                  >
                    Add Skill
                  </Button>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                {/* Action Buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveSkills}
                    disabled={savingSkills || confirmingSkills}
                    startIcon={savingSkills ? <CircularProgress size={14} color="inherit" /> : null}
                  >
                    {savingSkills ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleConfirmSkills}
                    disabled={
                      savingSkills ||
                      confirmingSkills ||
                      skillsList.map((s) => s.trim()).filter(Boolean).length === 0
                    }
                    startIcon={
                      confirmingSkills ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <CheckCircleRoundedIcon fontSize="small" />
                      )
                    }
                  >
                    {confirmingSkills ? "Confirming..." : "Confirm Skills"}
                  </Button>
                </Stack>
              </Stack>
            )}
          </AppCard>
        )}
      </Stack>
    </DashboardLayout>
  );
}
