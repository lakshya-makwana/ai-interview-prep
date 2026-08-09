import pymupdf


def extract_text_from_pdf(file_path: str) -> str:
    document = pymupdf.open(file_path)

    text = []

    for page in document:
        text.append(page.get_text("text"))

    document.close()

    return "\n".join(text)