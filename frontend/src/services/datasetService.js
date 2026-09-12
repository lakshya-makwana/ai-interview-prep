import api from "../api/api";

export async function getDataset() {
  const response = await api.get("/dataset");
  return response.data;
}

export async function getDatasetStatistics() {
  const response = await api.get("/dataset/statistics");
  return response.data;
}
