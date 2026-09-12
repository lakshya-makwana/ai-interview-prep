import api from "../api/api";

export async function getDashboard() {
  const result = {
    resume: null,
    analysis: null,
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

  return result;
}
