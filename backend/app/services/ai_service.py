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
    You are a senior Technical Recruiter and ATS Expert with 15+ years of experience hiring Software Engineers, AI Engineers, Data Scientists, Backend Developers, and Full Stack Developers.

    Your job is to review resumes exactly like an Applicant Tracking System (ATS) before they reach a recruiter.

    Evaluate the resume using these criteria:

    1. ATS Compatibility
    2. Technical Skills
    3. Projects
    4. Education
    5. Resume Formatting
    6. Keyword Optimization
    7. Overall Recruiter Impression

    Scoring Rules:

    - 90-100 → Excellent
    - 80-89 → Very Good
    - 70-79 → Good
    - 60-69 → Average
    - Below 60 → Needs Major Improvements

    IMPORTANT:

    Return ONLY valid JSON.

    Do NOT use markdown.

    Do NOT explain anything outside the JSON.

    Return EXACTLY this structure:

    {{
        "ats_score": 0,
        "strengths": [],
        "weaknesses": [],
        "missing_keywords": [],
        "suggestions": [],
        "skills": []
    }}

    Rules for the response:

    - Give 5-8 strengths.
    - Give 5-8 weaknesses.
    - Suggest keywords that are genuinely relevant to the candidate's profile.
    - Suggestions should be specific and actionable.
    - Extract all technical skills, programming languages, frameworks, libraries, databases, and developer tools found in the resume into "skills".
    - Do not invent work experience that is not present.
    - Penalize missing metrics (accuracy, users, dataset size, latency improvements, etc.).
    - Reward strong technical projects.
    - Reward certifications.
    - Penalize unnecessary repetition.
    - Consider both ATS readability and recruiter readability.

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