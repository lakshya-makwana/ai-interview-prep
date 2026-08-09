import api from "../api/api";

export async function getDashboardData() {
  try {
    const [resumeResponse, analysisResponse] = await Promise.all([
      api.get("/resume/me"),
      api.get("/analysis/me"),
    ]);

    return {
      resume: resumeResponse.data,
      analysis: analysisResponse.data,
    };
  } catch (error) {
    console.error(error);

    return {
      resume: null,
      analysis: null,
    };
  }
}