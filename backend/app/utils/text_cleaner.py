import re


def clean_resume_text(text: str) -> str:
    text = re.sub(r"\r", "", text)
    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()