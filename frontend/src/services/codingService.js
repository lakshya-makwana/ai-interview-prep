import api from "../api/api";

export const getQuestions = async (
  pageOrOptions = 1,
  limit = 20,
  search = "",
  difficulty = null,
  category = null,
  tag = null,
  solved = null,
  favorite = null,
  sortBy = null,
  sortOrder = null
) => {
  let params;

  if (typeof pageOrOptions === "object" && pageOrOptions !== null) {
    const opts = pageOrOptions;
    params = {
      page: opts.page || 1,
      limit: opts.pageSize || opts.limit || 20,
    };
    if (opts.search) params.search = opts.search;
    if (opts.difficulty) params.difficulty = opts.difficulty;
    if (opts.category) params.category = opts.category;
    if (opts.tag) params.tag = opts.tag;
    if (opts.solved !== null && opts.solved !== undefined) params.solved = opts.solved;
    if (opts.favorite !== null && opts.favorite !== undefined) params.favorite = opts.favorite;
    if (opts.sortBy) params.sort_by = opts.sortBy;
    if (opts.sortOrder) params.sort_order = opts.sortOrder;
  } else {
    params = {
      page: pageOrOptions,
      limit,
    };
    if (search) params.search = search;
    if (difficulty) params.difficulty = difficulty;
    if (category) params.category = category;
    if (tag) params.tag = tag;
    if (solved !== null && solved !== undefined) params.solved = solved;
    if (favorite !== null && favorite !== undefined) params.favorite = favorite;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
  }

  const response = await api.get("/coding/questions", {
    params,
  });

  return response.data;
};

export const getTags = async () => {
  const response = await api.get("/coding/questions/tags");
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
