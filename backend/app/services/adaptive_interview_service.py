"""
Deterministic Adaptive Interview Engine for Phase 7.
Selects and adapts interview questions based on candidate verified skills,
target job requirements, resume match reports, and previous interview performance.
No ML models or LLMs are used for question selection.
"""

from typing import Any, Dict, List, Optional, Set, Tuple
from sqlalchemy.orm import Session

from app.data.question_bank import QUESTION_BANK
from app.models.candidate_profile import CandidateProfile
from app.models.interview import Interview, InterviewQuestion
from app.models.interview_evaluation import InterviewEvaluation
from app.models.resume import Resume
from app.models.user import User
from app.repositories.job_repository import job_repository
from app.services.matching_service import calculate_match_report, parse_skills_text

DIFFICULTY_ORDER = ["Medium", "Medium", "Hard", "Medium", "Hard"]
CORE_TOPICS = [
    "DBMS",
    "Operating Systems",
    "Backend",
    "Computer Networks",
    "OOP",
    "DSA Fundamentals",
]


def _normalize(text: Optional[str]) -> str:
    return text.strip().lower() if text else ""


def skill_matches_question(skill: str, question: Dict[str, Any]) -> bool:
    """Check if a skill or topic matches a question's topic or tagged skills."""
    s_norm = _normalize(skill)
    if not s_norm:
        return False

    q_topic_norm = _normalize(question.get("topic", ""))
    if s_norm == q_topic_norm or s_norm in q_topic_norm or q_topic_norm in s_norm:
        return True

    for tag in question.get("skills", []):
        tag_norm = _normalize(tag)
        if s_norm == tag_norm or s_norm in tag_norm or tag_norm in s_norm:
            return True

    return False


def collect_candidate_context(db: Session, current_user: User) -> Dict[str, Any]:
    """Collect candidate verified skills, target job requirements, and past interview history."""
    # 1. Candidate Skills
    candidate_skills: List[str] = []
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )
    if resume:
        profile = (
            db.query(CandidateProfile)
            .filter(CandidateProfile.resume_id == resume.id)
            .first()
        )
        if profile:
            raw = profile.verified_skills or profile.skills or ""
            candidate_skills = parse_skills_text(raw)

    # 2. Active Job Requirements & Match Report
    active_job = job_repository.get_by_user_id(db, current_user.id)
    job_title = active_job.title if active_job else None
    match_report = None

    if active_job and active_job.requirement:
        req = active_job.requirement
        required_skills = parse_skills_text(req.required_skills)
        preferred_skills = parse_skills_text(req.preferred_skills)
        match_report = calculate_match_report(
            verified_candidate_skills=candidate_skills,
            required_skills=required_skills,
            preferred_skills=preferred_skills,
        )

    # 3. Previous Interview History & Evaluations
    past_interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "Completed",
        )
        .order_by(Interview.id.desc())
        .all()
    )

    answered_question_ids: Set[str] = set()
    topic_scores: Dict[str, List[float]] = {}

    for interview in past_interviews:
        for q in interview.questions:
            if q.question_id:
                answered_question_ids.add(q.question_id)

            eval_rec = (
                db.query(InterviewEvaluation)
                .filter(InterviewEvaluation.interview_question_id == q.id)
                .first()
            )
            if eval_rec and eval_rec.overall_score is not None:
                topic_scores.setdefault(q.topic, []).append(eval_rec.overall_score)

    weak_topics: List[Tuple[str, float]] = []
    strong_topics: List[str] = []

    for topic, scores in topic_scores.items():
        avg_score = round(sum(scores) / len(scores), 2)
        if avg_score < 7.0:
            weak_topics.append((topic, avg_score))
        elif avg_score >= 7.5:
            strong_topics.append(topic)

    # Sort weak topics ascending by score (lowest score = highest priority)
    weak_topics.sort(key=lambda x: x[1])

    return {
        "candidate_skills": candidate_skills,
        "job_title": job_title,
        "match_report": match_report,
        "answered_question_ids": answered_question_ids,
        "weak_topics": [t[0] for t in weak_topics],
        "strong_topics": strong_topics,
        "total_past_interviews": len(past_interviews),
    }


