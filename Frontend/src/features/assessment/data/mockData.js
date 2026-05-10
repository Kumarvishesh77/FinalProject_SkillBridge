export const mockAssessmentData = {
  "assessmentId": "A101",
  "skillName": "CI/CD",
  "estimatedLevel": "Intermediate",
  "questions": [
    {
      "id": "Q1",
      "type": "mcq",
      "difficulty": "Basic",
      "question": "Which tool is commonly used for CI?",
      "options": ["Jenkins", "Figma", "Photoshop", "MongoDB"],
      "correctAnswer": "Jenkins"
    },
    {
      "id": "Q2",
      "type": "descriptive",
      "difficulty": "Intermediate",
      "question": "Explain CI vs CD."
    },
    {
      "id": "Q3",
      "type": "coding",
      "difficulty": "Intermediate",
      "question": "Write a GitHub Actions workflow for npm test.",
      "placeholder": "name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Use Node.js\n        uses: actions/setup-node@v2\n        with:\n          node-version: '14'\n      - run: npm install\n      - run: npm test"
    },
    {
      "id": "Q4",
      "type": "fillup",
      "difficulty": "Basic",
      "question": "Docker images are built using ______."
    },
    {
      "id": "Q5",
      "type": "case-study",
      "difficulty": "Advanced",
      "scenario": "Production deployment failed after merge.",
      "question": "How will you debug and recover the system?"
    }
  ]
};

export const userSkills = [
  { name: "React.js", selfRated: "Advanced", verified: "Advanced" },
  { name: "Node.js", selfRated: "Intermediate", verified: "Pending" },
  { name: "Python", selfRated: "Basic", verified: "Basic" },
  { name: "CI/CD", selfRated: "Intermediate", verified: "Not Verified" },
  { name: "Docker", selfRated: "Intermediate", verified: "Intermediate" }
];

export const availableSkills = [
  "React.js", "Node.js", "Python", "CI/CD", "Docker", "Kubernetes", "AWS", "SQL", "NoSQL", "System Design"
];
