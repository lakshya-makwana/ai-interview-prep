import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

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
          borderRadius: 4,
        }}
      >

        <CardContent>

          <Typography
            variant="h5"
            sx={{ mb: 3 }}
          >
            Quick Actions
          </Typography>

          <Stack spacing={2}>

            <Button
              variant="contained"
              size="large"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{ mr: 1 }}
                  />
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/resume")}
              disabled={loading}
            >
              Upload Resume
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/analysis")}
              disabled={loading}
            >
              View Analysis
            </Button>

          </Stack>

        </CardContent>

      </Card>

    </>
  );
}