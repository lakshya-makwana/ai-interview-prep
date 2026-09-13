from typing import List, Set
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.interview import Interview, InterviewQuestion
from app.models.interview_evaluation import InterviewEvaluation
from app.models.user import User
from app.schemas.career_readiness import (
    CareerReadinessResponse,
    QuestionFeedbackItem,
)
from app.services.matching_service import generate_matching_report


def generate_career_readiness_report(
    db: Session,
    current_user: User,
) -> CareerReadinessResponse:
    """Generate deterministic Career Readiness Report combining Resume Match and Interview Evaluations.
    
    Strictly reads from database. Never triggers Gemini.
    """
    # 1. Fetch Resume Match Report
    match_report = generate_matching_report(db, current_user)
    resume_match_score = match_report.match_score

    # 2. Fetch Latest Completed Interview
    latest_interview = (
        db.query(Interview)
        .options(
            selectinload(Interview.questions).selectinload(InterviewQuestion.evaluation)
        )
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "Completed",
        )
        .order_by(Interview.completed_at.desc(), Interview.id.desc())
        .first()
    )

    if latest_interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No completed interview found. Please complete a technical interview first.",
        )

    # 3. Read Stored Evaluations (No Gemini calls)
    evaluations: List[tuple[InterviewEvaluation, str, str, str]] = []
    for q in sorted(latest_interview.questions, key=lambda x: x.display_order):
        if q.evaluation:
            evaluations.append((q.evaluation, q.question_text, q.topic, q.difficulty))

    if not evaluations:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview evaluations are missing. Please view your interview evaluation first.",
        )

    # 4. Calculate Average Interview Overall Score
    avg_interview_score = sum(e[0].overall_score for e in evaluations) / len(evaluations)
    avg_interview_score = round(avg_interview_score, 1)

    # 5. Calculate Career Readiness Score: 0.40 * Resume Match + 0.60 * (Average Interview * 10)
    interview_score_100 = avg_interview_score * 10.0
    career_readiness_score = round(
        (0.40 * resume_match_score) + (0.60 * interview_score_100),
        1,
    )
    career_readiness_score = max(0.0, min(100.0, career_readiness_score))

    # 6. Determine Strengths
    strengths: List[str] = []
    # (a) Matched skills
    for s in match_report.matched_skills[:4]:
        strengths.append(f"Demonstrated verified proficiency in {s}")
    # (b) High scoring interview topics
    for ev, _, topic, _ in evaluations:
        if ev.overall_score >= 8.0:
            msg = f"Strong interview performance in {topic} ({ev.overall_score}/10)"
            if msg not in strengths:
                strengths.append(msg)
    # (c) Specific strength takeaways
    for ev, _, _, _ in evaluations:
        for st in ev.strengths:
            if st and st not in strengths and len(strengths) < 8:
                strengths.append(st)

    # 7. Determine Weaknesses
    weaknesses: List[str] = []
    # (a) Missing required skills
    for ms in match_report.missing_required_skills[:4]:
        weaknesses.append(f"Missing required job skill: {ms}")
    # (b) Lower scoring interview topics
    for ev, _, topic, _ in evaluations:
        if ev.overall_score < 7.5:
            msg = f"Needs deeper technical preparation in {topic} ({ev.overall_score}/10)"
            if msg not in weaknesses:
                weaknesses.append(msg)
    # (c) Specific missing concepts
    for ev, _, _, _ in evaluations:
        for mc in ev.missing_concepts:
            if mc and mc not in weaknesses and len(weaknesses) < 8:
                weaknesses.append(mc)

    # 8. Generate Priority Skills (Ordered list):
    # 1. Missing required skills
    # 2. Weak interview topics
    # 3. Missing preferred skills
    priority_skills: List[str] = []
    seen_skills: Set[str] = set()

    for skill in match_report.missing_required_skills:
        skill_clean = skill.strip()
        skill_norm = skill_clean.lower()
        if skill_norm not in seen_skills:
            seen_skills.add(skill_norm)
            priority_skills.append(skill_clean)

    # Weak interview topics ordered by lowest score
    sorted_weak_topics = sorted(
        [e for e in evaluations if e[0].overall_score < 8.0],
        key=lambda x: x[0].overall_score,
    )
    for _, _, topic, _ in sorted_weak_topics:
        topic_clean = topic.strip()
        topic_norm = topic_clean.lower()
        if topic_norm not in seen_skills:
            seen_skills.add(topic_norm)
            priority_skills.append(topic_clean)

    for skill in match_report.missing_preferred_skills:
        skill_clean = skill.strip()
        skill_norm = skill_clean.lower()
        if skill_norm not in seen_skills:
            seen_skills.add(skill_norm)
            priority_skills.append(skill_clean)

    # 9. Assemble Stored Interview Feedback
    interview_feedback: List[QuestionFeedbackItem] = []
    for ev, q_text, topic, difficulty in evaluations:
        interview_feedback.append(
            QuestionFeedbackItem(
                question_text=q_text,
                topic=topic,
                difficulty=difficulty,
                overall_score=ev.overall_score,
                summary=ev.summary or "Evaluation recorded.",
                feedback=ev.feedback,
                strengths=ev.strengths,
                missing_concepts=ev.missing_concepts,
            )
        )

    return CareerReadinessResponse(
        career_readiness_score=career_readiness_score,
        resume_match_score=resume_match_score,
        average_interview_score=avg_interview_score,
        strengths=strengths,
        weaknesses=weaknesses,
        missing_required_skills=match_report.missing_required_skills,
        missing_preferred_skills=match_report.missing_preferred_skills,
        priority_skills=priority_skills,
        interview_feedback=interview_feedback,
    )
