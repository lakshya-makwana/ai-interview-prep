import os
import subprocess
import tempfile

from app.schemas.code_execution import (
    CodeExecutionRequest,
    CodeExecutionResponse,
)


TIMEOUT_SECONDS = 5


def _normalize_language(language: str) -> str:
    language = language.lower()

    if language in ["python", "python3"]:
        return "python"

    if language in ["cpp", "c++"]:
        return "cpp"

    return language


def _run_command(
    command: list[str],
    stdin: str = "",
) -> subprocess.CompletedProcess:
    return subprocess.run(
        command,
        input=stdin,
        capture_output=True,
        text=True,
        timeout=TIMEOUT_SECONDS,
    )


def _build_response(
    result: subprocess.CompletedProcess,
    default_stderr: str = "",
) -> CodeExecutionResponse:
    stderr = result.stderr

    if result.returncode != 0 and not stderr:
        stderr = default_stderr

    return CodeExecutionResponse(
        stdout=result.stdout,
        stderr=stderr,
        exit_code=result.returncode,
    )


def _compile_source(
    command: list[str],
) -> CodeExecutionResponse | None:
    result = _run_command(command)

    if result.returncode != 0:
        return _build_response(
            result,
            "Compilation failed.",
        )

    return None


def execute_code(
    request: CodeExecutionRequest,
) -> CodeExecutionResponse:

    language = _normalize_language(request.language)

    if language not in ["python", "java", "cpp", "c"]:
        return CodeExecutionResponse(
            stdout="",
            stderr="Unsupported language.",
            exit_code=1,
        )

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            compile_command = None
            compile_response = None

            if language == "python":
                source_file = os.path.join(
                    temp_dir,
                    "solution.py",
                )
                run_command = ["python3", source_file]

            elif language == "java":
                source_file = os.path.join(
                    temp_dir,
                    "Solution.java",
                )
                run_command = [
                    "java",
                    "-cp",
                    temp_dir,
                    "Solution",
                ]

            elif language == "cpp":
                source_file = os.path.join(
                    temp_dir,
                    "solution.cpp",
                )
                executable_file = os.path.join(
                    temp_dir,
                    "solution",
                )
                compile_command = [
                    "g++",
                    source_file,
                    "-o",
                    executable_file,
                ]
                run_command = [executable_file]

            else:
                source_file = os.path.join(
                    temp_dir,
                    "solution.c",
                )
                executable_file = os.path.join(
                    temp_dir,
                    "solution",
                )
                compile_command = [
                    "gcc",
                    source_file,
                    "-o",
                    executable_file,
                ]
                run_command = [executable_file]

            with open(source_file, "w") as f:
                f.write(request.source_code)

            if language == "java":
                compile_command = [
                    "javac",
                    source_file,
                ]

            if compile_command is not None:
                compile_response = _compile_source(
                    compile_command,
                )

            if compile_response is not None:
                return compile_response

            result = _run_command(
                run_command,
                request.stdin,
            )

            return _build_response(
                result,
                "Runtime error.",
            )

    except subprocess.TimeoutExpired:

        return CodeExecutionResponse(
            stdout="",
            stderr="Execution timed out.",
            exit_code=1,
        )
