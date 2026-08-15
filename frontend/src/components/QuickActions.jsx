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

import { analyzeResume } from "../services/analysisService";

export default function QuickActions() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {

    try {

      setLoading(true);

      await analyzeResume();

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
            {loading
              ? <CircularProgress size={22} color="inherit" />
              : "Analyze Resume"}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/resume")}
          >
            Upload Resume
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/analysis")}
          >
            View Analysis
          </Button>

        </Stack>

      </CardContent>

    </Card>

  );

}