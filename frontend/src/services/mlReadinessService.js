import api from "../api/api";

/**
 * Retrieve ML readiness assessment and criteria evaluation.
 * Deterministic analysis of dataset size, completeness, topic & difficulty balance.
 */
export async function getMLReadiness() {
  const response = await api.get("/ml-readiness");
  return response.data;
}
