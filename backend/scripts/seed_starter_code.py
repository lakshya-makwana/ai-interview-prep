from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.database.database import SessionLocal
from app.models.coding_question import CodingQuestion
from app.models.coding_starter_code import CodingStarterCode

from scripts.generate_signatures import QUESTION_SIGNATURES

DEFAULT_TEMPLATES = {
    "python": """def solve():
    pass

if __name__ == "__main__":
    solve()
""",
    "java": """public class Solution {

}
""",
    "cpp": """#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}
""",
    "c": """#include <stdio.h>

int main() {

    return 0;
}
""",
}


def get_starter_code(question, language):
    slug = question.slug

    if slug in QUESTION_SIGNATURES:
        return QUESTION_SIGNATURES[slug].get(
            language,
            DEFAULT_TEMPLATES[language],
        )

    return DEFAULT_TEMPLATES[language]


def seed_starter_code():
    db = SessionLocal()

    try:
        questions = (
            db.query(CodingQuestion)
            .order_by(CodingQuestion.id)
            .all()
        )

        created = 0
        updated = 0

        for question in questions:

            for language in DEFAULT_TEMPLATES:

                starter_code = get_starter_code(
                    question,
                    language,
                )

                existing = (
                    db.query(CodingStarterCode)
                    .filter(
                        CodingStarterCode.question_id
                        == question.id,
                        CodingStarterCode.language
                        == language,
                    )
                    .first()
                )

                if existing:

                    existing.starter_code = starter_code

                    updated += 1

                    continue

                db.add(
                    CodingStarterCode(
                        question_id=question.id,
                        language=language,
                        starter_code=starter_code,
                        reference_solution=None,
                    )
                )

                created += 1

        db.commit()

        print()
        print("=" * 45)
        print("Starter Code Seeder")
        print("=" * 45)
        print(f"Questions : {len(questions)}")
        print(f"Created   : {created}")
        print(f"Updated   : {updated}")
        print("=" * 45)
        print()

    except Exception as e:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_starter_code()