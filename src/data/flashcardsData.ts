export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  concept: string; // e.g. "Fundamentals", "Automation", "Methodologies"
}

export interface SpeedQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const FLASHCARDS_DECK: Flashcard[] = [
  {
    id: "fc-1",
    term: "Verification",
    definition: "Evaluating documents or code blocks statically to verify conformance to technical specs ('Are we building the product right?'). No code execution.",
    concept: "Fundamentals"
  },
  {
    id: "fc-2",
    term: "Validation",
    definition: "Executing the unified software application dynamically to confirm it satisfies client business needs ('Are we building the right product?').",
    concept: "Fundamentals"
  },
  {
    id: "fc-3",
    term: "Equivalence Partitioning (EP)",
    definition: "A black-box technique grouping input values into classes expected to produce identical responses. QA tests just one representative per class.",
    concept: "Test Design"
  },
  {
    id: "fc-4",
    term: "Boundary Value Analysis (BVA)",
    definition: "A black-box technique testing partition edges (e.g., min-1, min, min+1, max-1, max, max+1) where programmers commonly make off-by-one errors.",
    concept: "Test Design"
  },
  {
    id: "fc-5",
    term: "Bug Severity",
    definition: "The technical impact level a defect has on software runtime operations (e.g. Blocker, Critical, Major, Minor).",
    concept: "Defect Management"
  },
  {
    id: "fc-6",
    term: "Bug Priority",
    definition: "The business urgency level assigned to repairing a bug (e.g. High, Medium, Low). Guided by marketing, releases, and contracts.",
    concept: "Defect Management"
  },
  {
    id: "fc-7",
    term: "Flaky Test",
    definition: "A test script that exhibits non-deterministic outcomes (periodically passes and fails on identical code). Fix by avoiding hardcoded sleep timers.",
    concept: "Automation"
  },
  {
    id: "fc-8",
    term: "Page Object Model (POM)",
    definition: "A test automation design code pattern that isolates elements and action selectors into page classes, preventing repetitive maintenance.",
    concept: "Automation"
  },
  {
    id: "fc-9",
    term: "Defect Clustering",
    definition: "The QA principle stating that ~80% of defects are concentrated in ~20% of complex application modules (Pareto Principle).",
    concept: "Fundamentals"
  },
  {
    id: "fc-10",
    term: "Pesticide Paradox",
    definition: "Running the same test scripts repeatedly limits new defect findings. Tests must be continuously diversified and updated.",
    concept: "Fundamentals"
  },
  {
    id: "fc-11",
    term: "Retesting",
    definition: "Re-executing the precise test cases that originally failed to prove the developer's edit resolved the bug.",
    concept: "Agile & DevOps"
  },
  {
    id: "fc-12",
    term: "Regression Testing",
    definition: "Re-running broader stable test suites to ensure that recent code modifications did not unintentionally break unmodified elements.",
    concept: "Agile & DevOps"
  }
];

export const SPEED_QUIZ_QUESTIONS: SpeedQuizQuestion[] = [
  {
    id: "sqq-1",
    question: "If a system is mathematically defect-free but fails to meet actual user expectations, this violates which tester principle?",
    options: [
      "Pesticide Paradox",
      "Absence of Errors Fallacy",
      "Defect Clustering",
      "Exhaustive Testing is Impossible"
    ],
    correctAnswer: 1,
    explanation: "The 'Absence of Errors Fallacy' states that fixing bugs is useless if the system doesn't satisfy client business needs or expectations."
  },
  {
    id: "sqq-2",
    question: "Which wait command polls elements recursively at designated intervals until loaded?",
    options: [
      "Implicit Wait",
      "Hard Thread Sleep",
      "Fluent Wait",
      "Static Postponement"
    ],
    correctAnswer: 2,
    explanation: "Fluent Wait polls the browser DOM periodically (e.g. every 250ms) for a specific status, with the option to ignore timeout exceptions."
  },
  {
    id: "sqq-3",
    question: "An e-commerce login page contains a typo in the main header. This has what severity and priority?",
    options: [
      "High Severity / High Priority",
      "Low Severity / High Priority",
      "High Severity / Low Priority",
      "Low Severity / Low Priority"
    ],
    correctAnswer: 1,
    explanation: "A typo doesn't block functionality (Low Severity), but it damages brand trust looking highly unprofessional on login, demanding repair immediately (High Priority)."
  },
  {
    id: "sqq-4",
    question: "What is the primary technical objective of Static Testing?",
    options: [
      "Executing the application under peak thread loads",
      "Evaluating documents, rules, or code text without execution",
      "Performing black-box user usability testing on browsers",
      "Simulating database recovery procedures"
    ],
    correctAnswer: 1,
    explanation: "Static Testing involves reviewing specifications, manual code walkthroughs, inspections, and linter runs, without executing the codebase."
  },
  {
    id: "sqq-5",
    question: "In standard SCRUM, what is the 'Definition of Done'?",
    options: [
      "The code compiled successfully on the developer's laptop",
      "A set criteria confirming a ticket is fully written, peer-reviewed, tested, and ready to ship",
      "The client accepted the design wireframes",
      "The QA lead signed off the project budget"
    ],
    correctAnswer: 1,
    explanation: "The DoD is a shared checklist of criteria (code, reviews, test, compliance) that a product backlog item must pass before it's officially counted as complete."
  }
];
