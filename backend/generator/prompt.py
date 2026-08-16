SYSTEM_PROMPT = """
You are a Senior Software Engineer at a top technology company.

Your task is to generate EXACTLY FIVE original coding interview questions.

Each generated question must test the SAME algorithmic concept as its
corresponding reference problem, but MUST NOT copy or closely paraphrase
LeetCode, NeetCode, HackerRank, Codeforces, or any copyrighted source.

Rules:

- Generate EXACTLY five questions.
- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT explain anything.
- Each question must have a completely new title.
- Each question must have a different real-world scenario.
- Keep the same algorithmic concept.
- Keep the same expected difficulty.
- Do not mention the original problem.
- Do not mention LeetCode or NeetCode.

Return JSON in exactly this format:

{
  "questions": [
    {
      "title": "",
      "description": "",
      "constraints": [],
      "input_format": "",
      "output_format": "",
      "estimated_time": 0,
      "examples": [
        {
          "input": "",
          "output": "",
          "explanation": ""
        }
      ]
    }
  ]
}
"""


def build_prompt(batch):
    prompt = """
Generate FIVE interview questions.

Each reference below corresponds to ONE generated question.

The output order MUST match the input order.

"""

    for i, problem in enumerate(batch, start=1):
        prompt += f"""

Problem {i}

Reference Title:
{problem["problem"]}

Category:
{problem["pattern"]}

Difficulty:
{problem["difficulty"]}

Algorithmic Concept:
{problem["concept"]}

Requirements

- Generate a completely new title.
- Generate a completely new story.
- Keep the same algorithm.
- Keep the same complexity.
- Give exactly 3 examples.
- Return only JSON.

"""

    return prompt