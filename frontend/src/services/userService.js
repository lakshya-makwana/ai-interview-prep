import api from "../api/api";

export async function getUserProfile() {
  const response = await api.get("/users/profile");
  return response.data;
}
