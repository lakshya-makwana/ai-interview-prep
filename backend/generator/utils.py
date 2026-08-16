import re

CATEGORY_MAP = {
    "Arrays & Hashing": "arrays",
    "Two Pointers": "two_pointers",
    "Sliding Window": "sliding_window",
    "Stack": "stack",
    "Binary Search": "binary_search",
    "Linked List": "linked_list",
    "Trees": "trees",
    "Tries": "tries",
    "Heap / Priority Queue": "heap",
    "Backtracking": "backtracking",
    "Graphs": "graphs",
    "Advanced Graphs": "graphs",
    "1-D Dynamic Programming": "dynamic_programming",
    "2-D Dynamic Programming": "dynamic_programming",
    "Greedy": "greedy",
    "Intervals": "intervals",
    "Math & Geometry": "math",
    "Bit Manipulation": "bit_manipulation",
}


DIFFICULTY_MAP = {
    "Easy": "easy",
    "Medium": "medium",
    "Hard": "hard",
}


def slugify(title: str) -> str:
    """
    Contains Duplicate
    ->
    contains-duplicate
    """

    title = title.lower()

    title = re.sub(r"[^a-z0-9]+", "-", title)

    title = re.sub(r"-+", "-", title)

    return title.strip("-")


def snake_case(title: str) -> str:
    """
    Contains Duplicate
    ->
    contains_duplicate
    """

    return slugify(title).replace("-", "_")


def camel_case(title: str) -> str:
    """
    Contains Duplicate
    ->
    containsDuplicate
    """

    parts = snake_case(title).split("_")

    return parts[0] + "".join(
        word.capitalize()
        for word in parts[1:]
    )


def category_folder(pattern: str) -> str:
    return CATEGORY_MAP.get(
        pattern,
        slugify(pattern),
    )


def difficulty_value(difficulty: str) -> str:
    return DIFFICULTY_MAP.get(
        difficulty,
        difficulty.lower(),
    )