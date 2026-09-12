from typing import Dict, List, Optional, Set
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.candidate_profile import CandidateProfile
from app.models.resume import Resume
from app.models.user import User
from app.repositories.job_repository import job_repository
from app.schemas.matching import MatchReport, MatchSkill

# Deterministic alias mapping for V1
ALIAS_GROUPS: List[Set[str]] = [
    {"javascript", "js"},
    {"postgres", "postgresql"},
    {"node", "node.js", "nodejs"},
    {"reactjs", "react"},
    {"expressjs", "express"},
]


def build_alias_map(groups: List[Set[str]]) -> Dict[str, Set[str]]:
    mapping: Dict[str, Set[str]] = {}
    for group in groups:
        for item in group:
            mapping[item] = group - {item}
    return mapping


ALIAS_MAP: Dict[str, Set[str]] = build_alias_map(ALIAS_GROUPS)


def normalize_skill(skill: str) -> str:
    if not skill:
        return ""
    return skill.strip().lower()


def get_aliases(skill_norm: str) -> Set[str]:
    return ALIAS_MAP.get(skill_norm, set())


def parse_skills_text(text: Optional[str]) -> List[str]:
    if not text:
        return []
    skills: List[str] = []
    for line in text.split("\n"):
        cleaned = line.strip()
        if cleaned.startswith(("-", "*", "•")):
            cleaned = cleaned.lstrip("-*• ").strip()
        if cleaned and cleaned not in skills:
            skills.append(cleaned)
    return skills


def determine_evidence(
    req_skill_norm: str,
    candidate_skills_norm: Set[str],
) -> tuple[str, float]:
    """
    Evidence rules:
    Strong = 1.0 (exact case-insensitive match)
    Partial = 0.5 (match through deterministic alias map)
    Missing = 0.0 (not found)
    """
    if req_skill_norm in candidate_skills_norm:
        return "Strong", 1.0

    aliases = get_aliases(req_skill_norm)
    if aliases & candidate_skills_norm:
        return "Partial", 0.5

    return "Missing", 0.0


def calculate_match_report(
    verified_candidate_skills: List[str],
    required_skills: List[str],
    preferred_skills: List[str],
) -> MatchReport:
    candidate_skills_norm: Set[str] = {
        normalize_skill(s) for s in verified_candidate_skills if normalize_skill(s)
    }

    comparison: List[MatchSkill] = []
    matched_skills: List[str] = []
    missing_required_skills: List[str] = []
    missing_preferred_skills: List[str] = []

    matched_required_count = 0
    matched_preferred_count = 0

    # Collect raw weights and evidence to compute total weight and score
    # Required = 2.0, Preferred = 1.0
    items: List[tuple[str, str, float, str, float]] = []
    total_weight = 0.0
    total_weighted_evidence = 0.0

    for skill in required_skills:
        weight = 2.0
        skill_norm = normalize_skill(skill)
        evidence_label, evidence_value = determine_evidence(
            skill_norm, candidate_skills_norm
        )
        items.append((skill, "Required", weight, evidence_label, evidence_value))
        total_weight += weight
        total_weighted_evidence += weight * evidence_value

        if evidence_label in ("Strong", "Partial"):
            matched_skills.append(skill)
            matched_required_count += 1
        else:
            missing_required_skills.append(skill)

    for skill in preferred_skills:
        weight = 1.0
        skill_norm = normalize_skill(skill)
        evidence_label, evidence_value = determine_evidence(
            skill_norm, candidate_skills_norm
        )
        items.append((skill, "Preferred", weight, evidence_label, evidence_value))
        total_weight += weight
        total_weighted_evidence += weight * evidence_value

        if evidence_label in ("Strong", "Partial"):
            matched_skills.append(skill)
            matched_preferred_count += 1
        else:
            missing_preferred_skills.append(skill)

    # Match score = Σ(weight × evidence) / Σ(weight) × 100
    if total_weight > 0:
        match_score = round((total_weighted_evidence / total_weight) * 100, 1)
    else:
        match_score = 0.0

    # Calculate individual contributions
    for skill, req_type, weight, evidence_label, evidence_value in items:
        if total_weight > 0:
            contribution = round(
                (weight * evidence_value / total_weight) * 100, 1
            )
        else:
            contribution = 0.0

        comparison.append(
            MatchSkill(
                skill=skill,
                requirement_type=req_type,
                candidate_evidence=evidence_label,
                weight=weight,
                contribution=contribution,
            )
        )

    return MatchReport(
        match_score=match_score,
        matched_skills=matched_skills,
        missing_required_skills=missing_required_skills,
        missing_preferred_skills=missing_preferred_skills,
        comparison=comparison,
        total_required_skills=len(required_skills),
        total_preferred_skills=len(preferred_skills),
        matched_required_count=matched_required_count,
        matched_preferred_count=matched_preferred_count,
    )


def generate_matching_report(db: Session, current_user: User) -> MatchReport:
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )
    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile is missing. Please upload a resume first.",
        )

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.resume_id == resume.id)
        .first()
    )
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile is missing. Please verify your skills first.",
        )

    job = job_repository.get_by_user_id(db, current_user.id)
    if job is None or job.requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description has not been analyzed. Please analyze a job description first.",
        )

    # Use candidate verified skills, fall back to extracted skills if verified is not yet set
    raw_skills = (
        profile.verified_skills
        if profile.verified_skills
        else profile.skills
    )
    candidate_skills = parse_skills_text(raw_skills)

    req = job.requirement
    required_skills = parse_skills_text(req.required_skills)
    preferred_skills = parse_skills_text(req.preferred_skills)

    return calculate_match_report(
        verified_candidate_skills=candidate_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills,
    )
