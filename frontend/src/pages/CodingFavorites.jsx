import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
} from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import ProblemsTable from "../components/coding/ProblemsTable";
import { useSnackbar } from "../context/SnackbarContext";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/codingService";

function CodingFavorites() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
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
        showSuccess(`"${question.title}" removed from favorites.`);
        setQuestions((currentQuestions) =>
          currentQuestions.filter(
            (currentQuestion) =>
              currentQuestion.id !== question.id
          )
        );
      } else {
        await addFavorite(question.id);
        showSuccess(`"${question.title}" added to favorites.`);
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
      showError("Failed to update favorite status. Please try again.");
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
          {questions.length} Problem{questions.length === 1 ? "" : "s"}
        </Typography>
      </Box>

      <ProblemsTable
        questions={questions}
        loading={loading}
        onToggleFavorite={handleToggleFavorite}
        emptyTitle="No Favorite Problems Yet"
        emptyDescription="You haven't bookmarked any coding problems yet. Click the bookmark icon on any problem to save it here for fast access."
        emptyActionLabel="Explore Problems"
        onEmptyAction={() => navigate("/coding")}
      />
    </DashboardLayout>
  );
}

export default CodingFavorites;