def determine_priority_topics(context: Dict[str, Any]) -> List[str]:
    """
    Build deterministic ordered list of priority interview topics.
    Priority hierarchy:
    1. Missing required job skills (Highest Priority)
    2. Weak interview topics (High Priority)
    3. Required skills with partial evidence (Medium Priority)
    4. Preferred job skills
    5. Strong topics & foundational core topics (Fallback)
    """
    priority_topics: List[str] = []
    seen: Set[str] = set()

    def _add(item: str):
        clean = item.strip()
        norm = clean.lower()
        if norm and norm not in seen:
            seen.add(norm)
            priority_topics.append(clean)

    match_report = context.get("match_report")

    # Tier 1: Missing required job skills
    if match_report:
        for skill in match_report.missing_required_skills:
            _add(skill)

    # Tier 2: Weak interview topics from previous performance
    for topic in context.get("weak_topics", []):
        _add(topic)

    # Tier 3: Required skills with partial evidence
    if match_report:
        for item in match_report.comparison:
            if item.requirement_type == "Required" and item.candidate_evidence == "Partial":
                _add(item.skill)

    # Tier 4: Preferred job skills
    if match_report:
        for skill in match_report.missing_preferred_skills:
            _add(skill)

    # Tier 5: Candidate verified skills & core foundational topics
    for skill in context.get("candidate_skills", []):
        _add(skill)

    for core in CORE_TOPICS:
        _add(core)

    return priority_topics


def select_questions(
    db: Session,
    current_user: User,
) -> Tuple[List[Dict[str, Any]], str, List[str]]:
    """
    Deterministically select 5 questions prioritizing candidate needs.
    Ensures:
    - Exactly 5 questions
    - No duplicate questions in session
    - Avoid repeating previously answered questions where alternatives exist
    - Topic diversity
    - Difficulty progression: Medium -> Medium -> Hard -> Medium -> Hard
    """
    context = collect_candidate_context(db, current_user)
    priority_topics = determine_priority_topics(context)
    answered_in_history = context.get("answered_question_ids", set())

    selected_questions: List[Dict[str, Any]] = []
    used_question_ids: Set[str] = set()
    used_topics: Set[str] = set()

    for slot_idx in range(5):
        target_diff = DIFFICULTY_ORDER[slot_idx]
        chosen_q = None

        # Pass 1: Try priority topics with target difficulty, avoiding past answered questions & topic collision
        for topic in priority_topics:
            candidates = [
                q for q in QUESTION_BANK
                if q["question_id"] not in used_question_ids
                and q["question_id"] not in answered_in_history
                and q["difficulty"] == target_diff
                and q["topic"] not in used_topics
                and skill_matches_question(topic, q)
            ]
            if candidates:
                # Deterministic selection: sort by question_id
                candidates.sort(key=lambda x: x["question_id"])
                chosen_q = candidates[0]
                break

        # Pass 2: Try priority topics with target difficulty, relaxing topic uniqueness
        if not chosen_q:
            for topic in priority_topics:
                candidates = [
                    q for q in QUESTION_BANK
                    if q["question_id"] not in used_question_ids
                    and q["question_id"] not in answered_in_history
                    and q["difficulty"] == target_diff
                    and skill_matches_question(topic, q)
                ]
                if candidates:
                    candidates.sort(key=lambda x: x["question_id"])
                    chosen_q = candidates[0]
                    break

        # Pass 3: Try priority topics with ANY difficulty, avoiding past answered questions
        if not chosen_q:
            for topic in priority_topics:
                candidates = [
                    q for q in QUESTION_BANK
                    if q["question_id"] not in used_question_ids
                    and q["question_id"] not in answered_in_history
                    and skill_matches_question(topic, q)
                ]
                if candidates:
                    candidates.sort(key=lambda x: (x["difficulty"] != target_diff, x["question_id"]))
                    chosen_q = candidates[0]
                    break

        # Pass 4: Fallback to priority topics allowing previously answered questions (if bank exhausted)
        if not chosen_q:
            for topic in priority_topics:
                candidates = [
                    q for q in QUESTION_BANK
                    if q["question_id"] not in used_question_ids
                    and skill_matches_question(topic, q)
                ]
                if candidates:
                    candidates.sort(key=lambda x: (x["difficulty"] != target_diff, x["question_id"]))
                    chosen_q = candidates[0]
                    break

        # Pass 5: General fallback to any remaining question in bank
        if not chosen_q:
            remaining = [
                q for q in QUESTION_BANK
                if q["question_id"] not in used_question_ids
            ]
            if remaining:
                remaining.sort(
                    key=lambda x: (
                        x["question_id"] in answered_in_history,
                        x["topic"] in used_topics,
                        x["difficulty"] != target_diff,
                        x["question_id"],
                    )
                )
                chosen_q = remaining[0]

        if chosen_q:
            selected_questions.append(chosen_q)
            used_question_ids.add(chosen_q["question_id"])
            used_topics.add(chosen_q["topic"])

    # Determine interview focus label
    job_title = context.get("job_title")
    if job_title:
        interview_focus = job_title
    elif priority_topics:
        interview_focus = f"Technical Focus: {priority_topics[0]}"
    else:
        interview_focus = "General Technical Interview"

    session_topics = list(dict.fromkeys(q["topic"] for q in selected_questions))

    return selected_questions, interview_focus, session_topics


