import re
from pathlib import Path

from app.database.database import SessionLocal
from app.models.coding_question import CodingQuestion


COMMON_PARAMETERS = {
    "array": ["nums"],
    "arrays": ["nums"],
    "string": ["s"],
    "strings": ["s"],
    "matrix": ["matrix"],
    "grid": ["grid"],
    "graph": ["graph"],
    "tree": ["root"],
    "linked_list": ["head"],
}


def snake_case(text: str):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def camel_case(name: str):
    words = name.split("_")
    return words[0] + "".join(word.capitalize() for word in words[1:])


def pascal_case(name: str):
    return "".join(word.capitalize() for word in name.split("_"))


def guess_parameters(question):
    category = question.category.lower()

    if category in COMMON_PARAMETERS:
        return COMMON_PARAMETERS[category]

    return ["input"]


def python_signature(name, params):
    return (
        f"def {name}({', '.join(params)}):\n"
        "    pass\n"
    )


def java_signature(name, params):
    args = ", ".join(
        f"Object {p}" for p in params
    )

    return (
        f"public static Object {camel_case(name)}({args}) {{\n"
        "    return null;\n"
        "}"
    )


def cpp_signature(name, params):
    args = ", ".join(
        f"auto {p}" for p in params
    )

    return (
        f"auto {camel_case(name)}({args}) {{\n"
        "\n"
        "}"
    )


def c_signature(name, params):
    args = ", ".join(
        f"void* {p}" for p in params
    )

    return (
        f"void {snake_case(name)}({args}) {{\n"
        "\n"
        "}"
    )


def main():
    db = SessionLocal()

    questions = db.query(CodingQuestion).all()

    signatures = {}

    for q in questions:

        fn = snake_case(q.slug)

        params = guess_parameters(q)

        signatures[q.slug] = {
            "python": python_signature(fn, params),
            "java": java_signature(fn, params),
            "cpp": cpp_signature(fn, params),
            "c": c_signature(fn, params),
        }

    output = Path(__file__).parent / "function_signatures.py"

    with open(output, "w") as f:
        f.write("QUESTION_SIGNATURES = ")
        f.write(repr(signatures))

    print(f"Generated {len(signatures)} signatures")


if __name__ == "__main__":
    main()