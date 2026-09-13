import api from "../api/api";

export async function getProgress() {
  const response = await api.get("/progress");
  return response.data;
}
