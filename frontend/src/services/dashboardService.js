import api from "../api/api";

export async function getDashboard() {
  const result = {
    resume: null,
    analysis: null,
    coding_progress: null,
  };

  try {
    const resume = await api.get("/resume/me");
    result.resume = resume.data;
  } catch {
    // Resume might not exist yet for new users
    result.resume = null;
  }

  try {
    const analysis = await api.get("/analysis/me");
    result.analysis = analysis.data;
  } catch {
    // Analysis might not exist yet
    result.analysis = null;
  }

  try {
    const codingProgress = await api.get("/coding/progress/me");
    result.coding_progress = codingProgress.data;
  } catch {
    // Coding progress might not exist yet
    result.coding_progress = null;
  }

  return result;
}