def adapt_next_question(
    db: Session,
    interview: Interview,
    current_question: InterviewQuestion,
    answer_score: float,
) -> Optional[InterviewQuestion]:
    """
    Dynamically adapt the difficulty of the NEXT question based on performance:
    - Score >= 7.5: Performed well -> Promote next question difficulty (Easy -> Medium, Medium -> Hard)
    - Score < 5.5: Performed poorly -> Demote next question difficulty (Hard -> Medium, Medium -> Easy)
    - Score 5.5 - 7.4: Maintained -> Keep scheduled difficulty
    """
    next_order = current_question.display_order + 1
    if next_order > interview.total_questions:
        return None

    next_q = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id,
            InterviewQuestion.display_order == next_order,
        )
        .first()
    )
    if not next_q:
        return None

    current_difficulty = next_q.difficulty
    target_difficulty = current_difficulty

    if answer_score >= 7.5:
        if current_difficulty == "Easy":
            target_difficulty = "Medium"
        elif current_difficulty == "Medium":
            target_difficulty = "Hard"
    elif answer_score < 5.5:
        if current_difficulty == "Hard":
            target_difficulty = "Medium"
        elif current_difficulty == "Medium":
            target_difficulty = "Easy"

    if target_difficulty == current_difficulty:
        return next_q

    # Find replacement question for next_q topic with target_difficulty
    current_interview_q_ids = {
        q.question_id for q in interview.questions if q.question_id
    }

    candidates = [
        q for q in QUESTION_BANK
        if q["topic"] == next_q.topic
        and q["difficulty"] == target_difficulty
        and q["question_id"] not in current_interview_q_ids
    ]

    # If no candidate in exact topic, look for candidate matching skills or core topics
    if not candidates:
        candidates = [
            q for q in QUESTION_BANK
            if q["difficulty"] == target_difficulty
            and q["question_id"] not in current_interview_q_ids
        ]

    if candidates:
        candidates.sort(key=lambda x: x["question_id"])
        replacement = candidates[0]

        next_q.question_id = replacement["question_id"]
        next_q.question_text = replacement["question_text"]
        next_q.topic = replacement["topic"]
        next_q.difficulty = replacement["difficulty"]
        db.flush()

    return next_q
