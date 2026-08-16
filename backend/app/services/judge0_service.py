from abc import ABC
from abc import abstractmethod


class Judge0Service(ABC):

    @abstractmethod
    async def run_code(
        self,
        *,
        source_code: str,
        language: str,
        stdin: str,
    ) -> dict:
        """
        Execute code against Judge0.
        """
        raise NotImplementedError