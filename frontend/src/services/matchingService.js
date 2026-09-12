import api from "../api/api";

export async function getMatchingReport() {
  const response = await api.get("/matching/report");
  return response.data;
}
