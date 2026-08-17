from enum import Enum


class ProgrammingLanguage(str, Enum):
    PYTHON = "python"
    JAVA = "java"
    C = "c"
    CPP = "cpp"


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionCategory(str, Enum):
    ARRAYS = "arrays"
    TWO_POINTERS = "two_pointers"
    SLIDING_WINDOW = "sliding_window"
    STACK = "stack"
    BINARY_SEARCH = "binary_search"
    LINKED_LIST = "linked_list"
    TREES = "trees"
    TRIES = "tries"
    HEAP = "heap"
    BACKTRACKING = "backtracking"
    GRAPHS = "graphs"
    DYNAMIC_PROGRAMMING = "dynamic_programming"
    GREEDY = "greedy"
    INTERVALS = "intervals"
    BIT_MANIPULATION = "bit_manipulation"
    MATH = "math"


class SubmissionStatus(str, Enum):
    ACCEPTED = "accepted"
    WRONG_ANSWER = "wrong_answer"
    COMPILATION_ERROR = "compilation_error"
    RUNTIME_ERROR = "runtime_error"
    TIME_LIMIT_EXCEEDED = "time_limit_exceeded"