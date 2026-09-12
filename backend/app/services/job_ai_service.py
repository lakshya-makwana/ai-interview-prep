import json
import os
import re

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = os.getenv(
    "GEMINI_MODEL",
    "models/gemini-3.5-flash-lite",
)


def _to_newline_text(val) -> str:
    if isinstance(val, list):
        return "\n".join(str(item).strip() for item in val if item)
    if isinstance(val, str):
        return val.strip()
    return ""


def extract_job_intelligence(job_description: str) -> dict:
    prompt = f"""You are extracting structured information from a software engineering job description.

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations.

Do not include comments.

Do not wrap the JSON inside ```.

If information is unavailable, return empty strings or empty arrays.

Return exactly this schema:

{{
  "title": "",
  "company_name": "",
  "required_skills": [],
  "preferred_skills": [],
  "responsibilities": [],
  "qualifications": [],
  "experience_requirements": [],
  "technologies": [],
  "domain_knowledge": []
}}

Job Description:
{job_description}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    text = response.text.strip()

    # Remove markdown code block fences if present
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()

    parsed = json.loads(text)

    return {
        "title": parsed.get("title", "") or "",
        "company_name": parsed.get("company_name", "") or "",
        "required_skills": _to_newline_text(parsed.get("required_skills")),
        "preferred_skills": _to_newline_text(parsed.get("preferred_skills")),
        "responsibilities": _to_newline_text(parsed.get("responsibilities")),
        "qualifications": _to_newline_text(parsed.get("qualifications")),
        "experience_requirements": _to_newline_text(parsed.get("experience_requirements")),
        "technologies": _to_newline_text(parsed.get("technologies")),
        "domain_knowledge": _to_newline_text(parsed.get("domain_knowledge")),
    }
