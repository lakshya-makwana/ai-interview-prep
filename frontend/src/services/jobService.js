import api from "../api/api";

export async function analyzeJob(jobDescription) {
  const response = await api.post("/jobs/analyze", {
    job_description: jobDescription,
  });
  return response.data;
}

export async function getLatestJob() {
  const response = await api.get("/jobs/me");
  return response.data;
}

export async function deleteJob() {
  const response = await api.delete("/jobs/me");
  return response.data;
}
