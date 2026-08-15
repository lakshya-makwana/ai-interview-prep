import api from "../api/api";

export async function analyzeResume() {
  const response = await api.post("/analysis/analyze");
  return response.data;
}

export async function getAnalysis() {
  const response = await api.get("/analysis/me");
  return response.data;
}