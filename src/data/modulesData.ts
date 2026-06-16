import { Module } from "../types";

export const modulesData: Module[] = [
  {
    id: 1,
    title: "Introduction to Software Testing",
    icon: "BookOpen",
    description: "Learn what software testing is, verification vs validation, the tester mindset, and real-world impacts of software failures.",
    sections: [
      {
        id: "1.1",
        title: "What is Software Testing?",
        content: {
          id: "1.1",
          title: "What is Software Testing?",
          what: "Software testing is the disciplined process of evaluating and verifying that a software application works exactly as intended. It involves executing a program or system component with the intent of finding defects or identifying deviations from specifications, verifying code soundness (Verification), and validating that the client's needs are fully satisfied (Validation).",
          whenToUse: "Throughout the entire Software Development Life Cycle (SDLC) - starting from requirement assessment and continuing past deployment into product maintenance.",
          whyToUse: "Prevents critical software failures, saves astronomical development costs by catching defects early, ensures safety & compliance, and delivers superior customer trust and satisfaction.",
          howToUse: "1. Review design guidelines and requirements for clarity.\n2. Formulate explicit Test Cases outlining inputs, outputs, and assert points.\n3. Execute tests systematically, matching actual responses against expected outcomes.\n4. Log any unexpected deviations as Defect Bug tickets and verify subsequent hotfixes.",
          examples: [
            "Analogy: Safety crash-testing a vehicle before general consumers take the wheel; assessing windshield wipers, ABS systems, and structural safety boundaries.",
            "Historical Outage: Knight Capital Group suffered a staggering $460 million financial loss in just 45 minutes in 2012 due to outdated test software code left active in production."
          ]
        },
        quiz: [
          {
            id: "1.1-q1",
            question: "What is the crucial difference between Verification and Validation?",
            options: [
              "Verification checks if we built the product right; Validation checks if we built the right product.",
              "Verification is done by testers; Validation is done solely by end customers.",
              "Verification is exclusively dynamic execution; Validation is exclusively static documentation review.",
              "There is no difference; they are interchangeable terms."
            ],
            correctAnswer: 0,
            explanation: "Verification ensures that the software conforms to internal technical specifications ('built right'). Validation ensures the final application satisfies user needs and business requirements ('built the right product')."
          },
          {
            id: "1.1-q2",
            question: "What is a 'Defect' (or Bug) in technical terminology?",
            options: [
              "Any mistake made by a human during code authoring.",
              "An active deviation in a running software program from its stated requirements.",
              "The physical crash of a central application server.",
              "A request for a new user feature."
            ],
            correctAnswer: 1,
            explanation: "A human makes an ERROR. This error results in a DEFECT (or bug) within the source code. When that defective code is executed, it manifests in production as a system FAILURE."
          }
        ]
      },
      {
        id: "1.2",
        title: "Role of a Software Tester",
        content: {
          id: "1.2",
          title: "Role of a Software Tester",
          what: "A software tester is a critical analytical quality advocate who designs test plans, identifies critical edge conditions, compiles defect logs, and collaborates across functions to ensure that applications remain robust under stress and align perfectly with consumer expectations.",
          whenToUse: "Testers actively participate in Scrum grooming, requirement analysis, automated build steps, manual usability cycles, and release signing processes.",
          whyToUse: "Developers can possess 'confirmation bias' when testing their own code. A tester introduces an independent, rigorous, and highly skeptical perspective that challenges the software to find out exactly where and when it cracks.",
          howToUse: "1. Review mockups and tickets to identify hidden requirements.\n2. Code modular automated validation test scripts.\n3. Execute exploratory test cascades across client view layouts.\n4. Log clear, reproducible defect tickets directly to developer workspaces.",
          examples: [
            "Scenario: Discovering that a new banking login page triggers a major security exception whenever a user types custom alphanumeric punctuation in the secondary email field.",
            "Scenario: Intercepting a broken third-party payment payload before code ships live."
          ]
        },
        matchPairs: [
          { id: "1.2-m1", concept: "Exploratory Testing", description: "Simultaneous learning, test design, and test execution without a pre-existing script." },
          { id: "1.2-m2", concept: "Regression Testing", description: "Re-executing test layouts to verify that fresh code changes did not break secure functionality." },
          { id: "1.2-m3", concept: "Tester Skepticism", description: "The essential mindset that assumes software is always carrying hidden bugs until proven clean." }
        ]
      },
      {
        id: "1.3",
        title: "Importance of Software Testing",
        content: {
          id: "1.3",
          title: "Importance of Software Testing",
          what: "Testing acts as a crucial safety net. Without adequate quality assurance engineering, companies face catastrophic financial liability, public brand damage, severe legislative penalties (HIPAA, GDPR), and in critical sectors like healthcare, actual danger to human lives.",
          whenToUse: "Always mandatory. It must not be bypassed to meet aggressive deployment sprint deadlines.",
          whyToUse: "The cost to patch a defect escalates exponentially throughout development. Fixing a requirement bug during initial design phase costs $1. Catching that identical bug during system testing costs $100. Fixing it after it breaches live production can cost $10,000+ in hotfixes, support workload, and customer churn.",
          howToUse: "1. Implement shift-left testing: assess requirements early.\n2. Formulate automated unit and static integration tests in development pipelines.\n3. Establish staging sandboxes mirroring real-world configurations.\n4. Enforce strict exit gates before master branches merge to production.",
          examples: [
            "Healthcare Failure: The Therac-25 radiation therapy machine delivered massive, fatal radiation overdoses to patients due to a subtle race condition bug within its software controls.",
            "Retail Failure: A major e-commerce web platform had a checkout bug where item prices recalculated to $0 when multi-buy discounts overlapped, causing a complete freeze on transactions."
          ]
        },
        quiz: [
          {
            id: "1.3-q1",
            question: "Why does the cost of fixing a bug escalate so dramatically in production?",
            options: [
              "Because production code is written in a different programming language.",
              "It requires emergency hotfixes, database migrations, security audits, and compromises live customer safety.",
              "Developers charge treble hourly rates during night shifts.",
              "It doesn't escalate; it remains constant."
            ],
            correctAnswer: 1,
            explanation: "In design, fixing a bug is as simple as editing a text document. In production, a bug find requires developer context switching, patch builds, regression testing cycles, customer support responses, and active damage mitigation."
          }
        ]
      },
      {
        id: "1.4",
        title: "Software Testing in the Real World",
        content: {
          id: "1.4",
          title: "Software Testing in the Real World",
          what: "Software testing is highly contextual. How we test a video game for visual clipping and multiplayer latency is worlds apart from how we audit a life-critical medical heart monitor or an e-commerce platform processing 10,000 credit cards per second.",
          whenToUse: "When mapping domain-specific regulations, performance standards, and security postures.",
          whyToUse: "Avoids generic testing approaches that fail to address specialized real-world failure patterns (like medical regulatory compliance or banking double-spending attempts).",
          howToUse: "1. Assess industry and target regulations (e.g., medical ISO, financial PCI-DSS).\n2. Adopt specialized verification methods (e.g., pen testing for finance, latency profiling for games).\n3. Structure testing cycles mimicking active end-user personas.",
          examples: [
            "Gaming: Testing a multiplayer physics model to ensure vehicles do not fall through the floor when 50 players occupy a single server square.",
            "Finance: Verifying transactional absolute ACID properties (Atomicity, Consistency, Isolation, Durability) during heavy bank transfer loads."
          ]
        },
        caseStudy: {
          id: "1.4-cs1",
          title: "The Mars Climate Orbiter Catastrophe",
          scenario: "In 1999, NASA lost the $125 million Mars Climate Orbiter spacecraft. The probe entered the Martian atmosphere at an unexpectedly low altitude and disintegrated. The investigation revealed that a sub-contractor used Imperial English units (pound-seconds) in their calculations, while NASA's main software expected Metric units (Newton-seconds). The software integration testing lacked end-to-end interface checks that validated unit conversions between these two critical subsystem payloads.",
          questions: [
            {
              id: "1.4-cs-q1",
              question: "Which level of testing was critically lacking or bypassed in the NASA orbiter program?",
              choices: [
                "Component Unit Testing",
                "System Integration and Verification Testing (Interface Checking)",
                "Accessibility Testing",
                "User Usability Evaluation"
              ],
              correct: 1,
              explanation: "While individual systems (unit) functioned well in isolation, the interface boundary integration was never properly stress-tested for unit agreement under real integration conditions."
            },
            {
              id: "1.4-cs-q2",
              question: "How could this metric conversion fatal failure have been prevented?",
              choices: [
                "By writing longer codebase instruction manuals.",
                "Mandating interface validation boundary tests and comprehensive verification of data-exchange structures.",
                "Hiring more engineers to manual-inspect each line of code.",
                "Using the spacecraft without any ground software calibrations."
              ],
              correct: 1,
              explanation: "Boundary interface assertions inside integration tests would have caught the mathematical mismatch (e.g., verifying force conversions) instantly."
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    title: "Basics of Testing Fundamentals",
    icon: "Layers",
    description: "Deep dive into SDLC vs STLC, levels of testing, white-box vs black-box methods, and key testing principles.",
    sections: [
      {
        id: "2.1",
        title: "SDLC and Testing Integration",
        content: {
          id: "2.1",
          title: "SDLC and Testing Integration",
          what: "The Software Development Life Cycle (SDLC) defines how applications are conceptualized, built, deployed, and retired. Testing is not a retrospective band-aid slapped on code after it is compiled; it must be integrated into every single phase of the SDLC.",
          whenToUse: "At every step: requirements phase (checking testability), design phase (risk review), coding (unit tests), system execution, and staging (release checks).",
          whyToUse: "Falsely isolating coding from quality creates a 'waterfall trap' where flawed design decisions remain hidden until the absolute end, compounding architectural risk and delaying releases.",
          howToUse: "1. Requirements: Walk through drafts, assessing 'What is testable here?'\n2. Implementation: Build tests alongside component units.\n3. Testing: Perform intense system executions.\n4. Maintenance: Conduct thorough regression sets when introducing new updates.",
          examples: [
            "Requirement Bug: A specification states 'The checkout process must be super fast!' A tester intervenes early, defining it as 'A standard catalog checkout must complete in less than 1.5 seconds under 1,000 user concurrent load.'",
            "Continuous Integration: Building automated test loops on GitHub that compile and test the applet whenever a developer suggests a change."
          ]
        },
        quiz: [
          {
            id: "2.1-q1",
            question: "When should the design of test cases begin in the SDLC?",
            options: [
              "As soon as the requirements phase is finalized.",
              "Only when the developer finishes coding that module.",
              "Immediately during server production deployment.",
              "Whenever customer support reports the first critical outage."
            ],
            correctAnswer: 0,
            explanation: "Designing test cases during requirement analysis exposes logical gaps, ambiguities, and impossible criteria before developers waste time building flawed code."
          }
        ]
      },
      {
        id: "2.2",
        title: "Software Testing Life Cycle (STLC)",
        content: {
          id: "2.2",
          title: "Software Testing Life Cycle (STLC)",
          what: "The Software Testing Life Cycle (STLC) is a highly structured sub-cycle within the SDLC, detailing exact, systematic testing deliverables: Requirement Analysis, Test Planning, Test Case Design, Environment Setup, Test Execution, and Test Cycle Closure/Reporting.",
          whenToUse: "Consistently during every testing sprint or milestone.",
          whyToUse: "Assures tracking accountability, guarantees that no critical user pathways are skipped, and enables clear test-coverage tracking for project stakeholders.",
          howToUse: "1. Requirement Analysis: Outline testable criteria.\n2. Test Planning: Draft goals, risk points, and timelines.\n3. Test Case Design: Document instructions with steps and bounds.\n4. Environment Setup: Stage configurations to mirror the production context.\n5. Test Execution: Execute tests and track defect logs.\n6. Cycle Closure: Review metrics, count bug density, and clean environments.",
          examples: [
            "Deliverable: Creating a Test Summary Report for a billing module release, proving 98% pass rates, zero High-severity bugs open, and full functional coverage of credit transaction cards."
          ]
        },
        matchPairs: [
          { id: "2.2-m1", concept: "Requirement Analysis", description: "Evaluating user stories to identify test boundaries and establish testability." },
          { id: "2.2-m2", concept: "Test Planning", description: "Estimating efforts, defining scope, assessing project risks, and naming tooling paths." },
          { id: "2.2-m3", concept: "Test Execution", description: "Actually executing written test scripts, reporting bugs, and verifying fixes." }
        ]
      },
      {
        id: "2.3",
        title: "Types of Testing: A Deep Dive",
        content: {
          id: "2.3",
          title: "Types of Testing: A Deep Dive",
          what: "Software testing splits into: Functional (verifying *what* the system does against requirements), Non-Functional (assessing *how* well it performs, security gaps, usability, compatibility under load), and Structural (white-box review of logical branches, expressions, and statements).",
          whenToUse: "Functional is always required; Non-Functional is introduced to ensure scaling, resilience, performance, and cross-device security.",
          whyToUse: "An applet can be functional but completely useless if it loads a page in 40 seconds (broken Performance), crashes on Android (broken Compatibility), or leaks credit cards through an API (broken Security).",
          howToUse: "1. Verify standard pathways with Functional unit, integration, and UI tests.\n2. Stress-test systems using non-functional benchmark suites (e.g., simulating 5,000 transactions/sec).\n3. Use static scanners to verify structural integrity.",
          examples: [
            "Functional: Testing if clicking 'Reset Password' correctly emails a reset link to the authenticated buyer.",
            "Non-Functional: Validating that a banking application remains perfectly responsive when throttled to a poor 3G mobile data connection."
          ]
        },
        sortOptions: [
          { id: "2.3-s1", label: "Regression Testing", category: "functional", description: "Verifying existing functions remain secure after updates." },
          { id: "2.3-s2", label: "Load Testing", category: "non-functional", description: "Checking behavior under high concurrent user volumes." },
          { id: "2.3-s3", label: "Statement Coverage", category: "structural", description: "Checking which lines of internal code were executed during a test." },
          { id: "2.3-s4", label: "Penetration Testing", category: "non-functional", description: "Auditing system infrastructure for security vulnerabilities." }
        ]
      },
      {
        id: "2.4",
        title: "Levels of Testing",
        content: {
          id: "2.4",
          title: "Levels of Testing",
          what: "Testing progresses sequentially: Component/Unit Testing (focusing on code blocks in isolation), Integration Testing (verifying flow between systems), System Testing (validating the fully unified application), and Acceptance Testing (proving business readiness to the client).",
          whenToUse: "Always execute in sequence to detect issues early and preserve quick debugging context.",
          whyToUse: "If you jump directly to System Testing without Unit Testing, finding the core reason for a system crash becomes a needles-in-haystacks nightmare. Sequential blocks isolate problems cleanly.",
          howToUse: "1. Developers construct Unit tests for mathematical functions.\n2. Integration tests check API connection calls to Databases.\n3. System QA runs end-to-end user workflows on UI layouts.\n4. Customers run User Acceptance Testing (UAT) to confirm requirements match expectations.",
          examples: [
            "Unit: Testing if function `calculateInvoiceTotal([$10, $5], 0.10)` correctly returns `$16.50`.",
            "Integration: Checking that the user registration API correctly saves a hashed record to PostgreSQL.",
            "System: Clicking buttons on a real staging browser setup to sign in, purchase high-end items, and check the generated invoice PDF."
          ]
        },
        quiz: [
          {
            id: "2.4-q1",
            question: "Why should Component/Unit testing be done before Integration testing?",
            options: [
              "It isolates structural developer bugs early, making integration issues much easier to map and debug.",
              "Unit tests are much more expensive to run than full integration pipelines.",
              "Unit testing doesn't need computer compilations.",
              "It is a legal standard required by GDPR."
            ],
            correctAnswer: 0,
            explanation: "By verifying that each component unit runs correctly in isolation, we can safely assume failures during integration are caused by bad communication interfaces or data-exchange pathways between these components."
          }
        ]
      },
      {
        id: "2.5",
        title: "Testing Methods: Black, White, and Gray-Box",
        content: {
          id: "2.5",
          title: "Testing Methods: Black, White, and Gray-Box",
          what: "Methods are classified by internal structural visibility: Black-box (tester treats system as closed, analyzing inputs vs outputs), White-box (tester has full visibility into the source code, checking statement branches), and Gray-box (tester has partial view, e.g., using API docs and database structures without direct access to internal class files).",
          whenToUse: "Black-box is used for functional system tests; White-box is used for developers' component code testing; Gray-box is optimal for integration, database tracking, and API auditing.",
          whyToUse: "Combining these methods guarantees that both external user interactions (Black-box) and internal logical algorithms (White-box) remain bulletproof.",
          howToUse: "1. White-box: Inspect code flows, execute unit cover scripts.\n2. Black-box: Provide user edge inputs (e.g. invalid text) to form views and assert alerts.\n3. Gray-box: Call APIs directly with invalid structures and query PostgreSQL to verify DB state.",
          examples: [
            "White-box: Writing a test to run every statement inside an nested `if-else` block of code.",
            "Black-box: Entering blank credit numbers on a checkout page and asserting a specific error message."
          ]
        },
        matchPairs: [
          { id: "2.5-m1", concept: "White-Box Testing", description: "Checking code complexity, cyclomatic metrics, and code statement coverage." },
          { id: "2.5-m2", concept: "Black-Box Testing", description: "Verifying behavior purely against user requirements without code visibility." },
          { id: "2.5-m3", concept: "Gray-Box Testing", description: "Using JSON logs, databases, inside schema, and API specs to evaluate integration flow." }
        ]
      },
      {
        id: "2.6",
        title: "Manual vs. Automated Testing",
        content: {
          id: "2.6",
          title: "Manual vs. Automated Testing",
          what: "Manual testing involves actual humans clicking screens, trying weird behaviors, and exploring usability. Automated testing uses software tools & script codes to quickly execute repetitive test suites with near-zero human supervision.",
          whenToUse: "Manual is perfect for Exploratory, creative, Ad-hoc, and Usability testing. Automation is essential for Regression execution, Load testing, and Continuous Integration steps.",
          whyToUse: "Automation is incredibly fast, precise, and consistent. It frees up human QAs from mind-numbingly boring regression steps so they can apply critical, creative human minds to exploratory testing.",
          howToUse: "1. Create structured manual scripts first to stabilize core features.\n2. Automate highly repetitive, stable test flows in Cypress, Playwright, or Selenium.\n3. Keep exploratory testing manual so you can hunt for visual slips, confusing layouts, or fine-grain feel issues.",
          examples: [
            "Exploratory Manual: Playing a new RPG game to see if you can slide through the walls by spamming dodge rolls.",
            "UI Automation: Automating Chrome via Playwright to log in, add products to cart, and check out 100 times after every code commit."
          ]
        },
        quiz: [
          {
            id: "2.6-q1",
            question: "Which scenario is the absolute WORST candidate for test automation?",
            options: [
              "Weekly regression tests of a stable banking login flow.",
              "Usability testing of a brand new, highly artistic customer UI that changes design every day.",
              "Load and stress testing of an API gateway.",
              "Checking user registration across 6 different browser setups."
            ],
            correctAnswer: 1,
            explanation: "An onboarding flow that undergoes active design change and focuses on human feel (usability) is a disastrous choice for automation. Scripting would break constantly, wasting countless hours of maintenance."
          }
        ]
      },
      {
        id: "2.7",
        title: "Testing Principles",
        content: {
          id: "2.7",
          title: "Testing Principles",
          what: "There are 7 fundamental principles of testing:\n1. Testing shows defects, not their absence.\n2. Exhaustive testing is mathematically impossible.\n3. Early testing reduces development risks.\n4. Defect clustering (Pareto 80/20 rule: 80% of bugs live in 20% of modules).\n5. Pesticide Paradox (running same tests won't find new bugs).\n6. Testing is context-dependent.\n7. Absence of Errors Fallacy (a bug-free system is useless if it fails the customer's actual business goals).",
          whenToUse: "To shape all test pipelines, expectations, and management decisions.",
          whyToUse: "Saves projects from overpromising zero defects or wasting millions of dollars trying to test infinite input sequences.",
          howToUse: "1. Prioritize and perform risk-based testing to focus on complex modules.\n2. Shift-left: examine the architecture early.\n3. Vary tests, write exploratory paths, and regularly update automation suites to bypass the pesticide paradox.",
          examples: [
            "Pesticide Paradox: Run the same login regression script weekly. It passes, but the app starts crashing on the profile loading stage. You must write fresh test vectors to capture the new code paths.",
            "Absence of Errors: A team spends 6 months perfecting an offline documentation editor with absolute zero bugs, but fails to realize users only wanted a collaborative real-time editor. The app collapses on release."
          ]
        },
        matchPairs: [
          { id: "2.7-m1", concept: "Defect Clustering", description: "A small number of modules typically hold the vast majority of software defects (80/20 rule)." },
          { id: "2.7-m2", concept: "Pesticide Paradox", description: "If you repeat the same structural tests over and over, they will eventual stop uncovering new bugs." },
          { id: "2.7-m3", concept: "Absence of Errors Fallacy", description: "Proving code conforms to plan is completely moot if the product does not satisfy real user needs." }
        ]
      },
      {
        id: "2.8",
        title: "Testing Psychology",
        content: {
          id: "2.8",
          title: "Testing Psychology",
          what: "Testing requires understanding psychological biases. Confirmation Bias drives people to prove their creations run perfectly, ignoring contradictions. Testing requires a destructive yet constructive mental state: thinking critically to hunt for flaws, paired with extreme collaborative communication to help developers fix them without taking it personally.",
          whenToUse: "Whenever reviewing requirements, reporting painful bug logs, or holding retrospective debates with developers.",
          whyToUse: "An aggressive or tactless tester creates cross-team defensive friction, turning bug reports into personal attacks. High emotional maturity builds cooperative, top-quality software faster.",
          howToUse: "1. Approach code with collaborative curiosity, not personal blame.\n2. Begin bug logs with cold, reproducible facts: Expected vs Actual, and steps.\n3. Emphasize that quality is a shared victory, not an us-vs-them contest.",
          examples: [
            "Good Communication: 'Reproduction trace: Clicking cart items from mobile leads to a blank catalog container. Steps inside...' (Neutral, clear)",
            "Bad Communication: 'Your checkout module is completely broken and unusable. Please rewrite it!' (Aggressive, unhelpful, personal)"
          ]
        },
        quiz: [
          {
            id: "2.8-q1",
            question: "How should a tester overcome confirmation bias?",
            options: [
              "By assuming code is always carrying hidden issues and asking 'How can I break this?' rather than 'How does this work?'",
              "By hoping the developer made no mistakes during sprints.",
              "By asking the product owner to write all code reviews.",
              "By writing code that only tests valid, positive inputs."
            ],
            correctAnswer: 0,
            explanation: "Overcoming confirmation bias involves deliberate destructive thinking: formulating negative inputs, boundary violations, and stress conditions ('How can I bring this module down?')."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Test Design Techniques",
    icon: "Sliders",
    description: "Learn Boundary Value Analysis, Equivalence Partitioning, State Transitions, and Decision Tables.",
    sections: [
      {
        id: "3.1",
        title: "Equivalence Partitioning (EP)",
        content: {
          id: "3.1",
          title: "Equivalence Partitioning (EP)",
          what: "Equivalence Partitioning is a black-box test design technique that divides the input domain into classes of data from which test cases can be derived. It assumes that if one element in a partition passes, all other elements in that identical partition will also behave exactly the same way.",
          whenToUse: "When dealing with massive or infinite input data arrays (e.g. numeric ranges, text fields).",
          whyToUse: "Decreases testing cycles by eliminating duplicate tests, and ensures a balanced validation of valid and invalid scenarios.",
          howToUse: "1. Analyze requirements to list accepted and rejected boundaries.\n2. Divide input possibilities into closed partitions (e.g., negative integers, valid child age, invalid elderly age).\n3. Pick exactly one single value from each partition to serve as your test input.",
          examples: [
            "Scenario: An age entry input accepting values between 18 and 60. Your partitions: Underage (0-17, invalid), Working Age (18-60, valid), and Retired (61+, invalid). Select just three test values: 10, 35, and 75."
          ]
        },
        quiz: [
          {
            id: "3.1-q1",
            question: "If a field accepts a password from 8 to 16 characters, what are the Equivalence Partitions?",
            options: [
              "Too short (<8 chars), Valid length (8-16 chars), and Too long (>16 chars).",
              "Only odd numbers and even numbers.",
              "Every password from 8 to 16 characters requires unique partitions.",
              "Uppercase letters only."
            ],
            correctAnswer: 0,
            explanation: "We classify inputs into three sets relative to criteria boundaries: the invalid under-range (<8), valid middle range (8-16), and invalid over-range (>16)."
          }
        ]
      },
      {
        id: "3.2",
        title: "Boundary Value Analysis (BVA)",
        content: {
          id: "3.2",
          title: "Boundary Value Analysis (BVA)",
          what: "Boundary Value Analysis is a test design technique that complements Equivalence Partitioning. It focuses on testing the very edges of partitions, as errors are highly concentrated at the boundaries of input ranges (e.g., using '<' instead of '<=' in code loops).",
          whenToUse: "Directly alongside Equivalence Partitioning, whenever ranges have numeric limits.",
          whyToUse: "Coders routinely make off-by-one errors in logical operators. BVA isolates these logical slips.",
          howToUse: "Test values at the exact boundary, immediately below the boundary, and immediately above the boundary (e.g., min-1, min, min+1, max-1, max, max+1).",
          examples: [
            "Scenario: A text field accepting 10 to 20 characters. Boundary test values: 9 (invalid boundary-1), 10 (valid min), 11 (valid min+1), 19 (valid max-1), 20 (valid max), 21 (invalid max+1)."
          ]
        },
        quiz: [
          {
            id: "3.2-q1",
            question: "A shopping cart gives free delivery for orders of $50 or more. Which boundary values should you test?",
            options: [
              "$50 only",
              "$10, $50, $1000",
              "$49.99, $50.00, and $50.01",
              "Negative values only"
            ],
            correctAnswer: 2,
            explanation: "Testing $49.99 (invalid free delivery edge), $50.00 (exact active transition edge), and $50.01 (valid free delivery edge) targets the off-by-one logical thresholds perfectly."
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Practical Skills Workspace",
    icon: "Terminal",
    description: "Write structured test cases, discover issues in active code sandboxes, and compile complete bug reports.",
    sections: [
      {
        id: "4.1",
        title: "Designing Quality Test Cases",
        content: {
          id: "4.1",
          title: "Designing Quality Test Cases",
          what: "A test case is a structured document detailing a title, prerequisites, step-by-step actions, test parameters, and expected results. It ensures test consistency across different executors and serves as evidence of compliance.",
          whenToUse: "During the STLC Test Case Design phase, ready for execution.",
          whyToUse: "Clear documentation prevents testers from skipping steps, ensures tests are reproducible, and provides a clear record of what was validated.",
          howToUse: "1. Write clear, action-oriented steps.\n2. State any pre-conditions (e.g., user is logged in).\n3. Keep test steps brief and atomic.\n4. Ensure the expected result is unambiguous and has concrete pass/fail criteria.",
          examples: [
            "Template:\nID: TC001\nTitle: Verify purchase with valid credit card\nSteps:\n1. Log in with user credentials\n2. Add item to cart\n3. Proceed to checkout\n4. Enter card: 4111... \nExpected: Order is confirmed, database updates state."
          ]
        },
        quiz: [
          {
            id: "4.1-q1",
            question: "What is the key quality of an effective expected result in a test case?",
            options: [
              "It should say 'The application works super smoothly.'",
              "It must be specific, objective, and easily verified (e.g. 'Redirects to /dashboard and displays the balance: $100.00').",
              "It should match whatever the developer coded during the sprint.",
              "It is optional and can be left blank."
            ],
            correctAnswer: 1,
            explanation: "Expected results must be concrete and measurable. Vague terms like 'works smoothly' or 'looks good' invite subjective assessment and bad quality outcomes."
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Testing Methodologies",
    icon: "Users",
    description: "Understand Agile Scrum cycles, testing in DevOps, CI/CD pipelines, and the classical V-Model.",
    sections: [
      {
        id: "5.1",
        title: "Agile Scrum and DevOps Quality",
        content: {
          id: "5.1",
          title: "Agile Scrum and DevOps Quality",
          what: "In Agile methodology, software is built in iterative chunks (Sprints). Testing is continuous and integrated, rather than a final gate. In DevOps, this is automated via continuous integration and continuous deployment (CI/CD) pipelines, triggering automated regressions on every system check-in.",
          whenToUse: "High-scale, fast-paced modern software engineering operations.",
          whyToUse: "Allows teams to ship features continuously and catch errors quickly, rather than waiting for months-long release cycles.",
          howToUse: "1. QA teams collaborate on user story definition.\n2. Write test scripts alongside developer commits.\n3. Integrate automation suites directly into CI/CD builds.\n4. Run high-impact regression tests automatically on push.",
          examples: [
            "DevOps: A developer pushes a bug fix to GitHub. A automated build is triggered, executing 400 unit tests. If any fail, the build fails instantly, notifying the developer within minutes."
          ]
        },
        quiz: [
          {
            id: "5.1-q1",
            question: "What is the key objective of Continuous Integration (CI) in relation to testing?",
            options: [
              "To remove the need for human QA specialists.",
              "To automatically compile code and run developer test suites as soon as code changes are pushed.",
              "To compile extensive billing documents for client review.",
              "To deploy code directly to live production without any review gates."
            ],
            correctAnswer: 1,
            explanation: "Continuous Integration compiles code and immediately runs test suites on server branches whenever a coder makes changes, detecting integration problems as early as possible."
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Basics of Test Automation",
    icon: "Cpu",
    description: "Introduction to Selenium, Puppeteer, cypress testing, and how to write clear automated tests to verify code behaviors.",
    sections: [
      {
        id: "6.1",
        title: "Writing Automated UI Scripts",
        content: {
          id: "6.1",
          title: "Writing Automated UI Scripts",
          what: "Test automation uses code scripts to control testing tools, programmatically perform browser actions (like typing usernames and clicking buttons), and assert that DOM elements display correct content, bypassing human manual errors.",
          whenToUse: "For repetitive regression testing and high-load API performance monitoring.",
          whyToUse: "Saves massive resource expenditures on regression cycles, ensures absolute precision, and gives instant quality reports across browsers.",
          howToUse: "1. Locate elements using stable classes, IDs, or data attributes.\n2. Script page navigations and element interactions.\n3. Assert that target elements exist or display expected states.\n4. Clean up mock database records created during test runs.",
          examples: [
            "Cypress Example:\ncy.visit('/login');\ncy.get('#email').type('user@test.com');\ncy.get('#pwd').type('securitas');\ncy.get('#submit').click();\ncy.url().should('include', '/dashboard');"
          ]
        },
        quiz: [
          {
            id: "6.1-q1",
            question: "Which of the following offers the most stable and resilient DOM element selector for UI automation?",
            options: [
              "Using absolute XPath positions (e.g. /html/body/div[1]/div[2]/p[1]/span)",
              "Using a custom mock automated data selector like data-testid='login-submit'",
              "Using generic class colors like '.bg-blue-600'",
              "The text contents of the element"
            ],
            correctAnswer: 1,
            explanation: "Relying on absolute XPaths or CSS styles makes test scripts incredibly fragile. A minor layout rewrite breaks them instantly. Using dedicated `data-testid` attributes ensures selectors remain stable regardless of style changes."
          }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Testing in Different Domains",
    icon: "ShieldAlert",
    description: "Healthcare HIPAA validations, Financial security, high-scale E-Commerce spikes, and high-concurrency multiplayer Gaming latencies.",
    sections: [
      {
        id: "7.1",
        title: "Domain Specific testing strategies",
        content: {
          id: "7.1",
          title: "Domain Specific testing strategies",
          what: "Each business sector has unique testing priorities:\n- **E-Commerce**: Demands focus on high peak usability, load spikes (e.g., Black Friday), and secure payment flows.\n- **Healthcare**: Demands high safety standards, exact measurements, HIPAA privacy compliance, and FDA regulations.\n- **Finance**: Demands bulletproof encryption, compliance (PCI-DSS), absolute ACID consistency, and pen testing against SQL Injections.\n- **Gaming**: Prioritizes game balancing, device compatibility, asset clipping, frame rate stability, and player network sync.",
          whenToUse: "When compiling distinct Test Plans tailored to particular target industries.",
          whyToUse: "A failure in patient medical diagnostics demands infinitely stricter validation than a minor UI color glitch on an e-commerce shop.",
          howToUse: "1. Identify critical domain regulations (e.g., HIPPA, ISO).\n2. Plan custom performance and safety thresholds (e.g., concurrency, data retention).\n3. Match test coverage directly to risk-prone areas.",
          examples: [
            "Healthcare: Safety-testing pediatric dose formulas to ensure zero system rounding errors occur.",
            "Finance: Verifying transactional absolute ACID properties (Atomicity, Consistency, Isolation, Durability) during heavy bank transfer loads."
          ]
        },
        quiz: [
          {
            id: "7.1-q1",
            question: "What is the primary technical priority when testing a high-scale e-commerce platform?",
            options: [
              "Verifying visual background game animations.",
              "Ensuring full compliance with life-support machine safety algorithms.",
              "Load stability during extreme traffic bursts (e.g., flash sales) and zero-fault credit transactions.",
              "Checking compliance metrics regarding therapeutic medicine dose caps."
            ],
            correctAnswer: 2,
            explanation: "E-Commerce applications must remain stable under sudden massive spikes in customer traffic while accurately keeping inventory and payments synced."
          }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Test Planning and Documentation",
    icon: "FileText",
    description: "Write professional Test Plans, build requirement traceability matrix, and master detailed Bug Reports.",
    sections: [
      {
        id: "8.1",
        title: "Test Documentation Frameworks",
        content: {
          id: "8.1",
          title: "Test Documentation Frameworks",
          what: "Professional testing relies on structured documentation. Key files include are:\n- **Test Plan**: Highlights scope, schedule, resources, tools, environment specs, and disaster mitigation strategies.\n- **Traceability Matrix (RTM)**: Bridges core Requirements directly to corresponding Test Cases, proving 100% of feature requirements have been validated.\n- **Bug Report**: Documents an active system defect in clear terms.",
          whenToUse: "Mandatory at the launch, execution, and wrap-up of every structured code cycle.",
          whyToUse: "Without documentation, testing turns into chaotic exploratory chaos with zero tracking accountability, missing critical requirements.",
          howToUse: "1. Define scope and resources in a formal Test Plan.\n2. Map every product requirement to corresponding Test Cases in an RTM.\n3. File structured bug tickets (Prerequisites, Steps, Expected, Actual, Severity) when tests fail.",
          examples: [
            "Bug Report Sample:\nID: BUG-804\nTitle: Checkout crashes with empty discount input\nSteps: Add item, enter blank space as discount, click apply.\nExpected: Displays error 'Invalid discount code'\nActual: Thread crash with HTTP 500 error."
          ]
        },
        quiz: [
          {
            id: "8.1-q1",
            question: "What is the primary role of a Requirement Traceability Matrix (RTM)?",
            options: [
              "To calculate average developer payroll rates.",
              "To map every business requirement directly to corresponding test cases, proving complete coverage.",
              "To automate the generation of system code builds on Git.",
              "To check CSS styling layouts."
            ],
            correctAnswer: 1,
            explanation: "An RTM maps requirements directly to test cases to guarantee that all specified customer features have corresponding tests, leaving no gaps."
          }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Test Metrics and Reporting",
    icon: "BarChart3",
    description: "Understand Defect Density, test coverage, defect severity vs priority, and how to build high-level QA cycles reports.",
    sections: [
      {
        id: "9.1",
        title: "Quantitative Test Metrics",
        content: {
          id: "9.1",
          title: "Quantitative Test Metrics",
          what: "Decisions in QA must be driven by data. Key metrics include:\n- **Defect Density**: Number of confirmed bugs divided by codebase size (e.g., KLOC: Thousands of Lines of Code).\n- **Test Coverage**: Percentage of features or lines tested.\n- **Defect Severity**: Technical impact of a bugs on operations (e.g. Blocker, Major, Minor).\n- **Defect Priority**: Commercial urgency of fixing a bug (e.g., High, Medium, Low).",
          whenToUse: "During sprint wrap-up reviews and sign-off phases to judge when code is ready to ship.",
          whyToUse: "Objective metrics remove guesswork. They prove mathematically whether product quality is improving or worsening over code sprints.",
          howToUse: "1. Track exact counts of executed, passed, and failed test cases.\n2. Track defect categories, profiling their severity and priority.\n3. Visualize patterns: high bug density in a single module points directly to defect clustering.\n4. Make release decisions based on metric gates.",
          examples: [
            "Severity vs Priority Paradox: A company's logo is completely upside down on the home landing page. The **Severity** is low (no system code is broken), but the **Priority** is ultra-high (it looks unprofessional and must be corrected immediately)."
          ]
        },
        quiz: [
          {
            id: "9.1-q1",
            question: "Explain the classic difference of 'Bug Severity' vs 'Bug Priority'.",
            options: [
              "Severity is technical impact on software; Priority is business urgency of the fix.",
              "Severity is judged by developers; Priority is judged purely by users.",
              "Severity issues cost more to fix than Priority issues.",
              "They mean the exact same thing."
            ],
            correctAnswer: 0,
            explanation: "Severity measures technical impact (e.g., system crash is High Severity). Priority tracks delivery urgency (e.g., a spelling mistake on the login page has Low Severity, but High Priority to avoid looking unprofessional)."
          }
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Career in Software Testing",
    icon: "Award",
    description: "Explore career pathways (QA Automation, SDET, Lead, Architect), certifications (ISTQB), and practice mock interview rounds.",
    sections: [
      {
        id: "10.1",
        title: "Career Path and Skills Prep",
        content: {
          id: "10.1",
          title: "Career Path and Skills Prep",
          what: "Software quality offers multiple tracks:\n1. **Manual / Functional QA**: Specializes in business processes, user perspective, and exploration.\n2. **Automation QA Engineer**: Codes automated UI and API regressions.\n3. **SDET (Software Development Engineer in Test)**: Standard engineer who writes specialized frameworks, tools, and mock services.\n4. **QA Lead / Manager**: Directs teams and designs governance strategies.\n5. **Test Architect**: Designs enterprise-grade test automation strategy. certifications paths typically start with the ISTQB Foundation Level (FL).",
          whenToUse: "When planning your testing career, resume layout, or prep for certification exams.",
          whyToUse: "Gives clear structure to self-development efforts, preventing engineers from being stuck in repetitive manual steps and helping them grow into highly paid technical tracks.",
          howToUse: "1. Assess current engineering skills, identify gaps (automation, scripting, DB).\n2. Study ISTQB textbooks for standardized testing taxonomy.\n3. Build portfolio sandboxes showing real API and UI automated scripts on GitHub.\n4. Master core database SQL statements and script architectures.",
          examples: [
            "SDET Goal: Writing a containerized, mock mock-payment gateway to allow complete sandbox testing of API checkouts without calling real payment vendors during unit builds."
          ]
        },
        quiz: [
          {
            id: "10.1-q1",
            question: "What does the standard title 'SDET' stand for, and what is their main role?",
            options: [
              "Software Development Engineer in Test; writes test automation frameworks, tooling, and system infrastructure.",
              "Static Data Engineering Technician; cleans database environments.",
              "Software Deployment and Execution Trainer; manages student schedules.",
              "System Design Evaluation Specialist; reviews mockups."
            ],
            correctAnswer: 0,
            explanation: "SDET stands for Software Development Engineer in Test. They are developers who focus on quality engineering, creating advanced test infrastructure, custom libraries, run hooks, and mock servers."
          }
        ]
      }
    ]
  },
  {
    id: 11,
    title: "2026 Trends: AI in Software Testing",
    icon: "Brain",
    description: "Explore AI-augmented test generation, self-healing automated scripts, low-code testing suites, and ethical guidelines for testing AI itself.",
    sections: [
      {
        id: "11.1",
        title: "AI-Augmented & Low-Code Testing",
        content: {
          id: "11.1",
          title: "AI-Augmented & Low-Code Testing",
          what: "AI-augmented testing uses machine learning and Large Language Models (LLMs) to automatically generate test cases, write automated script assertions, and self-heal broken selectors in response to DOM changes. Low-code testing tools (Testim, Applitools, Tricentis Tosca) utilize these neural heuristics to permit visual drag-and-drop orchestration without typing standard code files.",
          whenToUse: "To accelerate QA development velocity (reducing creation time by 5x), automate visual regressions, and minimize framework maintaining overhead.",
          whyToUse: "Traditional locator strategies (XPath/CSS selectors) frequently break ('flaky tests') during standard modern front-end updates. AI self-healing locates mutated elements, lowering test suite maintenance by 70%.",
          howToUse: "1. Integrate low-code web testing recorders to map basic login flows.\n2. Configure self-healing smart selectors to adapt to dynamic ID changes.\n3. Implement visual-regression scans (e.g. Applitools AI) to verify layout anomalies across various view sizes.",
          examples: [
            "Self-Healing: A code update changes a button ID from 'checkout-btn' to 'buy-now-cta'. An AI-based test tool identifies the button's spatial context and visual icon, bypassing the broken select statement and passing the automated run.",
            "Visual AI: Catching a cropped text overflow bug that visualizes fine on standard desktops but is unreadable on narrow 320px viewports."
          ],
          analogy: "An automated self-guided vacuum pathing through a remodeled living room; it seamlessly navigates around a newly placed chair instead of stalling continuously against it.",
          role: "AI Test Automation Architect"
        },
        quiz: [
          {
            id: "11.1-q1",
            question: "What is the core purpose of 'self-healing' in automated testing?",
            options: [
              "To automatically fix security holes in developer source code.",
              "To dynamically find alternative DOM selectors when an element's ID or class changes under testing.",
              "To clear background logs and refresh standard virtual test nodes.",
              "To rewrite test structures from TypeScript to Python automatically."
            ],
            correctAnswer: 1,
            explanation: "Self-healing algorithms adaptively analyze element attributes and contextual visual features when primary target properties fail, bypassing static locator failures."
          }
        ]
      },
      {
        id: "11.2",
        title: "Ethical AI Testing & Model Verification",
        content: {
          id: "11.2",
          title: "Ethical AI Testing & Model Verification",
          what: "Ethical AI Testing involves evaluating underlying neural networks and AI models for algorithmic bias, social fairness, privacy compliance, and model robustness. Unlike classical code that outputs specific boolean values, ML models output soft probabilities, requiring statistical distribution audits and bias injection testing.",
          whenToUse: "When verifying machine-learning algorithms used in financial loan scoring, healthcare diagnoses, recruitment screening, or automated moderation.",
          whyToUse: "Protects corporations from massive compliance fines, mitigates legal liability for discriminatory choices, and ensures AI software functions safely across diverse user cohorts.",
          howToUse: "1. Perform adversarial bias testing using diverse mock cohorts.\n2. Leverage open-source fair auditing libraries (IBM AI Fairness 360, Google's What-If Tool).\n3. Audit boundaries for 'toxic' or hallucinations outputs in LLM integrations.",
          examples: [
            "Social Bias: Auditing an automated hiring AI parser to confirm that changing a candidate's name or gender indicator does not mathematically shift their compatibility rating score.",
            "Model Robustness: Intentionally feeding scrambled, perturbed input data to verify whether a computer-vision safety model maintains its stop-sign recognition criteria."
          ],
          analogy: "Checking a scale to make sure it doesn't always read heavier for certain items due to calibration errors, ensuring fair measurements across all variables.",
          role: "Ethical AI Auditor"
        },
        quiz: [
          {
            id: "11.2-q1",
            question: "Why is verifying an AI model distinct from verifying classical procedural software?",
            options: [
              "AI code does not execute inside web browsers.",
              "AI models output probabilistic scores based weights, rather than deterministic true/false values based on static if-else statements.",
              "Classical software has no security boundaries.",
              "AI models do not require any input parameters."
            ],
            correctAnswer: 1,
            explanation: "Because models are probabilistic, testing focuses on statistical distributions, score ranges, and adversarial stress-testing rather than simple hardcoded expected results."
          }
        ]
      }
    ]
  },
  {
    id: 12,
    title: "2026 Trends: Cloud-Native & Shift-Right Testing",
    icon: "Cloud",
    description: "Master modern shift-right production monitoring, chaos engineering, Kubernetes resilience, smart contract audits, and emerging virtual testing guidelines.",
    sections: [
      {
        id: "12.1",
        title: "Shift-Right, Observability & Chaos QA",
        content: {
          id: "12.1",
          title: "Shift-Right, Observability & Chaos QA",
          what: "Shift-Right Testing is the practice of conducting testing, monitoring, and quality evaluation in actual production environments under real organic user flows. This leverages observability metrics (telemetry logs, request traces, network spikes viz Datadog/New Relic) and Chaos Engineering (e.g. intentionally disabling servers to verify auto-rescaling resilience).",
          whenToUse: "For high-scale cloud-native platforms with high developer deployment cadences where static testing in staging environments cannot represent real-world scale.",
          whyToUse: "Pre-production builds cannot fully simulate organic user chaotic activities, edge networking lags, third-party carrier drops, or true database write stresses.",
          howToUse: "1. Configure system synthetic loops to simulate transaction paths continuously inside live instances.\n2. Inject chaos metrics (e.g., shutting down a microservice) to verify container self-healing.\n3. Analyze latency graphs to flag early indicators of database lock cycles.",
          examples: [
            "Chaos Injection: Using a tool like Gremlin to disable a secondary cache server during a simulated sales rush to prove that orders successfully redirect directly to raw SQL databases without throwing visible site errors.",
            "Synthetic Testing: Running a headless browser script once every 5 minutes in production to execute a $0.01 checkout, ensuring the full credit gateway remains functional for customers."
          ],
          analogy: "Checking a water dam's safety by monitoring live river flows during monsoon season, rather than just testing a concrete sample in a vacuum laboratory.",
          role: "Cloud-Native Observability Engineer"
        },
        quiz: [
          {
            id: "12.1-q1",
            question: "What are the core focus pillars of Shift-Right Quality Assurance?",
            options: [
              "Conducting visual reviews on initial wireframes during planning.",
              "Testing, monitoring, and validating reliability directly and continuously inside active production instances.",
              "Drafting comprehensive manual documentation blocks before coding.",
              "Compiling typescript files to native device binary formats."
            ],
            correctAnswer: 1,
            explanation: "Shift-right extends testing past standard staging releases directly into live operations using continuous synthetic tests, log analytics, audits, and chaos engineering."
          }
        ]
      },
      {
        id: "12.2",
        title: "Decentralized, Emerging & Quantum Testing",
        content: {
          id: "12.2",
          title: "Decentralized, Emerging & Quantum Testing",
          what: "2026 marks the rise of testing for decentralized systems (blockchain smart contracts written in Solidity) and emerging immersive metaverse contexts. Additionally, Quantum Computing testing introduces validations for Qiskit quantum algorithms to prove gate execution probabilistic bounds.",
          whenToUse: "Required when building smart contracts on blockchain networks, deploying immersive AR/VR applications, or verifying quantum-based optimization runs.",
          whyToUse: "Once deployed, smart contracts are completely immutable and cannot be patched. A bug represents complete, irreversible financial theft or loss of project assets.",
          howToUse: "1. Utilize static analysis tooling (MythX, Slither) to scan Solidity code for reentrancy bugs.\n2. Test immersive software with the Unity Test Framework to scan for visual frame drops and render clipping.\n3. Formulate gate-level calculations to verify quantum outputs are within correct margins.",
          examples: [
            "DeFi Reentrancy: Testing an online smart-contract bank to confirm that a nested contract callback cannot withdraw capital multiple times before the balance state ledger is written.",
            "Metaverse Render check: Verifying that an AR target marker renders correctly under varying indoor lighting simulations inside Unity environments."
          ],
          analogy: "A notary drafting an unchangeable legal deed that must be absolutely flawless, because once recorded, it can never be rewritten or modified.",
          role: "Emerging Tech / Smart Contract Auditor"
        },
        quiz: [
          {
            id: "12.2-q1",
            question: "Why is smart contract testing uniquely high-stakes in commercial applications?",
            options: [
              "Smart contracts require high graphics memory cards of hardware.",
              "Smart contracts are deployed to immutable blockchain state engines where bugs cannot be patched post-release, creating total financial risk.",
              "They can only run on quantum processors.",
              "They are written in standard HTML."
            ],
            correctAnswer: 1,
            explanation: "Smart contracts are completely immutable post-release on the blockchain, so a defect is irreversible and cannot be patched like normal server applications."
          }
        ]
      }
    ]
  }
];

export const mockInterviewQuestions = [
  {
    id: "int-1",
    role: "Manual QA Tester",
    question: "How would you prioritize test cases if you have strict time limits and cannot run your entire test suite before a sudden release?",
    hint: "Identify critical business pathways. Apply Risk-Based Testing. Prioritize high-impact features (like payments and core signups) and critical user-persona pathways."
  },
  {
    id: "int-2",
    role: "Automation QA Engineer",
    question: "What is your strategy to resolve and prevent 'flaky' automated tests that pass in local workspaces but periodically fail in continuous integration (CI) builds?",
    hint: "Avoid fixed Thread.sleep() delays. Rely on explicit dynamic element waits (Fluent WAITS). Verify DOM state, inspect backend test environment scaling, and isolate test data."
  },
  {
    id: "int-3",
    role: "SDET / Tech Lead",
    question: "How do you test an API endpoint that communicates with a third-party payment system that bills money for each transaction call?",
    hint: "Do not call the real payment processor in test suites. Build a Mock sandboxed payment service. Use API stubs to intercept and verify outgoing message payloads."
  },
  {
    id: "int-4",
    role: "QA Manager / Lead",
    question: "A critical customer-facing bug bypassed testing and caused a production crash. What immediate steps do you take as a QA Lead once the incident is resolved?",
    hint: "Avoid blaming developers. Arrange a blameless post-mortem review. Trace why the test suite missed the bug, and add a regression test targeting that specific edge condition."
  }
];
