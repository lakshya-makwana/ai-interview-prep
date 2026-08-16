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
    STRINGS = "strings"
    HASHING = "hashing"
    TWO_POINTERS = "two_pointers"
    SLIDING_WINDOW = "sliding_window"
    STACK = "stack"
    QUEUE = "queue"
    LINKED_LIST = "linked_list"
    TREES = "trees"
    BST = "binary_search_tree"
    HEAP = "heap"
    GRAPHS = "graphs"
    DFS = "dfs"
    BFS = "bfs"
    GREEDY = "greedy"
    DYNAMIC_PROGRAMMING = "dynamic_programming"
    BACKTRACKING = "backtracking"
    BIT_MANIPULATION = "bit_manipulation"
    MATH = "math"


class SubmissionStatus(str, Enum):
    ACCEPTED = "accepted"
    WRONG_ANSWER = "wrong_answer"
    COMPILATION_ERROR = "compilation_error"
    RUNTIME_ERROR = "runtime_error"
    TIME_LIMIT_EXCEEDED = "time_limit_exceeded"