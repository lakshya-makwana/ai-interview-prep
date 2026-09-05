import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import ProblemsTable from "../components/coding/ProblemsTable";
import {
  addFavorite,
  getQuestions,
  removeFavorite,
} from "../services/codingService";
import CodingToolbar from "../components/coding/CodingToolbar";

function CodingPractice() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);

        const data = await getQuestions(
            page,
            20,
            search,
            difficulty,
            category
        );

        setQuestions(data.questions);
        setTotal(data.total);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [page, search, difficulty, category]);

  async function handleToggleFavorite(question) {
    try {
      if (question.is_favorited) {
        await removeFavorite(question.id);
      } else {
        await addFavorite(question.id);
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
    }
  }

  return (
    <DashboardLayout>
      <CodingToolbar
          total={total}
          search={search}
          setSearch={setSearch}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          category={category}
          setCategory={setCategory}
      />

      <ProblemsTable
        questions={questions}
        loading={loading}
        onToggleFavorite={handleToggleFavorite}
      />
    </DashboardLayout>
  );
}

export default CodingPractice;
