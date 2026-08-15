import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";
import ScoreGauge from "../components/ScoreGauge";
import AnalysisList from "../components/AnalysisList";
import SuggestionCard from "../components/SuggestionCard";

export default function Analysis() {

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const res = await api.get("/analysis/me");

        setAnalysis(res.data);

      }

      catch (err) {

        console.log(err);

      }

      setLoading(false);

    }

    load();

  }, []);

  if (loading) {

    return (

      <DashboardLayout>

        <Typography>Loading...</Typography>

      </DashboardLayout>

    );

  }

  if (!analysis) {

    return (

      <DashboardLayout>

        <Typography>No analysis found.</Typography>

      </DashboardLayout>

    );

  }

  const strengths = analysis.strengths.split("\n");

  const weaknesses = analysis.weaknesses.split("\n");

  const keywords = analysis.missing_keywords.split("\n");

  const suggestions = analysis.suggestions.split("\n");

  return (

    <DashboardLayout>

      <Typography
        variant="h4"
        sx={{ mb: 4 }}
      >

        Resume Analysis

      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12 }}>

          <Card
            sx={{
              background: "#1E293B",
            }}
          >

            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 5,
              }}
            >

              <ScoreGauge score={analysis.ats_score} />

              <Box>

                <Box
                  sx={{
                    mb: 5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >

                  <Typography
                    variant="h3"
                    fontWeight={700}
                  >

                    🤖 AI Resume Analysis

                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    <Button
                      variant="contained"
                      size="large"
                    >
                      Re-analyze Resume
                    </Button>
                    Powered by Google Gemini

                  </Typography>

                </Box>

                <Typography color="text.secondary">
                  Your resume has been analyzed by Gemini AI.
                </Typography>

                <Typography color="text.secondary">
                  Improve the highlighted weaknesses to
                  increase your ATS score.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>

          <AnalysisList
            title="Strengths"
            icon="✅"
            items={strengths}
          />

        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>

          <AnalysisList
            title="Weaknesses"
            icon="❌"
            items={weaknesses}
          />

        </Grid>

        <Grid size={{ xs: 12 }}>

          <Card>

            <CardContent>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 3 }}
              >

                Missing ATS Keywords

              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >

                {keywords.map((k) => (

                  <Chip
                    key={k}
                    label={k}
                    color="primary"
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 5,
                    }}
                  />

                ))}

              </Box>

            </CardContent>

          </Card>

        </Grid>

        <Grid size={{ xs: 12 }}>

          <Card>

            <CardContent>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 3 }}
              >

                AI Recommendations

              </Typography>

              <>

                {suggestions.map((s) => (

                  <SuggestionCard
                    key={s}
                    suggestion={s}
                  />

                ))}

              </>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </DashboardLayout>

  );

}