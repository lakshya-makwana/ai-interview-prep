from signature_metadata import QUESTION_METADATA


def python_signature(meta):
    params = ", ".join(p[0] for p in meta["parameters"])

    return (
        f"def {meta['function_name']}({params}):\n"
        "    pass\n"
    )


def java_type(t):
    return {
        "int": "int",
        "bool": "boolean",
        "list": "int[]",
        "string": "String",
    }.get(t, "Object")


def java_signature(meta):
    args = ", ".join(
        f"{java_type(t)} {name}"
        for name, t in meta["parameters"]
    )

    return (
        f"public {java_type(meta['return_type'])} "
        f"{meta['function_name']}({args}) {{\n"
        "\n"
        "}"
    )


def cpp_type(t):
    return {
        "int": "int",
        "bool": "bool",
        "list": "vector<int>&",
        "string": "string",
    }.get(t, "auto")


def cpp_signature(meta):
    args = ", ".join(
        f"{cpp_type(t)} {name}"
        for name, t in meta["parameters"]
    )

    return (
        f"{cpp_type(meta['return_type'])} "
        f"{meta['function_name']}({args}) {{\n"
        "\n"
        "}"
    )


def c_signature(meta):
    args = ", ".join(
        f"void* {name}"
        for name, _ in meta["parameters"]
    )

    return (
        f"void {meta['function_name']}({args}) {{\n"
        "\n"
        "}"
    )


QUESTION_SIGNATURES = {}

for slug, meta in QUESTION_METADATA.items():
    QUESTION_SIGNATURES[slug] = {
        "python": python_signature(meta),
        "java": java_signature(meta),
        "cpp": cpp_signature(meta),
        "c": c_signature(meta),
    }