export interface InterviewQuestion {
  id: string;
  category: "Fundamentals" | "Defect Management" | "Test Design" | "Agile & DevOps" | "Automation" | "SQL & Databases";
  question: string;
  answer: string;
  keyPoints: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export const TOP_50_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // --- FUNDAMENTALS ---
  {
    id: "fq-1",
    category: "Fundamentals",
    question: "What is the primary difference between Verification and Validation?",
    answer: "Verification evaluates work products of a development phase to determine if they meet specified requirements ('Are we building the product right?'). It represents static testing like code reviews, walkthroughs, and inspections. Validation evaluates the finalized software application to ensure it satisfies user needs and business requirements ('Are we building the right product?'). It representing dynamic testing, which executes code.",
    keyPoints: ["Verification = Static (No execution, reviews, specification check)", "Validation = Dynamic (Code execution, customer expectations check)"],
    difficulty: "Easy"
  },
  {
    id: "fq-2",
    category: "Fundamentals",
    question: "Explain the Pesticide Paradox in Software Testing.",
    answer: "The Pesticide Paradox states that if you keep running the exact same set of regression tests repeatedly, eventually those tests will stop uncovering new bugs. To bypass this, tests must be regularly updated, randomized, updated for new features, and blended with exploratory manual testing to search for defects in untouched areas of the application code.",
    keyPoints: ["Tests lose effectiveness over time if not updated", "Continuous test maintenance and exploratory runs prevent this paradox"],
    difficulty: "Medium"
  },
  {
    id: "fq-3",
    category: "Fundamentals",
    question: "What does are the 7 Principles of Software Testing?",
    answer: "The 7 Principles are: 1) Testing shows the presence of defects, not their absence. 2) Exhaustive testing is impossible. 3) Early testing saves time & money. 4) Defect clustering (80% of bugs in 20% of code). 5) Pesticide Paradox. 6) Testing is context-dependent. 7) Absence-of-errors fallacy (a bug-free system is useless if it doesn't meet business needs).",
    keyPoints: ["Exhaustive testing is impossible", "Defect clustering (Pareto 80/20 rule)", "Absence of errors fallacy"],
    difficulty: "Medium"
  },
  {
    id: "fq-4",
    category: "Fundamentals",
    question: "Difference between Static and Dynamic Testing?",
    answer: "Static testing reviews documents, requirements, or code structure without executing the software application itself (e.g., reviews, walkthroughs, lint checking). Dynamic testing executes the code and matches outputs against predetermined baseline expectations (e.g., unit test execution, system integration runs, manual click-throughs).",
    keyPoints: ["Static is inspection-based", "Dynamic is runtime-based"],
    difficulty: "Easy"
  },
  {
    id: "fq-5",
    category: "Fundamentals",
    question: "Explain Quality Assurance (QA) vs. Quality Control (QC) vs. Software Testing.",
    answer: "QA is process-oriented, focusing on preventing defects by refining development and testing methodologies (PROACTIVE). QC is product-oriented, focusing on identifying defects in the software before release (REACTIVE). Software Testing is the technical execution of tests to find defects, acting as a core technical activity within QC (REACTIVE/TECHNICAL).",
    keyPoints: ["QA = Process-focused (Proactive prevention)", "QC = Product-focused (Reactive detection)", "Testing = Hands-on defect finding (Technical execution)"],
    difficulty: "Easy"
  },

