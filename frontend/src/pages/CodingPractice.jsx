import { useEffect, useState } from "react";
import { Pagination, Stack } from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import ProblemsTable from "../components/coding/ProblemsTable";
import { useSnackbar } from "../context/SnackbarContext";
import {
  addFavorite,
  getQuestions,
  getTags,
  removeFavorite,
} from "../services/codingService";
import CodingToolbar from "../components/coding/CodingToolbar";

function CodingPractice() {
  const { showSuccess, showError } = useSnackbar();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [solved, setSolved] = useState(null);
  const [favorite, setFavorite] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [total, setTotal] = useState(0);
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    async function loadTags() {
      try {
        const data = await getTags();
        setTagsList(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadTags();
  }, []);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);

        const data = await getQuestions({
          page,
          pageSize,
          search,
          difficulty,
          category,
          tag,
          solved,
          favorite,
          sortBy,
          sortOrder,
        });

        setQuestions(data.questions || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [page, pageSize, search, difficulty, category, tag, solved, favorite, sortBy, sortOrder]);

  function handleSearchChange(val) {
    setSearch(val);
    setPage(1);
  }

  function handleDifficultyChange(val) {
    setDifficulty(val);
    setPage(1);
  }

  function handleCategoryChange(val) {
    setCategory(val);
    setPage(1);
  }

  function handleTagChange(val) {
    setTag(val);
    setPage(1);
  }

  function handleSolvedChange(val) {
    setSolved(val);
    setPage(1);
  }

  function handleFavoriteChange(val) {
    setFavorite(val);
    setPage(1);
  }

  function handleSortByChange(val) {
    setSortBy(val);
    setPage(1);
  }

  function handleSortOrderChange(val) {
    setSortOrder(val);
    setPage(1);
  }

  function handleResetFilters() {
    setSearch("");
    setDifficulty("");
    setCategory("");
    setTag("");
    setSolved(null);
    setFavorite(null);
    setSortBy("id");
    setSortOrder("asc");
    setPage(1);
  }

  async function handleToggleFavorite(question) {
    try {
      if (question.is_favorited) {
        await removeFavorite(question.id);
        showSuccess(`"${question.title}" removed from favorites.`);
      } else {
        await addFavorite(question.id);
        showSuccess(`"${question.title}" added to favorites.`);
      }

      setQuestions((currentQuestions) =>
        currentQuestions.map((currentQuestion) =>
          currentQuestion.id === question.id
            ? {
                ...currentQuestion,
                is_favorited: !question.is_favorited,
              }
            : currentQuestion
        )
      );
    } catch (err) {
      console.error(err);
      showError("Failed to update favorite status. Please try again.");
    }
  }

  const pageCount = Math.ceil(total / pageSize);

  return (
    <DashboardLayout>
      <CodingToolbar
        total={total}
        search={search}
        setSearch={handleSearchChange}
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        category={category}
        setCategory={handleCategoryChange}
        tag={tag}
        setTag={handleTagChange}
        tagsList={tagsList}
        solved={solved}
        setSolved={handleSolvedChange}
        favorite={favorite}
        setFavorite={handleFavoriteChange}
        sortBy={sortBy}
        setSortBy={handleSortByChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        onResetFilters={handleResetFilters}
      />

      <ProblemsTable
        questions={questions}
        loading={loading}
        onToggleFavorite={handleToggleFavorite}
        onEmptyAction={handleResetFilters}
      />

      {pageCount > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, p) => setPage(p)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </DashboardLayout>
  );
}

export default CodingPractice;
