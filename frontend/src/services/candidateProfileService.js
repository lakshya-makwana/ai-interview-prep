import api from "../api/api";

export async function getCandidateProfile() {
  const response = await api.get("/candidate-profile");
  return response.data;
}

export async function updateVerifiedSkills(verifiedSkills) {
  const response = await api.put("/candidate-profile/skills", {
    verified_skills: verifiedSkills,
  });
  return response.data;
}

export async function confirmSkills() {
  const response = await api.post("/candidate-profile/confirm", {
    confirm: true,
  });
  return response.data;
}
