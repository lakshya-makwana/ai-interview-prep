"""
Curated technical question bank for Phase 3 text interviews.
Contains 30 foundational questions covering OOP, DBMS, OS, Computer Networks, Backend, and DSA Fundamentals.
"""

from typing import Dict, List

QUESTION_BANK: List[Dict[str, str]] = [
    # -------------------------------------------------------------
    # OOP (Object-Oriented Programming)
    # -------------------------------------------------------------
    {
        "question_id": "OOP_01",
        "topic": "OOP",
        "difficulty": "Easy",
        "question_text": "What are the four core pillars of Object-Oriented Programming, and how does abstraction differ from encapsulation?",
    },
    {
        "question_id": "OOP_02",
        "topic": "OOP",
        "difficulty": "Easy",
        "question_text": "Explain the difference between method overloading and method overriding. How does the runtime/compiler distinguish between them?",
    },
    {
        "question_id": "OOP_03",
        "topic": "OOP",
        "difficulty": "Medium",
        "question_text": "What is polymorphism in OOP, and how is runtime polymorphism implemented through dynamic method dispatch or vtables?",
    },
    {
        "question_id": "OOP_04",
        "topic": "OOP",
        "difficulty": "Medium",
        "question_text": "What is the diamond problem in multiple inheritance, and how do modern programming languages resolve it (e.g., C3 linearization in Python or virtual inheritance in C++)?",
    },
    {
        "question_id": "OOP_05",
        "topic": "OOP",
        "difficulty": "Medium",
        "question_text": "Explain the SOLID principles in software design. Focus on the Single Responsibility Principle and Open/Closed Principle with practical examples.",
    },

    # -------------------------------------------------------------
    # DBMS (Database Management Systems)
    # -------------------------------------------------------------
    {
        "question_id": "DBMS_01",
        "topic": "DBMS",
        "difficulty": "Easy",
        "question_text": "What are the ACID properties of a database transaction, and why is each property essential for maintaining data integrity?",
    },
    {
        "question_id": "DBMS_02",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question_text": "Explain the difference between a clustered index and a non-clustered index in relational databases such as PostgreSQL or MySQL.",
    },
    {
        "question_id": "DBMS_03",
        "topic": "DBMS",
        "difficulty": "Easy",
        "question_text": "Compare relational (SQL) and non-relational (NoSQL) databases. In what architecture scenarios would you choose one over the other?",
    },
    {
        "question_id": "DBMS_04",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question_text": "What is database normalization? Explain the rules for 1NF, 2NF, and 3NF and why denormalization might sometimes be favored in production.",
    },
    {
        "question_id": "DBMS_05",
        "topic": "DBMS",
        "difficulty": "Hard",
        "question_text": "Describe transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the concurrency anomalies they prevent (dirty reads, non-repeatable reads, phantom reads).",
    },

    # -------------------------------------------------------------
    # Operating Systems
    # -------------------------------------------------------------
    {
        "question_id": "OS_01",
        "topic": "Operating Systems",
        "difficulty": "Easy",
        "question_text": "What is the fundamental difference between a process and a thread, and how do their memory layouts and context switching costs differ?",
    },
    {
        "question_id": "OS_02",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question_text": "What is a deadlock, and what are the four Coffman conditions that must hold simultaneously for a deadlock to occur in an operating system?",
    },
    {
        "question_id": "OS_03",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question_text": "How does virtual memory work, and how does the OS use paging and the Translation Lookaside Buffer (TLB) to map virtual addresses to physical RAM?",
    },
    {
        "question_id": "OS_04",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question_text": "Explain the difference between preemptive and non-preemptive CPU scheduling. Mention two algorithms for each category.",
    },
    {
        "question_id": "OS_05",
        "topic": "Operating Systems",
        "difficulty": "Hard",
        "question_text": "What is thrashing in operating systems, what causes it, and how does the kernel mitigate it using working set models or page replacement algorithms?",
    },

    # -------------------------------------------------------------
    # Computer Networks
    # -------------------------------------------------------------
    {
        "question_id": "NET_01",
        "topic": "Computer Networks",
        "difficulty": "Easy",
        "question_text": "What are the primary differences between TCP and UDP, and what makes UDP more suitable for live streaming or gaming applications?",
    },
    {
        "question_id": "NET_02",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question_text": "Describe the TCP three-way handshake and the four-way termination sequence. Why is the SYN-ACK handshake necessary before exchanging data?",
    },
    {
        "question_id": "NET_03",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question_text": "Walk through what happens across the network stack when a user types a URL (e.g., https://example.com) in their browser and presses Enter.",
    },
    {
        "question_id": "NET_04",
        "topic": "Computer Networks",
        "difficulty": "Easy",
        "question_text": "What is the difference between HTTP and HTTPS, and how does TLS handshake establish symmetric encryption using public key cryptography?",
    },
    {
        "question_id": "NET_05",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question_text": "How does DNS resolution work? Trace the path from the local DNS cache through recursive resolvers, root nameservers, TLD servers, and authoritative nameservers.",
    },

    # -------------------------------------------------------------
    # Backend Architecture
    # -------------------------------------------------------------
    {
        "question_id": "BACK_01",
        "topic": "Backend",
        "difficulty": "Easy",
        "question_text": "What defines a RESTful API? Explain the concept of idempotency and classify standard HTTP methods (GET, POST, PUT, DELETE, PATCH) as idempotent or non-idempotent.",
    },
    {
        "question_id": "BACK_02",
        "topic": "Backend",
        "difficulty": "Medium",
        "question_text": "What is database connection pooling, and why is it critical for handling high concurrent traffic in backend web applications?",
    },
    {
        "question_id": "BACK_03",
        "topic": "Backend",
        "difficulty": "Easy",
        "question_text": "What is the difference between vertical scaling and horizontal scaling? What architectural challenges (e.g., statefulness, data consistency) arise when scaling horizontally?",
    },
    {
        "question_id": "BACK_04",
        "topic": "Backend",
        "difficulty": "Medium",
        "question_text": "How does stateless JWT (JSON Web Token) authentication work? What are its advantages over session-based auth, and how can token revocation or blacklisting be handled?",
    },
    {
        "question_id": "BACK_05",
        "topic": "Backend",
        "difficulty": "Medium",
        "question_text": "Explain the most common caching strategies (Cache-Aside, Write-Through, Write-Back). What is cache invalidation and why is it notoriously difficult?",
    },

    # -------------------------------------------------------------
    # DSA Fundamentals
    # -------------------------------------------------------------
    {
        "question_id": "DSA_01",
        "topic": "DSA Fundamentals",
        "difficulty": "Easy",
        "question_text": "Compare an Array and a Singly Linked List in terms of memory layout, cache locality, and Big-O time complexity for lookup, insertion at head, and insertion at arbitrary index.",
    },
    {
        "question_id": "DSA_02",
        "topic": "DSA Fundamentals",
        "difficulty": "Medium",
        "question_text": "How does a Hash Map achieve average O(1) time complexity for insertions and lookups, and how do separate chaining vs open addressing handle hash collisions?",
    },
    {
        "question_id": "DSA_03",
        "topic": "DSA Fundamentals",
        "difficulty": "Medium",
        "question_text": "Contrast Depth-First Search (DFS) and Breadth-First Search (BFS) on graphs. Which data structure does each use, and when would you prefer BFS over DFS?",
    },
    {
        "question_id": "DSA_04",
        "topic": "DSA Fundamentals",
        "difficulty": "Easy",
        "question_text": "Explain the difference between a Stack (LIFO) and a Queue (FIFO). How can you implement a FIFO Queue using two LIFO Stacks with amortized O(1) operations?",
    },
    {
        "question_id": "DSA_05",
        "topic": "DSA Fundamentals",
        "difficulty": "Medium",
        "question_text": "Compare QuickSort and MergeSort in terms of best, average, and worst-case time complexities, auxiliary space complexity, and stability.",
    },
]
