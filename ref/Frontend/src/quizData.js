const domainQuizData = {
    "Web Development": {
        "Advanced": [
            {
                "id": 1,
                "type": "mcq",
                "question": "In React's Fiber architecture, what is the primary purpose of the 'reconciliation' phase being split from the 'commit' phase?",
                "options": [
                    "To allow React to pause, resume, or restart work on different components to maintain 60fps",
                    "To ensure that the DOM is updated synchronously for all components",
                    "To reduce the memory footprint of the virtual DOM",
                    "To bypass the browser's event loop entirely"
                ],
                "answer": "To allow React to pause, resume, or restart work on different components to maintain 60fps"
            },
            {
                "id": 2,
                "type": "mcq",
                "question": "What will be the output of the following JavaScript code?\n\nconsole.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise'));\nconsole.log('end');",
                "options": [
                    "start, timeout, promise, end",
                    "start, end, timeout, promise",
                    "start, end, promise, timeout",
                    "start, promise, timeout, end"
                ],
                "answer": "start, end, promise, timeout"
            },
            {
                "id": 3,
                "type": "mcq",
                "question": "In Node.js, when should you use 'Worker Threads' instead of the 'Cluster' module?",
                "options": [
                    "When you want to share memory between threads for CPU-intensive tasks",
                    "When you want to scale the application to multiple CPU cores via process forking",
                    "When you need to handle more concurrent I/O operations",
                    "When you want to avoid the overhead of the V8 engine"
                ],
                "answer": "When you want to share memory between threads for CPU-intensive tasks"
            },
            {
                "id": 4,
                "type": "mcq",
                "question": "Which of the following database indexing strategies is most effective for a 'range query' (e.g., SELECT * WHERE age BETWEEN 20 AND 30)?",
                "options": [
                    "Hash Index",
                    "B-Tree Index",
                    "Full-Text Index",
                    "Bitmap Index"
                ],
                "answer": "B-Tree Index"
            },
            {
                "id": 5,
                "type": "mcq",
                "question": "In the context of JWT (JSON Web Tokens), why is it recommended to use 'short-lived access tokens' and 'long-lived refresh tokens'?",
                "options": [
                    "To minimize the window of opportunity for an attacker if an access token is stolen",
                    "To reduce the load on the authentication server",
                    "Because refresh tokens are more secure by design",
                    "To comply with HTTP/2 specifications"
                ],
                "answer": "To minimize the window of opportunity for an attacker if an access token is stolen"
            },
            {
                "id": 6,
                "type": "mcq",
                "question": "According to the CAP theorem, if a distributed system prioritizes 'Availability' and 'Partition Tolerance' (AP), what must it sacrifice during a network partition?",
                "options": [
                    "Consistency (clients may read stale data)",
                    "Latency (the system will slow down significantly)",
                    "Durability (data may be lost)",
                    "Security (encryption will be disabled)"
                ],
                "answer": "Consistency (clients may read stale data)"
            },
            {
                "id": 7,
                "type": "mcq",
                "question": "What is 'Layout Thrashing' in web performance, and how can it be avoided?",
                "options": [
                    "Repeatedly reading and writing to the DOM in a way that forces the browser to recalculate styles and layout multiple times",
                    "Using too many CSS animations at once",
                    "Downloading large CSS files over a slow connection",
                    "Using z-index incorrectly, causing elements to overlap"
                ],
                "answer": "Repeatedly reading and writing to the DOM"
            },
            {
                "id": 8,
                "type": "mcq",
                "question": "Which of the following implementations of a 'debounce' function is correct?",
                "options": [
                    "function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }",
                    "function debounce(fn, delay) { return (...args) => { setTimeout(() => fn(...args), delay); }; }",
                    "function debounce(fn, delay) { let timer; return (...args) => { if (!timer) fn(...args); timer = setTimeout(() => timer = null, delay); }; }",
                    "function debounce(fn, delay) { setInterval(() => fn(), delay); }"
                ],
                "answer": "function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }"
            },
            {
                "id": 9,
                "type": "mcq",
                "question": "In a SQL database, what does the 'I' in ACID stand for, and what does it guarantee?",
                "options": [
                    "Isolation: Concurrent execution of transactions leaves the database in the same state as if they were executed sequentially",
                    "Integrity: Ensures that all data follows defined constraints",
                    "Immutability: Data cannot be changed once written",
                    "Indexing: All tables must have a primary key"
                ],
                "answer": "Isolation: Concurrent execution of transactions leaves the database in the same state as if they were executed sequentially"
            },
            {
                "id": 10,
                "type": "mcq",
                "question": "When building a scalable React application, what is the main benefit of using 'Code Splitting' via React.lazy and Suspense?",
                "options": [
                    "It reduces the initial bundle size by loading components only when they are needed",
                    "It makes the code more readable by splitting large files",
                    "It automatically optimizes images and assets",
                    "It enables server-side rendering for all components"
                ],
                "answer": "It reduces the initial bundle size by loading components only when they are needed"
            }
        ]
    },
    "Programming": {
        "Advanced": [
            {
                "id": 1,
                "type": "mcq",
                "question": "What will be the output of the following Java code?\n\n```java\nList<String> list = new ArrayList<>(Arrays.asList(\"a\", \"b\", \"c\"));\nfor (String s : list) {\n    if (s.equals(\"b\")) list.remove(s);\n}\nSystem.out.println(list);\n```",
                "options": [
                    "[a, c]",
                    "ConcurrentModificationException",
                    "[a, b, c]",
                    "Runtime Error"
                ],
                "answer": "ConcurrentModificationException"
            },
            {
                "id": 2,
                "type": "mcq",
                "question": "In Java 8+, what is the result of the following Stream operation?\n\n```java\nStream.of(1, 2, 3, 4)\n      .filter(n -> { \n          System.out.print(n); \n          return n > 2; \n      })\n      .findFirst();\n```",
                "options": [
                    "123",
                    "1234",
                    "3",
                    "12"
                ],
                "answer": "123"
            },
            {
                "id": 3,
                "type": "mcq",
                "question": "Which of the following is true about the 'Volatile' keyword in Java?",
                "options": [
                    "It ensures atomicity for compound operations (e.g., i++)",
                    "It prevents instructions from being reordered by the compiler",
                    "It ensures that a variable is read from and written to the main memory, not the CPU cache",
                    "It makes a variable immutable"
                ],
                "answer": "It ensures that a variable is read from and written to the main memory, not the CPU cache"
            },
            {
                "id": 4,
                "type": "mcq",
                "question": "What is the output of this code regarding Java String interning?\n\n```java\nString s1 = new String(\"java\").intern();\nString s2 = \"java\";\nSystem.out.println(s1 == s2);\n```",
                "options": [
                    "true",
                    "false",
                    "Compilation Error",
                    "null"
                ],
                "answer": "true"
            },
            {
                "id": 5,
                "type": "mcq",
                "question": "In Java Generics, what is the difference between `List<? extends T>` and `List<? super T>`?",
                "options": [
                    "extends allows adding items; super only allows reading",
                    "extends is for Producer (Read-only); super is for Consumer (Write-only)",
                    "There is no functional difference",
                    "extends is for classes; super is for interfaces"
                ],
                "answer": "extends is for Producer (Read-only); super is for Consumer (Write-only)"
            }
        ]
    }
};