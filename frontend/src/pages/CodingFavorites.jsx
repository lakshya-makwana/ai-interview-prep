import { useEffect, useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import ProblemsTable from "../components/coding/ProblemsTable";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/codingService";


function CodingFavorites() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);

        const data = await getFavorites();
        setQuestions(
          (data.favorites || []).map(
            (favorite) => favorite.question
          )
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleToggleFavorite(question) {
    try {
      if (question.is_favorited) {
        await removeFavorite(question.id);
        setQuestions((currentQuestions) =>
          currentQuestions.filter(
            (currentQuestion) =>
              currentQuestion.id !== question.id
          )
        );
      } else {
        await addFavorite(question.id);
        setQuestions((currentQuestions) =>
          currentQuestions.map((currentQuestion) =>
            currentQuestion.id === question.id
              ? {
                  ...currentQuestion,
                  is_favorited: true,
                }
              : currentQuestion
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Favorite Problems
        </Typography>

        <Typography color="text.secondary">
          {questions.length} Problems
        </Typography>
      </Box>

      <ProblemsTable
        questions={questions}
        loading={loading}
        onToggleFavorite={handleToggleFavorite}
      />
    </DashboardLayout>
  );
}

export default CodingFavorites;
