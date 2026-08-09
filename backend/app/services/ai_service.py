import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash",
)

import json


def analyze_resume(resume_text: str):

    prompt = f"""
    You are an ATS resume reviewer.

    Analyze the resume below.

    Return ONLY valid JSON.

    The JSON must have this exact format:

    {{
        "ats_score": 0,
        "strengths": [],
        "weaknesses": [],
        "missing_keywords": [],
        "suggestions": []
    }}

    Resume:

    {resume_text}
    """

    response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

    text = response.text.strip()

    # Remove markdown if Gemini wraps JSON in ```json
    text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)