  // --- DEFECT MANAGEMENT ---
  {
    id: "dq-1",
    category: "Defect Management",
    question: "Explain Bug Severity vs. Bug Priority with real-world examples.",
    answer: "Severity marks the technical impact of a defect on the software's operations. Priority marks the commercial urgency of fixing the defect. Example of High Severity / Low Priority: A system crash that only occurs when tapping a deprecated, hidden settings button. Example of Low Severity / High Priority: A spelling error or upside-down trademark logo on the main marketing landing page.",
    keyPoints: ["Severity = Technical impact level", "Priority = Commercial/Business urgency level", "They can be independent metrics"],
    difficulty: "Medium"
  },
  {
    id: "dq-2",
    category: "Defect Management",
    question: "What are the essential components of a high-quality Bug Report?",
    answer: "A solid Bug Report must contain: 1) A concise Title detailing the symptom, component, and device. 2) Precise Pre-conditions (e.g., active session). 3) Step-by-step reproduction instructions. 4) Actual result (incorrect outcome observed). 5) Expected result (correct functional behavior). 6) Severity/Priority markers. 7) Environment details. 8) Attachments (screenshots, logs, crash reports).",
    keyPoints: ["Steps to reproduce are most critical", "Clear division of Actual vs Expected results", "Enclose environment specs and trace logs"],
    difficulty: "Easy"
  },
  {
    id: "dq-3",
    category: "Defect Management",
    question: "Describe the lifecycle of a Bug (Defect Life Cycle).",
    answer: "A bug starts as 'NEW'. Once reviewed by QA Lead, it is 'ASSIGNED' to a developer. The developer transitions it to 'OPEN' to study the fix, then 'FIXED/RESOLVED' once the code is edited. QA tests it: if it passes, the bug is marked 'CLOSED'. If the bug is still present, it is 'REOPENED'. If it isn't a defect, it can be marked 'DUPLICATE', 'REJECTED', or 'DEFERRED'.",
    keyPoints: ["NEW -> ASSIGNED -> OPEN -> FIXED -> RE-TEST -> CLOSED/REOPENED", "Sub-states: REJECTED, DUPLICATE, DEFERRED"],
    difficulty: "Easy"
  },
  {
    id: "dq-4",
    category: "Defect Management",
    question: "What is Bug Leakage and Bug Release?",
    answer: "Bug Leakage occurs when a defect passes past the QA phase undetected and is spotted by customers in production. Bug Release occurs when a software version is shipped to production with a known, identified bug, typically after being deferred by management due to low severity and business constraints.",
    keyPoints: ["Leakage = Missed by testing team", "Release = Deliberately shipped with low-risk known bugs"],
    difficulty: "Medium"
  },
  {
    id: "dq-5",
    category: "Defect Management",
    question: "How do you handle a bug that developers cannot reproduce ('Works on my machine')?",
    answer: "I begin by checking our test environment configurations. I reproduce the issue showing live screen captures, browser console outputs, or server endpoints logs. I review exact browser versions, viewport scaling, locale, and state variables. If still unresolvable, I pair-program with the developer to compare environments directly.",
    keyPoints: ["Verify environmental differences (OS, cache, screen resolution)", "Provide raw console outputs, recordings, and state logs", "Collaborate on a structured peer debug session"],
    difficulty: "Medium"
  },

  // --- TEST DESIGN ---
  {
    id: "tq-1",
    category: "Test Design",
    question: "How do Equivalence Partitioning and Boundary Value Analysis work together?",
    answer: "Equivalence Partitioning groups infinite inputs into equivalent classes where the software behaves identically, letting QA select one representative value per class. Boundary Value Analysis targets the exact transition boundaries of these classes where programmers commonly make off-by-one errors (testing min, min-1, min+1, max, max-1, max+1). Together, they drastically optimize test sizing while retaining excellent risk coverage.",
    keyPoints: ["Equivalence partitions focus on data classes", "BVA targets the class thresholds", "Together they avoid duplicate redundant testing"],
    difficulty: "Easy"
  },
  {
    id: "tq-2",
    category: "Test Design",
    question: "What is a Decision Table and when should you use it?",
    answer: "A Decision Table is a structural black-box design technique that describes complex business rules by mapping combinations of input conditions to resulting actions. You should use it when the application's output is governed by a matrix of overlapping, interdependent boolean preconditions.",
    keyPoints: ["Grid mapping boolean inputs to action outputs", "Great for complex logic like finance calculations", "Bridges requirements gaps visually"],
    difficulty: "Medium"
  },
  {
    id: "tq-3",
    category: "Test Design",
    question: "What is State Transition Testing?",
    answer: "State Transition Testing is a technique where inputs transition the software between distinct states, and we verify that the system responds correctly and prevents illegal state transitions (e.g., trying to withdraw cash from an 'unauthenticated' ATM state, or checking out with an empty cart state).",
    keyPoints: ["Focuses on state progression", "Verifies both valid transitions and invalid barrier blocks", "Examples: E-commerce checkout sequence, Login locks"],
    difficulty: "Medium"
  },
  {
    id: "tq-4",
    category: "Test Design",
    question: "Explain the difference between Positive and Negative Testing.",
    answer: "Positive testing verifies that the system works as expected under normal, legal conditions (e.g., typing a valid numeric age). Negative testing verifies that the system gracefully handles illegal, invalid inputs or stressful exceptions without crashing (e.g., verifying that typing '-5' or special script characters outputs a clean handling error).",
    keyPoints: ["Positive = Valid inputs path ('Happy Path')", "Negative = Graceful error handling for invalid variables"],
    difficulty: "Easy"
  },
  {
    id: "tq-5",
    category: "Test Design",
    question: "What is Orthogonal Array Testing (OATS)?",
    answer: "OATS is a systematic, mathematical testing strategy used when a feature has a massive combination of variables and configurations. It selects a subset of combinations that validates all pairs of variables, maximizing combinatorial coverage while minimizing physical test executions.",
    keyPoints: ["Mathematical matrix for complex variable systems", "Checks dual-combination coverage", "Cuts test suite sizes dramatically"],
    difficulty: "Hard"
  },

