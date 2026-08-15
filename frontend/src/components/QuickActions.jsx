import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VisibilityIcon from "@mui/icons-material/Visibility";

import LoadingOverlay from "./LoadingOverlay";

import { analyzeResume } from "../services/analysisService";
import { useDashboard } from "../context/DashboardContext";

export default function QuickActions() {

  const navigate = useNavigate();

  const { refreshDashboard } = useDashboard();

  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {

    try {

      setLoading(true);

      await analyzeResume();

      await refreshDashboard();

      navigate("/analysis");

    }

    catch (err) {

      console.error(err);

      alert("Analysis failed.");

    }

    finally {

      setLoading(false);

    }

  }

  return (
    <>
      <LoadingOverlay open={loading} />

      <Card
        sx={{
          height: "100%",
          borderRadius: 5,
          background: "#1E293B",
        }}
      >

        <CardContent sx={{ p: 4 }}>

          <Typography
            variant="h5"
            fontWeight={700}
          >
            ⚡ Quick Actions
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            Everything you need in one place.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>

            <Button
              fullWidth
              size="large"
              startIcon={<UploadFileIcon />}
              variant="outlined"
              onClick={() => navigate("/resume")}
              disabled={loading}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 3,
                height: 56,
              }}
            >
              Upload / Replace Resume
            </Button>

            <Button
              fullWidth
              size="large"
              startIcon={<PsychologyIcon />}
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading}
              sx={{
                borderRadius: 3,
                height: 56,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{ mr: 1 }}
                  />
                  AI is Working...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>

            <Button
              fullWidth
              size="large"
              startIcon={<VisibilityIcon />}
              variant="outlined"
              onClick={() => navigate("/analysis")}
              disabled={loading}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 3,
                height: 56,
              }}
            >
              View Analysis Report
            </Button>

          </Stack>

          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 3,
              bgcolor: "rgba(59,130,246,0.10)",
            }}
          >

            <Typography
              variant="subtitle2"
              fontWeight={700}
            >
              💡 Pro Tip
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Re-run the analysis whenever you update your resume to
              track improvements in your ATS score.
            </Typography>

          </Box>

        </CardContent>

      </Card>
    </>
  );
}