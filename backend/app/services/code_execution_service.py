import os
import subprocess
import tempfile
import uuid

from app.core.config import settings
from app.schemas.code_execution import (
    CodeExecutionRequest,
    CodeExecutionResponse,
)


CONTAINER_WORKDIR = "/workspace"


def _normalize_language(language: str) -> str:
    language = language.lower()

    if language in ["python", "python3"]:
        return "python"

    if language in ["cpp", "c++"]:
        return "cpp"

    return language


def _get_language_config(language: str) -> dict[str, str] | None:
    language_configs = {
        "python": {
            "image": settings.CODE_EXECUTION_PYTHON_IMAGE,
            "filename": "solution.py",
            "command": "python3 solution.py",
        },
        "java": {
            "image": settings.CODE_EXECUTION_JAVA_IMAGE,
            "filename": "Solution.java",
            "command": "javac Solution.java && java Solution",
        },
        "cpp": {
            "image": settings.CODE_EXECUTION_GCC_IMAGE,
            "filename": "solution.cpp",
            "command": "g++ solution.cpp -o solution && ./solution",
        },
        "c": {
            "image": settings.CODE_EXECUTION_GCC_IMAGE,
            "filename": "solution.c",
            "command": "gcc solution.c -o solution && ./solution",
        },
    }

    return language_configs.get(language)


def _build_docker_command(
    image: str,
    temp_dir: str,
    container_name: str,
    command: str,
) -> list[str]:
    return [
        "docker",
        "run",
        "--rm",
        "--name",
        container_name,
        "--network",
        "none",
        "--memory",
        settings.CODE_EXECUTION_MEMORY_LIMIT,
        "--memory-swap",
        settings.CODE_EXECUTION_MEMORY_LIMIT,
        "--cpus",
        settings.CODE_EXECUTION_CPU_LIMIT,
        "--read-only",
        "--tmpfs",
        "/tmp:rw,nosuid,nodev,size=64m",
        "-i",
        "-v",
        f"{temp_dir}:{CONTAINER_WORKDIR}:rw",
        "-w",
        CONTAINER_WORKDIR,
        image,
        "sh",
        "-c",
        command,
    ]


def _build_response(
    stdout: str,
    stderr: str,
    exit_code: int,
    default_stderr: str = "",
) -> CodeExecutionResponse:
    if exit_code != 0 and not stderr:
        stderr = default_stderr

    return CodeExecutionResponse(
        stdout=stdout,
        stderr=stderr,
        exit_code=exit_code,
    )


def _remove_container(container_name: str) -> None:
    subprocess.run(
        [
            "docker",
            "rm",
            "-f",
            container_name,
        ],
        capture_output=True,
        text=True,
    )


def _run_container(
    command: list[str],
    stdin: str,
    container_name: str,
) -> CodeExecutionResponse:
    process = subprocess.Popen(
        command,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    try:
        stdout, stderr = process.communicate(
            input=stdin,
            timeout=settings.CODE_EXECUTION_TIMEOUT_SECONDS,
        )

        return _build_response(
            stdout,
            stderr,
            process.returncode,
            "Container execution failed.",
        )

    except subprocess.TimeoutExpired:
        process.kill()
        process.communicate()
        _remove_container(container_name)

        return CodeExecutionResponse(
            stdout="",
            stderr="Execution timed out.",
            exit_code=1,
        )


def execute_code(
    request: CodeExecutionRequest,
) -> CodeExecutionResponse:

    language = _normalize_language(request.language)
    language_config = _get_language_config(language)

    if language_config is None:
        return CodeExecutionResponse(
            stdout="",
            stderr="Unsupported language.",
            exit_code=1,
        )

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            source_file = os.path.join(
                temp_dir,
                language_config["filename"],
            )

            with open(source_file, "w") as f:
                f.write(request.source_code)

            container_name = (
                f"code-execution-{uuid.uuid4().hex}"
            )
            docker_command = _build_docker_command(
                language_config["image"],
                temp_dir,
                container_name,
                language_config["command"],
            )

            return _run_container(
                docker_command,
                request.stdin,
                container_name,
            )

    except FileNotFoundError:
        return CodeExecutionResponse(
            stdout="",
            stderr="Docker is not installed or not available.",
            exit_code=1,
        )