  // --- AGILE & DEVOPS ---
  {
    id: "aq-1",
    category: "Agile & DevOps",
    question: "What is the difference between Regression Testing and Retesting?",
    answer: "Retesting is executing the specific test case that failed previously to verify that the developer's hotfix successfully corrected the original bug. Regression Testing runs the entire broader suite of tests on unedited modules to guarantee that the new hotfix coding did not accidentally break or compromise other secure areas of the system.",
    keyPoints: ["Retesting = Did the bug fix work? (Focused correction check)", "Regression = Did the bug fix break other things? (Broader system check)"],
    difficulty: "Easy"
  },
  {
    id: "aq-2",
    category: "Agile & DevOps",
    question: "What is 'Shift-Left Testing' and why is it beneficial?",
    answer: "Shift-Left Testing is the practice of moving QA and validation steps as early as possible in the software development lifecycle (toward the 'left' of the timeline). This means QA participates in requirements analysis, review of design spec documents, and sprint scoping. It catches bugs while they are conceptual, when they are exponentially cheaper and faster to fix.",
    keyPoints: ["Move testing earlier on the project timeline", "QA grooms requirements before developers write code", "Saves massive costs and prevents architectural errors"],
    difficulty: "Medium"
  },
  {
    id: "aq-3",
    category: "Agile & DevOps",
    question: "What is the role of QA in a Scrum Sprint Planning/Scrum Grooming session?",
    answer: "QA's role is to assess the 'Testability' of proposed user stories, define clear, measurable Acceptance Criteria, identify missing edge scenarios or data validation constraints early, estimate testing effort (sizing points), and establish a 'Definition of Done' that incorporates complete automated/manual regressions.",
    keyPoints: ["Assert 'Testability' metrics on tickets", "Drive Acceptance Criteria accuracy", "Inject risk-assessments during point estimation"],
    difficulty: "Medium"
  },
  {
    id: "aq-4",
    category: "Agile & DevOps",
    question: "Difference between Definition of Ready (DoR) and Definition of Done (DoD)?",
    answer: "Definition of Ready ensures a story has clear requirements, acceptance criteria, and designs so development can start. Definition of Done is a criteria checklist that applies to all stories, proving they are completely coded, peer-reviewed, pass high-impact automated/manual test runs, have secure performance metrics, and are safe to deploy.",
    keyPoints: ["DoR = Ready to build", "DoD = Fully coded, tested, and ready to ship"],
    difficulty: "Medium"
  },
  {
    id: "aq-5",
    category: "Agile & DevOps",
    question: "What is CI/CD, and why does automated testing rely on it?",
    answer: "CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. Automation scripts are integrated into CI/CD pipelines to run automatically on every code commit or merge request. This provides immediate quality checks, alerting developers to regressions within minutes of their code push.",
    keyPoints: ["Immediate feedback loop for commit updates", "Build gates abort if automated tests fail", "Prevents broken code from merging to main branches"],
    difficulty: "Medium"
  },

  // --- AUTOMATION ---
  {
    id: "atq-1",
    category: "Automation",
    question: "What is a 'Flaky' test and how do you resolve it?",
    answer: "A flaky test is one that periodically fails and passes on the exact same codebase without any changes. It is commonly caused by: 1) Hardcoded sleep/pause statements (failing under minor network lag). 2) Weak, non-unique DOM selectors. 3) Unstable test database records. I fix flakiness by swapping `Thread.sleep` for explicit dynamic element awaits (e.g., waiting for visibility), using dedicated test-id attributes, and rolling back database transactions.",
    keyPoints: ["Caused by race conditions, non-unique selectors, or shared state", "Avoid static wait delays; use dynamic target-state assertions instead", "Ensure clean, sandboxed test data environments"],
    difficulty: "Hard"
  },
  {
    id: "atq-2",
    category: "Automation",
    question: "Construct a basic Cypress or Playwright test syntax block for a login page.",
    answer: "In Cypress: \n`describe('Login Page', () => {\n  it('logs in successfully with valid credentials', () => {\n    cy.visit('/login');\n    cy.get('[data-testid=email-input]').type('user@test.com');\n    cy.get('[data-testid=pwd-input]').type('validpassword');\n    cy.get('[data-testid=submit-btn]').click();\n    cy.url().should('include', '/dashboard');\n  });\n});`",
    keyPoints: ["Use descriptive test descriptors (it, describe)", "Locate via data-testid", "Perform inputs keystrokes", "Assert navigation url or DOM element state"],
    difficulty: "Medium"
  },
  {
    id: "atq-3",
    category: "Automation",
    question: "Explain the Page Object Model (POM) pattern in test automation.",
    answer: "POM is a design pattern that creates an object repository for web page UI elements. Each webpage has its own class file defining its selectors and custom actions (methods). This separates test logic from page structures. If an element's selector changes, you only update it once in the POM class, rather than modifying dozens of test files.",
    keyPoints: ["Separates test scripts from underlying UI layout selectors", "Enhances code reusability and significantly simplifies maintenance", "Each page has its own dedicated class"],
    difficulty: "Medium"
  },
  {
    id: "atq-4",
    category: "Automation",
    question: "What is the difference between Implicit Waits, Explicit Waits, and Fluent Waits?",
    answer: "Implicit Wait sets a global timeout for finding all DOM elements. Explicit Wait targets a specific element with a conditional timeout (e.g., wait until button is clickable). Fluent Wait is a type of Explicit Wait that checks the element's status at defined polling intervals, with option to ignore specific exceptions.",
    keyPoints: ["Implicit = global wait limit", "Explicit = target element wait limit with conditions", "Fluent = custom polling intervals & exception filters"],
    difficulty: "Hard"
  },
  {
    id: "atq-5",
    category: "Automation",
    question: "When should you automate a test case? (Rule of thumb)",
    answer: "Automate test cases that are: 1) Highly repetitive, executed across multiple releases (Regression). 2) Feasible with clear, structured steps and expected results. 3) Prone to human manual errors. Do NOT automate: 1) One-time exploratory or cosmetic checks. 2) Highly volatile features that change daily/weekly. 3) Usability and user-experience assessments.",
    keyPoints: ["High ROI = stable regression flows, multi-device layouts, heavy scale loads", "Low ROI = creative exploration, brand-new volatile UI layouts"],
    difficulty: "Easy"
  },

