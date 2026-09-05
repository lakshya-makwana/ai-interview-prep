import api from "../api/api";

export async function runCode(
  language,
  source_code,
  stdin = ""
) {
  const response = await api.post("/coding/run", {
    language,
    source_code,
    stdin,
  });

  return response.data;
}

export async function submitCode(
  question_id,
  language,
  source_code
) {
  const response = await api.post("/coding/submit", {
    question_id,
    language,
    source_code,
  });

  return response.data;
}
