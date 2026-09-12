import api from "../api/api";

export async function startInterview() {
  const response = await api.post("/interviews/start");
  return response.data;
}

export async function getCurrentInterview() {
  const response = await api.get("/interviews/current");
  return response.data;
}

export async function submitAnswer(interviewQuestionId, answer) {
  const response = await api.post("/interviews/answer", {
    interview_question_id: interviewQuestionId,
    answer,
  });
  return response.data;
}

export async function getInterviewById(id) {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
}

export async function getInterviewEvaluation(id) {
  const response = await api.get(`/interviews/${id}/evaluation`);
  return response.data;
}
