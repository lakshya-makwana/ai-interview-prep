"""
Curated technical question bank for Adaptive Interview Engine.
Contains technical questions across OOP, DBMS, OS, Computer Networks, Backend,
Spring Boot, Kafka, SQL/Indexing, REST APIs, System Design, and DSA Fundamentals.
"""

from typing import Any, Dict, List

QUESTION_BANK: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # OOP (Object-Oriented Programming & Java / C++ / Python)
    # -------------------------------------------------------------
    {
        "question_id": "OOP_01",
        "topic": "OOP",
        "difficulty": "Easy",
        "question_text": "What are the four core pillars of Object-Oriented Programming, and how does abstraction differ from encapsulation?",
        "skills": ["OOP", "Java", "Python", "C++", "Object-Oriented Programming"],
    },
    {
        "question_id": "OOP_02",
        "topic": "OOP",
        "difficulty": "Easy",
        "question_text": "Explain the difference between method overloading and method overriding. How does the runtime/compiler distinguish between them?",
        "skills": ["OOP", "Java", "C++", "Polymorphism"],
    },
    {
        "question_id": "OOP_03",
        "topic": "OOP",
        "difficulty": "Medium",
        "question_text": "What is polymorphism in OOP, and how is runtime polymorphism implemented through dynamic method dispatch or vtables?",
        "skills": ["OOP", "Java", "C++", "Object-Oriented Programming"],
    },
    {
        "question_id": "OOP_04",
        "topic": "OOP",
        "difficulty": "Medium",
        "question_text": "What is the diamond problem in multiple inheritance, and how do modern programming languages resolve it (e.g., C3 linearization in Python or virtual inheritance in C++)?",
        "skills": ["OOP", "Python", "C++", "Architecture"],
    },
    {
        "question_id": "OOP_05",
        "topic": "OOP",
        "difficulty": "Medium",
        "question_text": "Explain the SOLID principles in software design. Focus on the Single Responsibility Principle and Open/Closed Principle with practical examples.",
        "skills": ["OOP", "SOLID", "Software Architecture", "Java"],
    },
    {
        "question_id": "OOP_06",
        "topic": "OOP",
        "difficulty": "Hard",
        "question_text": "How do you design a thread-safe Singleton pattern without performance bottlenecks in concurrent environments (e.g., Double-Checked Locking with volatile memory semantics)?",
        "skills": ["OOP", "Java", "Concurrency", "Design Patterns"],
    },

    # -------------------------------------------------------------
    # DBMS (Database Management Systems & SQL)
    # -------------------------------------------------------------
    {
        "question_id": "DBMS_01",
        "topic": "DBMS",
        "difficulty": "Easy",
        "question_text": "What are the ACID properties of a database transaction, and why is each property essential for maintaining data integrity?",
        "skills": ["DBMS", "SQL", "Databases", "PostgreSQL", "MySQL"],
    },
    {
        "question_id": "DBMS_02",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question_text": "Explain the difference between a clustered index and a non-clustered index in relational databases such as PostgreSQL or MySQL.",
        "skills": ["DBMS", "SQL", "Database Indexing", "PostgreSQL", "MySQL", "Indexing"],
    },
    {
        "question_id": "DBMS_03",
        "topic": "DBMS",
        "difficulty": "Easy",
        "question_text": "Compare relational (SQL) and non-relational (NoSQL) databases. In what architecture scenarios would you choose one over the other?",
        "skills": ["DBMS", "SQL", "NoSQL", "MongoDB", "Databases"],
    },
    {
        "question_id": "DBMS_04",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question_text": "What is database normalization? Explain the rules for 1NF, 2NF, and 3NF and why denormalization might sometimes be favored in production.",
        "skills": ["DBMS", "SQL", "Database Design", "PostgreSQL"],
    },
    {
        "question_id": "DBMS_05",
        "topic": "DBMS",
        "difficulty": "Hard",
        "question_text": "Describe transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the concurrency anomalies they prevent (dirty reads, non-repeatable reads, phantom reads).",
        "skills": ["DBMS", "SQL", "Concurrency", "Transactions", "PostgreSQL"],
    },
    {
        "question_id": "DBMS_06",
        "topic": "DBMS",
        "difficulty": "Hard",
        "question_text": "How does B-Tree vs LSM-Tree (Log-Structured Merge-Tree) indexing differ in read/write throughput trade-offs, and why are LSM-trees prevalent in write-heavy storage engines?",
        "skills": ["DBMS", "Database Indexing", "Storage Engines", "SQL", "Indexing"],
    },

    # -------------------------------------------------------------
    # Operating Systems
    # -------------------------------------------------------------
    {
        "question_id": "OS_01",
        "topic": "Operating Systems",
        "difficulty": "Easy",
        "question_text": "What is the fundamental difference between a process and a thread, and how do their memory layouts and context switching costs differ?",
        "skills": ["Operating Systems", "OS", "Concurrency", "Multithreading", "Linux"],
    },
    {
        "question_id": "OS_02",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question_text": "What is a deadlock, and what are the four Coffman conditions that must hold simultaneously for a deadlock to occur in an operating system?",
        "skills": ["Operating Systems", "OS", "Concurrency", "Synchronization"],
    },
    {
        "question_id": "OS_03",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question_text": "How does virtual memory work, and how does the OS use paging and the Translation Lookaside Buffer (TLB) to map virtual addresses to physical RAM?",
        "skills": ["Operating Systems", "OS", "Memory Management", "Linux"],
    },
    {
        "question_id": "OS_04",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question_text": "Explain the difference between preemptive and non-preemptive CPU scheduling. Mention two algorithms for each category.",
        "skills": ["Operating Systems", "OS", "CPU Scheduling"],
    },
    {
        "question_id": "OS_05",
        "topic": "Operating Systems",
        "difficulty": "Hard",
        "question_text": "What is thrashing in operating systems, what causes it, and how does the kernel mitigate it using working set models or page replacement algorithms?",
        "skills": ["Operating Systems", "OS", "Memory Management", "Kernel"],
    },
    {
        "question_id": "OS_06",
        "topic": "Operating Systems",
        "difficulty": "Hard",
        "question_text": "How does inter-process communication (IPC) work via shared memory, message queues, and Unix domain sockets, and what synchronization primitives prevent race conditions?",
        "skills": ["Operating Systems", "OS", "IPC", "Concurrency", "Linux"],
    },

    # -------------------------------------------------------------
    # Computer Networks
    # -------------------------------------------------------------
    {
        "question_id": "NET_01",
        "topic": "Computer Networks",
        "difficulty": "Easy",
        "question_text": "What are the primary differences between TCP and UDP, and what makes UDP more suitable for live streaming or gaming applications?",
        "skills": ["Computer Networks", "Networking", "TCP", "UDP"],
    },
    {
        "question_id": "NET_02",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question_text": "Describe the TCP three-way handshake and the four-way termination sequence. Why is the SYN-ACK handshake necessary before exchanging data?",
        "skills": ["Computer Networks", "Networking", "TCP", "Protocols"],
    },
    {
        "question_id": "NET_03",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question_text": "Walk through what happens across the network stack when a user types a URL (e.g., https://example.com) in their browser and presses Enter.",
        "skills": ["Computer Networks", "Networking", "DNS", "HTTP", "Web Architecture"],
    },
    {
        "question_id": "NET_04",
        "topic": "Computer Networks",
        "difficulty": "Easy",
        "question_text": "What is the difference between HTTP and HTTPS, and how does TLS handshake establish symmetric encryption using public key cryptography?",
        "skills": ["Computer Networks", "Networking", "Security", "HTTPS", "TLS"],
    },
    {
        "question_id": "NET_05",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question_text": "How does DNS resolution work? Trace the path from the local DNS cache through recursive resolvers, root nameservers, TLD servers, and authoritative nameservers.",
        "skills": ["Computer Networks", "Networking", "DNS"],
    },
    {
        "question_id": "NET_06",
        "topic": "Computer Networks",
        "difficulty": "Hard",
        "question_text": "Explain TCP congestion control mechanisms (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery) and how TCP Tahoe differs from TCP Reno.",
        "skills": ["Computer Networks", "Networking", "TCP", "Performance"],
    },

    # -------------------------------------------------------------
    # Backend & REST APIs
    # -------------------------------------------------------------
    {
        "question_id": "BACK_01",
        "topic": "Backend",
        "difficulty": "Easy",
        "question_text": "What defines a RESTful API? Explain the concept of idempotency and classify standard HTTP methods (GET, POST, PUT, DELETE, PATCH) as idempotent or non-idempotent.",
        "skills": ["Backend", "REST APIs", "API Design", "HTTP", "REST"],
    },
    {
        "question_id": "BACK_02",
        "topic": "Backend",
        "difficulty": "Medium",
        "question_text": "What is database connection pooling, and why is it critical for handling high concurrent traffic in backend web applications?",
        "skills": ["Backend", "DBMS", "Database Connection Pooling", "Performance", "SQL"],
    },
    {
        "question_id": "BACK_03",
        "topic": "Backend",
        "difficulty": "Easy",
        "question_text": "What is the difference between vertical scaling and horizontal scaling? What architectural challenges (e.g., statefulness, data consistency) arise when scaling horizontally?",
        "skills": ["Backend", "Scalability", "System Design", "Cloud"],
    },
    {
        "question_id": "BACK_04",
        "topic": "Backend",
        "difficulty": "Medium",
        "question_text": "How does stateless JWT (JSON Web Token) authentication work? What are its advantages over session-based auth, and how can token revocation or blacklisting be handled?",
        "skills": ["Backend", "Authentication", "Security", "JWT"],
    },
    {
        "question_id": "BACK_05",
        "topic": "Backend",
        "difficulty": "Medium",
        "question_text": "Explain the most common caching strategies (Cache-Aside, Write-Through, Write-Back). What is cache invalidation and why is it notoriously difficult?",
        "skills": ["Backend", "Caching", "Redis", "System Design"],
    },
    {
        "question_id": "BACK_06",
        "topic": "Backend",
        "difficulty": "Hard",
        "question_text": "How would you design a distributed rate limiter that handles tens of thousands of requests per second across multiple API gateway nodes without single-point bottlenecks?",
        "skills": ["Backend", "System Design", "Distributed Systems", "Redis", "Rate Limiting"],
    },

    # -------------------------------------------------------------
    # Spring Boot & Microservices
    # -------------------------------------------------------------
    {
        "question_id": "SPRING_01",
        "topic": "Spring Boot",
        "difficulty": "Easy",
        "question_text": "What is Spring Boot's Dependency Injection (Inversion of Control) and how do annotations like @Component, @Service, and @Autowired work?",
        "skills": ["Spring Boot", "Java", "Backend", "Dependency Injection"],
    },
    {
        "question_id": "SPRING_02",
        "topic": "Spring Boot",
        "difficulty": "Medium",
        "question_text": "Explain the Spring Bean lifecycle and scope (Singleton, Prototype, Request, Session). How does Spring manage bean creation and destruction?",
        "skills": ["Spring Boot", "Java", "Backend"],
    },
    {
        "question_id": "SPRING_03",
        "topic": "Spring Boot",
        "difficulty": "Medium",
        "question_text": "How does Spring Boot auto-configuration (@EnableAutoConfiguration) work under the hood using condition annotations like @ConditionalOnClass?",
        "skills": ["Spring Boot", "Java", "Microservices", "Backend"],
    },
    {
        "question_id": "SPRING_04",
        "topic": "Spring Boot",
        "difficulty": "Hard",
        "question_text": "How do you handle distributed transactions across microservices in Spring Boot? Compare the 2-Phase Commit (2PC) pattern with the Saga pattern (Choreography vs Orchestration).",
        "skills": ["Spring Boot", "Microservices", "Distributed Systems", "Saga Pattern"],
    },

    # -------------------------------------------------------------
    # Kafka & Message Queues
    # -------------------------------------------------------------
    {
        "question_id": "KAFKA_01",
        "topic": "Kafka",
        "difficulty": "Easy",
        "question_text": "What is Apache Kafka, and how does its publish-subscribe model differ from traditional message brokers like RabbitMQ or ActiveMQ?",
        "skills": ["Kafka", "Message Queue", "Distributed Systems", "Backend"],
    },
    {
        "question_id": "KAFKA_02",
        "topic": "Kafka",
        "difficulty": "Medium",
        "question_text": "Explain the role of Kafka topics, partitions, and consumer groups. How does partition assignment ensure both horizontal scaling and message ordering?",
        "skills": ["Kafka", "Distributed Systems", "Backend", "Message Queue"],
    },
    {
        "question_id": "KAFKA_03",
        "topic": "Kafka",
        "difficulty": "Hard",
        "question_text": "How does Kafka achieve exactly-once processing (EOS) semantics across producer and consumer streams? Explain transactional producers and idempotent delivery.",
        "skills": ["Kafka", "Distributed Systems", "Event-Driven Architecture", "Backend"],
    },

    # -------------------------------------------------------------
    # DSA Fundamentals
    # -------------------------------------------------------------
    {
        "question_id": "DSA_01",
        "topic": "DSA Fundamentals",
        "difficulty": "Easy",
        "question_text": "Compare an Array and a Singly Linked List in terms of memory layout, cache locality, and Big-O time complexity for lookup, insertion at head, and insertion at arbitrary index.",
        "skills": ["DSA Fundamentals", "Data Structures", "Algorithms", "DSA"],
    },
    {
        "question_id": "DSA_02",
        "topic": "DSA Fundamentals",
        "difficulty": "Medium",
        "question_text": "How does a Hash Map achieve average O(1) time complexity for insertions and lookups, and how do separate chaining vs open addressing handle hash collisions?",
        "skills": ["DSA Fundamentals", "Data Structures", "Hash Maps", "DSA"],
    },
    {
        "question_id": "DSA_03",
        "topic": "DSA Fundamentals",
        "difficulty": "Medium",
        "question_text": "Contrast Depth-First Search (DFS) and Breadth-First Search (BFS) on graphs. Which data structure does each use, and when would you prefer BFS over DFS?",
        "skills": ["DSA Fundamentals", "Algorithms", "Graphs", "DSA"],
    },
    {
        "question_id": "DSA_04",
        "topic": "DSA Fundamentals",
        "difficulty": "Easy",
        "question_text": "Explain the difference between a Stack (LIFO) and a Queue (FIFO). How can you implement a FIFO Queue using two LIFO Stacks with amortized O(1) operations?",
        "skills": ["DSA Fundamentals", "Data Structures", "DSA"],
    },
    {
        "question_id": "DSA_05",
        "topic": "DSA Fundamentals",
        "difficulty": "Medium",
        "question_text": "Compare QuickSort and MergeSort in terms of best, average, and worst-case time complexities, auxiliary space complexity, and stability.",
        "skills": ["DSA Fundamentals", "Algorithms", "Sorting", "DSA"],
    },
    {
        "question_id": "DSA_06",
        "topic": "DSA Fundamentals",
        "difficulty": "Hard",
        "question_text": "Explain how Dijkstra's algorithm and the Bellman-Ford algorithm find single-source shortest paths on weighted graphs. Why can Bellman-Ford handle negative weight edges while Dijkstra cannot?",
        "skills": ["DSA Fundamentals", "Algorithms", "Graphs", "DSA"],
    },
]