  // --- SQL & DATABASES ---
  {
    id: "sq-1",
    category: "SQL & Databases",
    question: "Explain SQL JON types and their impacts on QA data reviews.",
    answer: "SQL is crucial for verifying backend state in gray-box testing. INNER JOIN returns matching records in both tables. LEFT JOIN returns all records from the left table, with matches from the right table. RIGHT JOIN is the inverse of LEFT. FULL JOIN returns all records when there is a match in either table. In testing, this helps verify that UI entities map correctly to backend tables.",
    keyPoints: ["INNER JOIN = only matching values", "LEFT JOIN = entire left table + matching right", "Ensures data parity across DB entity records during verification"],
    difficulty: "Medium"
  },
  {
    id: "sq-2",
    category: "SQL & Databases",
    question: "How do you test database integrity constraints (Primary key, Foreign key, Unique)?",
    answer: "I write specific tests to attempt violates these rules: 1) Try inserting a duplicate record with an existing Primary Key (must fail with unique violation constraint). 2) Try inserting a record with a non-existent Foreign Key relation (must fail with constraint error). 3) Inserting NULL values into NOT NULL columns to assert rejection.",
    keyPoints: ["Negative tests trying to break uniqueness constraints", "Ensure relational constraints prevent corrupted entries", "Assert correct database response codes"],
    difficulty: "Medium"
  },
  {
    id: "sq-3",
    category: "SQL & Databases",
    question: "What are Database Transactions, and what is ACID in testing?",
    answer: "A transaction represents a single local chunk of database execution. ACID defines the rules to protect transactions: Atomicity (all steps succeed or all rollback), Consistency (preserves database rules), Isolation (parallel actions do not overlap), Durability (completed data survives server failure). In banking apps, we test isolation and rollbacks to ensure transfer failures don't leave accounts out of sync.",
    keyPoints: ["Atomicity = All-or-Nothing execution", "ACID guarantees data security under load", "Test rollback operations for failure paths"],
    difficulty: "Hard"
  },
  {
    id: "sq-4",
    category: "SQL & Databases",
    question: "What is SQL Injection, and how can QA test for it?",
    answer: "SQL Injection is a dangerous security exploit where malicious SQL commands are typed into user text fields (e.g., typing `' OR '1'='1` or `; DROP TABLE Users;`). QA tests for this by typing special character strings into password inputs, emails, or search forms, and verifying that the backend rejects them or escapes them safely.",
    keyPoints: ["Security vulnerability where input runs as database code", "Negative test with escape variables", "Backend must utilize parameterized query methods always"],
    difficulty: "Hard"
  },
  {
    id: "sq-5",
    category: "SQL & Databases",
    question: "How do you trace slow-loading queries in system load testing?",
    answer: "I use system profile tools like `EXPLAIN ANALYZE` in PostgreSQL to inspect query execution pathways and verify if they are using indexed columns. I check connections pool limits under concurrent traffic, and verify if caching layers is active for repetitive queries.",
    keyPoints: ["Using EXPLAIN analyze to map search paths", "Checking missing database index files", "Ensuring database scale capabilities under load spikes"],
    difficulty: "Hard"
  }
];
