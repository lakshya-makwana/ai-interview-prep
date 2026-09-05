import api from "../api/api";

export async function getMySubmissions(questionId = null) {
  const params = {};

  if (questionId) {
    params.question_id = questionId;
  }

  const response = await api.get("/coding/submissions/me", {
    params,
  });

  return response.data;
}

export async function getSubmission(submissionId) {
  const response = await api.get(
    `/coding/submissions/${submissionId}`
  );

  return response.data;
}
