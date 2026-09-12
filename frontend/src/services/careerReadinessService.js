import api from "../api/api";

export async function getCareerReadinessReport() {
  const response = await api.get("/career-readiness");
  return response.data;
}
