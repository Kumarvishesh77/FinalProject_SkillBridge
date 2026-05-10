const skillRegistry = [
    // --- PROGRAMMING LANGUAGES & PARADIGMS ---
    { name: "Java", domain: "Programming", aliases: ["J2EE", "JDK", "Spring Boot", "Hibernate", "JVM"] },
    { name: "Python", domain: "Programming", aliases: ["Django", "Flask", "PyTorch", "Pandas", "FastAPI", "Numpy"] },
    { name: "JavaScript", domain: "Programming", aliases: ["Node.js", "ES6", "TypeScript", "Next.js", "React"] },
    { name: "TypeScript", domain: "Programming", aliases: ["TS", "Static Typing", "Angular", "NestJS"] },
    { name: "C#", domain: "Programming", aliases: ["CSharp", ".NET Core", "ASP.NET", "Unity", "WPF"] },
    { name: "C++", domain: "Programming", aliases: ["CPP", "STL", "Embedded Systems", "DirectX", "Game Dev"] },
    { name: "C", domain: "Programming", aliases: ["Embedded", "Kernel", "Drivers", "Low-level"] },
    { name: "Go", domain: "Programming", aliases: ["Golang", "Cloud Native", "Concurrency"] },
    { name: "Rust", domain: "Programming", aliases: ["Systems Programming", "Memory Safety", "WASM"] },
    { name: "Swift", domain: "Programming", aliases: ["iOS", "macOS", "SwiftUI"] },
    { name: "Kotlin", domain: "Programming", aliases: ["Android", "KMM", "Server-side Kotlin"] },
    { name: "PHP", domain: "Programming", aliases: ["Laravel", "Symfony", "WordPress", "Magento"] },
    { name: "Ruby", domain: "Programming", aliases: ["Rails", "Ruby on Rails", "Sinatra"] },
    { name: "Scala", domain: "Programming", aliases: ["Big Data", "Spark", "Akka"] },
    { name: "Dart", domain: "Programming", aliases: ["Flutter", "Mobile"] },
    { name: "Objective-C", domain: "Programming", aliases: ["Legacy iOS"] },
    { name: "R", domain: "Programming", aliases: ["Statistics", "Data Mining"] },
    { name: "Perl", domain: "Programming", aliases: ["Scripting", "Regex"] },
    { name: "Haskell", domain: "Programming", aliases: ["Functional"] },
    { name: "SQL", domain: "Programming", aliases: ["MySQL", "PostgreSQL", "T-SQL", "PL/SQL"] },
    { name: "Shell Scripting", domain: "Programming", aliases: ["Bash", "Zsh", "PowerShell"] },
    { name: "COBOL", domain: "Programming", aliases: ["Mainframe", "Legacy"] },
    { name: "Fortran", domain: "Programming", aliases: ["Scientific Computing"] },
    { name: "Lisp", domain: "Programming", aliases: ["AI", "Common Lisp", "Clojure"] },
    { name: "Elixir", domain: "Programming", aliases: ["Erlang", "Phoenix"] },

    // --- CLOUD & VIRTUALIZATION ---
    { name: "AWS", domain: "Cloud Computing", aliases: ["Amazon Web Services", "EC2", "S3", "Lambda", "DynamoDB", "RDS"] },
    { name: "Azure", domain: "Cloud Computing", aliases: ["Microsoft Azure", "Functions", "CosmosDB", "Azure AD"] },
    { name: "GCP", domain: "Cloud Computing", aliases: ["Google Cloud Platform", "BigQuery", "Firebase", "GKE"] },
    { name: "Heroku", domain: "Cloud Computing", aliases: ["PaaS"] },
    { name: "DigitalOcean", domain: "Cloud Computing", aliases: ["Droplets"] },
    { name: "OpenStack", domain: "Cloud Computing", aliases: ["Private Cloud"] },
    { name: "VMware", domain: "Virtualization", aliases: ["ESXi", "vSphere"] },

    // --- DEVOPS, CI/CD & SRE ---
    { name: "Docker", domain: "DevOps", aliases: ["Containers", "Containerization", "Docker Compose"] },
    { name: "Kubernetes", domain: "DevOps", aliases: ["K8s", "Orchestration", "Helm", "Istio"] },
    { name: "Terraform", domain: "DevOps", aliases: ["Infrastructure as Code", "IaC", "HCL"] },
    { name: "Ansible", domain: "DevOps", aliases: ["Automation", "Configuration Management"] },
    { name: "Jenkins", domain: "DevOps", aliases: ["CI/CD", "Automation Server"] },
    { name: "GitHub Actions", domain: "DevOps", aliases: ["Workflow Automation"] },
    { name: "GitLab CI", domain: "DevOps", aliases: ["Pipelines"] },
    { name: "CircleCI", domain: "DevOps", aliases: ["Continuous Integration"] },
    { name: "Prometheus", domain: "DevOps", aliases: ["Monitoring", "Metrics"] },
    { name: "Grafana", domain: "DevOps", aliases: ["Visualization", "Dashboards"] },
    { name: "Elasticsearch", domain: "DevOps", aliases: ["ELK Stack", "Logging", "Search Engine"] },
    { name: "Splunk", domain: "DevOps", aliases: ["Log Management", "SIEM"] },
    { name: "Nagios", domain: "DevOps", aliases: ["Network Monitoring"] },

    // --- DATABASES & STORAGE ---
    { name: "PostgreSQL", domain: "Databases", aliases: ["Postgres", "Relational"] },
    { name: "MySQL", domain: "Databases", aliases: ["Relational", "MariaDB"] },
    { name: "MongoDB", domain: "Databases", aliases: ["NoSQL", "Document Store"] },
    { name: "Redis", domain: "Databases", aliases: ["Caching", "Key-Value Store"] },
    { name: "Oracle Database", domain: "Databases", aliases: ["Enterprise DB"] },
    { name: "Microsoft SQL Server", domain: "Databases", aliases: ["MSSQL", "T-SQL"] },
    { name: "Cassandra", domain: "Databases", aliases: ["NoSQL", "Columnar"] },
    { name: "DynamoDB", domain: "Databases", aliases: ["AWS NoSQL"] },
    { name: "Neo4j", domain: "Databases", aliases: ["Graph Database"] },
    { name: "InfluxDB", domain: "Databases", aliases: ["Time Series"] },
    { name: "Snowflake", domain: "Databases", aliases: ["Data Warehousing"] },

    // --- WEB DEVELOPMENT (FRONTEND & BACKEND) ---
    { name: "React", domain: "Web Development", aliases: ["Frontend", "ReactJS", "Hooks"] },
    { name: "Angular", domain: "Web Development", aliases: ["Frontend", "TypeScript"] },
    { name: "Vue.js", domain: "Web Development", aliases: ["Frontend", "VueJS"] },
    { name: "HTML5", domain: "Web Development", aliases: ["Web Markup", "Frontend"] },
    { name: "CSS3", domain: "Web Development", aliases: ["SASS", "Tailwind", "Bootstrap"] },
    { name: "Node.js", domain: "Web Development", aliases: ["Backend", "Express", "npm"] },
    { name: "Django", domain: "Web Development", aliases: ["Python", "Backend"] },
    { name: "Spring Boot", domain: "Web Development", aliases: ["Java", "Backend"] },
    { name: "Laravel", domain: "Web Development", aliases: ["PHP", "Backend"] },
    { name: "ASP.NET Core", domain: "Web Development", aliases: [".NET", "Backend"] },
    { name: "GraphQL", domain: "Web Development", aliases: ["API", "Apollo"] },
    { name: "REST API", domain: "Web Development", aliases: ["JSON", "Web Services"] },

    // --- DATA SCIENCE, AI & MACHINE LEARNING ---
    { name: "Machine Learning", domain: "Data & AI", aliases: ["ML", "Scikit-learn", "Supervised Learning"] },
    { name: "Deep Learning", domain: "Data & AI", aliases: ["Neural Networks", "TensorFlow", "Keras"] },
    { name: "Data Science", domain: "Data & AI", aliases: ["Data Analysis", "R", "Jupyter"] },
    { name: "Computer Vision", domain: "Data & AI", aliases: ["OpenCV", "Image Processing"] },
    { name: "NLP", domain: "Data & AI", aliases: ["Natural Language Processing", "BERT", "GPT"] },
    { name: "Big Data", domain: "Data & AI", aliases: ["Hadoop", "Spark", "Kafka"] },
    { name: "TensorFlow", domain: "Data & AI", aliases: ["AI Framework"] },
    { name: "PyTorch", domain: "Data & AI", aliases: ["AI Framework"] },
    { name: "Power BI", domain: "Data & AI", aliases: ["Business Intelligence"] },
    { name: "Tableau", domain: "Data & AI", aliases: ["Data Visualization"] },

    // --- CYBER SECURITY ---
    { name: "Ethical Hacking", domain: "Security", aliases: ["Penetration Testing", "Pentesting"] },
    { name: "Network Security", domain: "Security", aliases: ["Firewalls", "VPN", "IDS/IPS"] },
    { name: "Identity & Access Management", domain: "Security", aliases: ["IAM", "OAuth", "SAML"] },
    { name: "Cryptography", domain: "Security", aliases: ["Encryption", "Hashing"] },
    { name: "Application Security", domain: "Security", aliases: ["AppSec", "OWASP"] },
    { name: "Cloud Security", domain: "Security", aliases: ["DevSecOps"] },
    { name: "Information Security", domain: "Security", aliases: ["InfoSec", "ISO 27001"] },

    // --- TESTING & QUALITY ASSURANCE ---
    { name: "Manual Testing", domain: "Testing", aliases: ["QA", "Black Box Testing"] },
    { name: "Selenium", domain: "Testing", aliases: ["Automation Testing", "WebDriver"] },
    { name: "Cypress", domain: "Testing", aliases: ["E2E Testing", "Frontend Testing"] },
    { name: "JUnit", domain: "Testing", aliases: ["Unit Testing", "Java"] },
    { name: "Pytest", domain: "Testing", aliases: ["Unit Testing", "Python"] },
    { name: "Postman", domain: "Testing", aliases: ["API Testing"] },
    { name: "JMeter", domain: "Testing", aliases: ["Performance Testing", "Load Testing"] },
    { name: "LoadRunner", domain: "Testing", aliases: ["Performance Testing"] },

    // --- MICROSOFT 365 & ENTERPRISE IT ---
    { name: "Microsoft 365", domain: "Microsoft 365", aliases: ["Office 365", "Exchange", "SharePoint"] },
    { name: "Microsoft Teams", domain: "Microsoft 365", aliases: ["Collaboration", "Unified Comms"] },
    { name: "SharePoint Online", domain: "Microsoft 365", aliases: ["Intranet", "DMS"] },
    { name: "Exchange Online", domain: "Microsoft 365", aliases: ["Email Admin"] },
    { name: "Microsoft Intune", domain: "Microsoft 365", aliases: ["MDM", "MAM", "Endpoint Management"] },
    { name: "Power BI", domain: "Microsoft 365", aliases: ["Analytics"] },
    { name: "Power Apps", domain: "Microsoft 365", aliases: ["Low-code", "Business Apps"] },
    { name: "Power Automate", domain: "Microsoft 365", aliases: ["Flow", "RPA", "Automation"] },
    { name: "Active Directory", domain: "Microsoft 365", aliases: ["AD", "Domain Controller"] },
    { name: "Azure AD", domain: "Microsoft 365", aliases: ["Entra ID", "Cloud Identity"] },

    // --- TOOLS & METHODOLOGIES ---
    { name: "Agile", domain: "Tools & Methodology", aliases: ["Scrum", "Kanban"] },
    { name: "Jira", domain: "Tools & Methodology", aliases: ["Ticketing", "Project Management"] },
    { name: "Confluence", domain: "Tools & Methodology", aliases: ["Documentation", "Wiki"] },
    { name: "Slack", domain: "Tools & Methodology", aliases: ["Communication"] },
    { name: "Trello", domain: "Tools & Methodology", aliases: ["Task Management"] },
    { name: "Postman", domain: "Tools & Methodology", aliases: ["API Tools"] },
    { name: "Visual Studio Code", domain: "Tools & Methodology", aliases: ["VS Code", "IDE"] },
    { name: "Git", domain: "Tools & Methodology", aliases: ["Version Control", "GitHub"] },
    { name: "Figma", domain: "Tools & Methodology", aliases: ["UI/UX Design", "Prototyping"] }
];

/**
 * Returns all skills in the registry
 */
function getAllSkills() {
    return skillRegistry;
}

/**
 * Returns skills grouped by domain
 */
function getSkillsByDomain() {
    const domains = {};
    skillRegistry.forEach(s => {
        if (!domains[s.domain]) domains[s.domain] = [];
        domains[s.domain].push(s);
    });
    return domains;
}

/**
 * Enhanced Autocomplete Logic
 */
function getSkillSuggestions(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    
    return skillRegistry.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(q);
        const aliasMatch = s.aliases.some(a => a.toLowerCase().includes(q));
        const domainMatch = s.domain.toLowerCase().includes(q);
        return nameMatch || aliasMatch || domainMatch;
    }).sort((a, b) => {
        const aStart = a.name.toLowerCase().startsWith(q);
        const bStart = b.name.toLowerCase().startsWith(q);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.name.localeCompare(b.name);
    });
}

function resolveSkill(input) {
    const q = input.toLowerCase();
    return skillRegistry.find(s => 
        s.name.toLowerCase() === q || 
        s.aliases.some(a => a.toLowerCase() === q)
    );
}
