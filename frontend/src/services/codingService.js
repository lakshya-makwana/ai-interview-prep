import api from "../api/api";

export const getQuestions = async (
  page = 1,
  limit = 20,
  search = "",
  difficulty = null,
  category = null
) => {
  const params = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (difficulty) {
    params.difficulty = difficulty;
  }

  if (category) {
    params.category = category;
  }

  const response = await api.get("/coding/questions", {
    params,
  });

  return response.data;
};

export const getQuestion = async (slug) => {
    const response = await api.get(
        `/coding/questions/slug/${slug}`
    );

    return response.data;
};

export const getSampleTestCases = async (questionId) => {
  const response = await api.get(
    `/coding/questions/${questionId}/test-cases`
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/coding/categories");
  return response.data;
};

export const getStatistics = async () => {
  const response = await api.get("/coding/statistics");
  return response.data;
};

export const getCodingProgress = async () => {
  const response = await api.get("/coding/progress/me");
  return response.data;
};

export const addFavorite = async (questionId) => {
  const response = await api.post(
    `/coding/favorites/${questionId}`
  );

  return response.data;
};

export const removeFavorite = async (questionId) => {
  const response = await api.delete(
    `/coding/favorites/${questionId}`
  );

  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get("/coding/favorites");

  return response.data;
};
