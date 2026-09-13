import json
import os
import re
from typing import Optional
from dotenv import load_dotenv
from fastapi import HTTPException, status
from google import genai
from sqlalchemy.orm import Session

from app.models.interview import Interview, InterviewQuestion
from app.models.interview_evaluation import InterviewEvaluation
from app.models.user import User
from app.schemas.interview_evaluation import (
    EvaluationResponse,
    InterviewEvaluationReportResponse,
    QuestionWithEvaluationResponse,
)

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = os.getenv(
    "GEMINI_MODEL",
    "models/gemini-3.5-flash-lite",
)


def build_evaluation_prompt(
    question_text: str,
    topic: str,
    difficulty: str,
    candidate_answer: str,
) -> str:
    """Build the structured prompt for Gemini answer evaluation."""
    return f"""You are an expert technical interviewer evaluating a candidate's answer for a software engineering interview.

Evaluate the candidate's answer based on:
1. Technical Correctness (0-10): How technically accurate is the answer?
2. Completeness (0-10): Did the candidate address all parts of the question?
3. Relevance (0-10): Is the answer on-topic and direct?
4. Communication (0-10): Is the explanation clear, structured, and easy to understand?
5. Overall Score (0.0-10.0): Overall assessment of the answer quality.

Also provide:
- summary: A 1-2 sentence high-level summary of the candidate's answer quality and key takeaway.
- strengths: List of 2-4 specific strengths (what the candidate did well or explained clearly).
- missing_concepts: List of 2-4 important concepts, edge cases, trade-offs, or details omitted.
- feedback: Constructive, actionable guidance on how to strengthen this specific answer in an interview.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.
Do not wrap JSON with markdown fences.

Return EXACTLY this JSON structure:
{{
  "technical_correctness": 8,
  "completeness": 7,
  "relevance": 9,
  "communication": 8,
  "overall_score": 8.0,
  "summary": "...",
  "strengths": [
    "...",
    "..."
  ],
  "missing_concepts": [
    "...",
    "..."
  ],
  "feedback": "..."
}}

All numeric scores must be between 0 and 10.

Question: {question_text}
Topic: {topic}
Difficulty: {difficulty}
Candidate Answer: {candidate_answer}
"""


def evaluate_candidate_answer(
    question_text: str,
    topic: str,
    difficulty: str,
    candidate_answer: str,
) -> dict:
    """Send candidate answer to Gemini and validate JSON response."""
    prompt = build_evaluation_prompt(
        question_text=question_text,
        topic=topic,
        difficulty=difficulty,
        candidate_answer=candidate_answer,
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    text = response.text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text).strip()

    data = json.loads(text)

    # Validate and normalize scores
    def _clamp_score(val, default=7.0):
        try:
            num = float(val)
            return max(0.0, min(10.0, round(num, 1)))
        except (ValueError, TypeError):
            return default

    technical_correctness = _clamp_score(data.get("technical_correctness", 7))
    completeness = _clamp_score(data.get("completeness", 7))
    relevance = _clamp_score(data.get("relevance", 7))
    communication = _clamp_score(data.get("communication", 7))
    overall_score = _clamp_score(data.get("overall_score", 7.0))

    summary = str(data.get("summary", "")).strip()
    if not summary:
        summary = "Answer evaluated."

    strengths = data.get("strengths", [])
    if not isinstance(strengths, list) or not strengths:
        strengths = ["Addressed core topic."]
    else:
        strengths = [str(s).strip() for s in strengths if str(s).strip()]

    missing_concepts = data.get("missing_concepts", [])
    if not isinstance(missing_concepts, list) or not missing_concepts:
        missing_concepts = ["No critical omissions identified."]
    else:
        missing_concepts = [str(m).strip() for m in missing_concepts if str(m).strip()]

    feedback = str(data.get("feedback", "")).strip()
    if not feedback:
        feedback = "Good effort. Review core principles for more thorough technical depth."

    return {
        "technical_correctness": technical_correctness,
        "completeness": completeness,
        "relevance": relevance,
        "communication": communication,
        "overall_score": overall_score,
        "summary": summary,
        "strengths": strengths,
        "missing_concepts": missing_concepts,
        "feedback": feedback,
    }


def evaluate_and_persist_answer(
    db: Session,
    question: InterviewQuestion,
) -> Optional[InterviewEvaluation]:
    """Evaluate an answered question and persist the InterviewEvaluation record."""
    if not question.candidate_answer or not question.candidate_answer.strip():
        return None

    # Check if evaluation already exists
    existing_eval = (
        db.query(InterviewEvaluation)
        .filter(InterviewEvaluation.interview_question_id == question.id)
        .first()
    )

    if existing_eval:
        return existing_eval

    eval_data = evaluate_candidate_answer(
        question_text=question.question_text,
        topic=question.topic,
        difficulty=question.difficulty,
        candidate_answer=question.candidate_answer,
    )

    evaluation = InterviewEvaluation(
        interview_question_id=question.id,
        technical_correctness=eval_data["technical_correctness"],
        completeness=eval_data["completeness"],
        relevance=eval_data["relevance"],
        communication=eval_data["communication"],
        overall_score=eval_data["overall_score"],
        summary=eval_data["summary"],
        strengths=eval_data["strengths"],
        missing_concepts=eval_data["missing_concepts"],
        feedback=eval_data["feedback"],
    )

    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation


def evaluate_and_get_interview_report(
    db: Session,
    current_user: User,
    interview_id: int,
) -> InterviewEvaluationReportResponse:
    """Retrieve full interview evaluation report.
    
    Evaluates any answered questions that have not yet been evaluated,
    and returns questions, candidate answers, and evaluations.
    """
    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found.",
        )

    # Sequentially evaluate any answered questions that don't have evaluations yet
    question_items: list[QuestionWithEvaluationResponse] = []
    for q in sorted(interview.questions, key=lambda x: x.display_order):
        eval_record = q.evaluation
        if not eval_record and q.candidate_answer and q.candidate_answer.strip():
            # Evaluate answered question
            eval_record = evaluate_and_persist_answer(db, q)

        evaluation_data = None
        if eval_record:
            evaluation_data = EvaluationResponse.model_validate(eval_record)

        question_items.append(
            QuestionWithEvaluationResponse(
                id=q.id,
                question_id=q.question_id,
                question_text=q.question_text,
                topic=q.topic,
                difficulty=q.difficulty,
                display_order=q.display_order,
                candidate_answer=q.candidate_answer,
                answered_at=q.answered_at,
                evaluation=evaluation_data,
            )
        )

    focus = (
        interview.job.title
        if interview.job and interview.job.title
        else "Technical Interview"
    )
    topics = list(
        dict.fromkeys(
            q.topic
            for q in sorted(interview.questions, key=lambda x: x.display_order)
            if q.topic
        )
    )

    return InterviewEvaluationReportResponse(
        interview_id=interview.id,
        status=interview.status,
        total_questions=interview.total_questions,
        started_at=interview.started_at,
        completed_at=interview.completed_at,
        questions=question_items,
        interview_focus=focus,
        topics=topics,
    )
