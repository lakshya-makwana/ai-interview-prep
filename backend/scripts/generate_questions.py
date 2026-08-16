import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

import json
import time

from dotenv import load_dotenv

from generator.question_generator import QuestionGenerator
from generator.writer import QuestionWriter

load_dotenv()

DATASET_PATH = Path("datasets/neetcode150.json")
CONCEPT_MAP_PATH = Path("datasets/concept_map.json")

OUTPUT_PATH = Path("generated_questions")
STATE_FILE = Path("scripts/generation_state.json")

BATCH_SIZE = 5
GENERATE_LIMIT = 150


def load_dataset():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_concepts():
    with open(CONCEPT_MAP_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_state():
    if not STATE_FILE.exists():
        return 0

    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f).get("last_completed", 0)


def save_state(index):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(
            {
                "last_completed": index,
            },
            f,
            indent=4,
        )


def main():

    OUTPUT_PATH.mkdir(
        parents=True,
        exist_ok=True,
    )

    dataset = [
        q
        for q in load_dataset()
        if q.get("neetcode150", False)
    ]

    concepts = load_concepts()

    for question in dataset:
        question["concept"] = concepts.get(
            question["problem"],
            question["pattern"],
        )

    generator = QuestionGenerator()
    writer = QuestionWriter(OUTPUT_PATH)

    start = load_state()

    end = min(
        start + GENERATE_LIMIT,
        len(dataset),
    )

    print(f"\nGenerating questions {start + 1} → {end}\n")

    index = start

    while index < end:

        batch = dataset[
            index:min(index + BATCH_SIZE, end)
        ]

        print(
            f"Batch {index + 1} - {index + len(batch)}"
        )

        success = False

        for attempt in range(3):

            try:

                generated = generator.generate_batch(
                    batch
                )

                for meta, content in zip(
                    batch,
                    generated,
                ):
                    writer.write(
                        meta,
                        content,
                    )

                index += len(batch)

                save_state(index)

                print(
                    f"✓ Saved {len(batch)} questions\n"
                )

                success = True

                break

            except Exception as e:

                message = str(e)

                if (
                    "RESOURCE_EXHAUSTED"
                    in message
                    or "quota"
                    in message.lower()
                ):
                    print(
                        "\nGemini quota exhausted."
                    )
                    print(
                        "Resume tomorrow.\n"
                    )
                    return

                print(
                    f"Attempt {attempt + 1}/3 failed"
                )

                print(e)

                time.sleep(5)

        if not success:
            print(
                f"Skipping batch starting at {index + 1}\n"
            )
            index += len(batch)

    print("Done.")


if __name__ == "__main__":
    main()