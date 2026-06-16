import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, HelpCircle, Trophy, Sparkles, RefreshCw, ArrowRight, ShieldCheck, Star, Award } from "lucide-react";
import { QuizQuestion, UserProgress } from "../types";

// Curated list of high-quality fallback questions for all 10 modules
const COMPREHENSIVE_MODULE_QUZZES: { [moduleId: number]: QuizQuestion[] } = {
  1: [
    {
      id: "m1-f1",
      question: "Which of the following describes the cost-escalation of fixing software defects as they move from requirements to production?",
      options: [
        "It increases linearly.",
        "It remains constant.",
        "It increases exponentially.",
        "It decreases once the code is in production."
      ],
      correctAnswer: 2,
      explanation: "The cost to patch a defect increases exponentially because fixing a bug in production requires hotfixes, extensive regression verification, customer support deployment, and carries high risk of business/brand damage."
    },
    {
      id: "m1-f2",
      question: "What is the primary objective of software verification?",
      options: [
        "Ensuring the overall product satisfies final user expectations.",
        "Ensuring the product conforms to specified technical requirements and design specifications.",
        "Executing automated tests exclusively in a live production sandbox.",
        "Replacing manual exploratory testing completely."
      ],
      correctAnswer: 1,
      explanation: "Verification stands for 'Did we build the system right?' check-marking compliance with internal technical specs and design rules, while validation asks 'Did we build the right system?'."
    },
    {
      id: "m1-f3",
      question: "A professional software tester's primary mindset is best described as:",
      options: [
        "Assuming the developer's build is clean until the application crashes.",
        "Skeptical, meticulous, and analytical — assuming hidden defects are always present.",
        "Focusing purely on testing positive boundaries where things work.",
        "Writing test configurations without analyzing original requirements."
      ],
      correctAnswer: 1,
      explanation: "Quality advocates require an independent, skeptical, and analytical mindset. They actively challenge software under stressful inputs to uncover hidden failures before users do."
    }
  ],
  2: [
    {
      id: "m2-f1",
      question: "In which software testing level are individual units, variables, or functions tested in complete isolation?",
      options: [
        "System Testing",
        "Integration Testing",
        "Unit Testing",
        "Acceptance Testing"
      ],
      correctAnswer: 2,
      explanation: "Unit testing verifies that individual functions, utility modules, or components work securely in isolation. This is typically coded and executed by developers."
    },
    {
      id: "m2-f2",
      question: "What does the STLC stand for, and what role does it play alongside the SDLC?",
      options: [
        "Simple Testing Linkage Code; runs only during emergency releases.",
        "Software Testing Life Cycle; a systematic series of phases (analysis, planning, design, execution) to govern software quality in alignment with the SDLC.",
        "Server Trial Log Collection; handles hardware network validation.",
        "Storage Transmission Limit Control; restricts payload sizing."
      ],
      correctAnswer: 1,
      explanation: "The Software Testing Life Cycle (STLC) is a dedicated sub-cycle with clear inputs, entry/exit criteria, and deliverables running in parallel with the principal Software Development Life Cycle (SDLC)."
    },
    {
      id: "m2-f3",
      question: "Which core testing principle is represented by the statement: 'No amount of successful testing can prove that software is absolutely defect-free'?",
      options: [
        "The Pesticide Paradox",
        "Defect Clustering",
        "Absence-of-errors Fallacy",
        "Testing shows the presence of defects"
      ],
      correctAnswer: 3,
      explanation: "We conduct testing to reveal flaws; however, because we cannot test all conceivable inputs, paths, and environment combinations, testing can never guarantee 100% bug-free status."
    }
  ],
  3: [
    {
      id: "m3-f1",
      question: "What is the primary benefit of Equivalence Partitioning (EP)?",
      options: [
        "It guarantees 100% branch and path statement coverage.",
        "It segments input values into partitions that the system processes identically, significantly reducing test redundancy.",
        "It executes every single potential input variable sequentially.",
        "It automatically writes cypress test cases."
      ],
      correctAnswer: 1,
      explanation: "Equivalence Partitioning divides the input domain into classes where the software displays similar behavior, allowing testers to select just one parameter from each group to evaluate performance."
    },
    {
      id: "m3-f2",
      question: "If a postal code text field accepts a password of length 8 to 16 characters, what are the precise test limits using Boundary Value Analysis (BVA)?",
      options: [
        "0, 8, 16, and 24 characters",
        "7, 8, 16, and 17 characters",
        "1, 8, 16, and 32 characters",
        "8, 12, and 16 characters"
      ],
      correctAnswer: 1,
      explanation: "BVA focuses on values directly on and adjacent to the borders of partitions: just-below minimum (7), minimum (8), maximum (16), and just-above maximum (17)."
    },
    {
      id: "m3-f3",
      question: "Which of the following is a structural (white-box) test design technique?",
      options: [
        "State Transition Testing",
        "Equivalence Partitioning",
        "Statement and Branch Code Coverage",
        "Decision Table Matrix Testing"
      ],
      correctAnswer: 2,
      explanation: "Statement and branch coverages analyze the exact implementation details, control branches, and execution paths inside the compiled source code, which defines White-Box testing."
    }
  ],
  4: [
    {
      id: "m4-f1",
      question: "Which elements are absolutely essential for drafting a clear, high-quality, and actionable defect (bug) report?",
      options: [
        "Only the ticket title and the tester's profile avatar.",
        "Steps to reproduce, expected vs. actual results, severity/priority, and system logs/attachments.",
        "A brief screenshot with an arbitrary error comment like 'it crashed'.",
        "The full application source directory as an attachment."
      ],
      correctAnswer: 1,
      explanation: "An actionable defect report must provide the developer with step-by-step reproduction guidelines, direct comparisons of what happened vs. what should have occurred, and technical environment data."
    },
    {
      id: "m4-f2",
      question: "What is the key purpose of formulating explicit 'Test Cases' instead of relying solely on exploratory tests?",
      options: [
        "To satisfy administrative audits and compile static documents.",
        "To establish structured, repeatable, and traceable steps to prove compliance with specified requirements.",
        "To make automated integration scripts obsolete.",
        "To help marketing teams write product brochures."
      ],
      correctAnswer: 1,
      explanation: "Written test cases provide systemic structure, allowing multiple people to execute identical validations reliably, ensuring audit traceability, and mapping coverage directly to product specs."
    }
  ],
  5: [
    {
      id: "m5-f1",
      question: "In an Agile Scrum framework, what is the core focus of the Daily Standup?",
      options: [
        "Conducting an extended coding session for nested functions.",
        "A brief, time-boxed sync to align team progress on yesterday's work, today's targets, and flag roadblocks.",
        "A detailed review of system architecture changes.",
        "A formal demonstration of manual regression results."
      ],
      correctAnswer: 1,
      explanation: "Daily Standups are restricted to 15 minutes, serving purely as a collaborative pulse-check to promote continuous alignment and resolve workspace roadblocks."
    },
    {
      id: "m5-f2",
      question: "What is Continuous Integration (CI) and how does it safeguard quality during sprints?",
      options: [
        "A code merge process occurring only at the end of a quarterly release cycle.",
        "An automation practice that merges and builds code frequently, instantly running unit/integration suites to find regressions.",
        "A pipeline tool to auto-generate database user profiles.",
        "A method where testers manually inspect developer screens."
      ],
      correctAnswer: 1,
      explanation: "CI automatically compiles and runs regression suites on new modifications immediately, providing early and inexpensive validation that keeps master branches deployment-ready."
    }
  ],
  6: [
    {
      id: "m6-f1",
      question: "What is the primary return on investment (ROI) for writing automated UI tests?",
      options: [
        "Eliminating manual exploratory testers entirely.",
        "Accelerating repetitive regression cycles, verifying stable code blocks, and enabling fast feedback during CI.",
        "Predicting visual aesthetics of the application.",
        "Replacing the need to evaluate business specifications."
      ],
      correctAnswer: 1,
      explanation: "Automation is a major force multiplier that offloads repetitive, deterministic, and highly time-consuming checking processes so humans can spend high-value energy on complex explorative bugs."
    },
    {
      id: "m6-f2",
      question: "When is manual exploratory testing preferred over automated scripting?",
      options: [
        "When running 1,000 load-testing threads concurrently.",
        "During early feature prototyping, evaluating usability aesthetics, exploring ad-hoc edges, and when cognitive flexibility is needed.",
        "When performing routine math calculation audits on stable fields.",
        "Never; automation is always superior for every testing task."
      ],
      correctAnswer: 1,
      explanation: "Exploratory manual testing leverages human cognition, design critique, and instant adaptability, which cannot be modeled by rigid script execution."
    }
  ],
  7: [
    {
      id: "m7-f1",
      question: "Which software category demands strict compliance audits against standards like HIPAA or medical device FDA guidance?",
      options: [
        "Video game visual assets.",
        "Healthcare and clinical diagnostic software.",
        "B2B CRM client lists.",
        "Standard e-commerce checkout platforms."
      ],
      correctAnswer: 1,
      explanation: "Healthcare applications undergo extreme compliance validation to guarantee secure data handling, fail-safe user paths, and guard patient safety."
    },
    {
      id: "m7-f2",
      question: "What is a main focal point when designing validation plans for Financial Core Banking applications?",
      options: [
        "Increasing game controller feedback speeds.",
        "Verifying transaction absolute ACID properties, complete audit trails, and preventing unauthorized concurrency vulnerabilities.",
        "Changing card layouts to fit custom styles dynamically.",
        "Increasing database connection pools to infinity."
      ],
      correctAnswer: 1,
      explanation: "Banking requires near-perfect consistency (Atomicity, Consistency, Isolation, Durability), high security, encryption checking, and protection against transactional concurrency leaks."
    }
  ],
  8: [
    {
      id: "m8-f1",
      question: "What is a master 'Test Plan' in professional QA environments?",
      options: [
        "A software file repository containing script assets.",
        "A comprehensive living document defining testing scope, strategies, environments, deadlines, risk registers, and resources.",
        "A collection of developer hotfix summaries.",
        "A project marketing roadmap for potential investors."
      ],
      correctAnswer: 1,
      explanation: "The Test Plan acts as the primary governor of the QA cycle, clearly coordinating resources, establishing scopes, defining entry/exit criteria, and anticipating technical risk factors."
    },
    {
      id: "m8-f2",
      question: "What is the primary benefit of a Requirements Traceability Matrix (RTM)?",
      options: [
        "Estimating code execution latencies.",
        "Proving full verification coverage by mapping functional requirements directly to their associated test cases and open defects.",
        "Counting total lines of CSS classes.",
        "Automatically deploying docker containers."
      ],
      correctAnswer: 1,
      explanation: "An RTM bridges requirements with tests and defects, giving absolute transparency that each product item is covered by a test and has been successfully validated."
    }
  ],
  9: [
    {
      id: "m9-f1",
      question: "What is the standard formula or concept behind calculating 'Defect Density'?",
      options: [
        "The size of a video recording in megabytes.",
        "The count of confirmed bugs relative to the software's unit metric size (such as KLOC [Thousand Lines of Code] or function points).",
        "The speed at which a junior developer repairs bug tickets.",
        "The percentage of code tested successfully on mobile frameworks."
      ],
      correctAnswer: 1,
      explanation: "Defect Density (Bugs / Size) helps pin down which software models or modules are highly vulnerable, highlighting areas requiring code refactoring or deeper automated coverage."
    },
    {
      id: "m9-f2",
      question: "What does 'Defect Leakage Index' track in post-release reports?",
      options: [
        "Bugs that occur in development but are caught in staging.",
        "Bugs that slip past system quality testing and are found by real clients in production environments.",
        "The frequency of server database memory leaks.",
        "The speed at which code updates are written."
      ],
      correctAnswer: 1,
      explanation: "Defect Leakage evaluates QA effectiveness by counting the fraction of product defects that escaped all testing environments and were discovered in live production."
    }
  ],
  10: [
    {
      id: "m10-f1",
      question: "Which skills profile represents a modern, highly sought-after QA Automation and Quality Engineer?",
      options: [
        "Focusing strictly on screen manual clicking without tracking code logic.",
        "A combination of solid testing theory, hands-on automation scripting (Javascript/Cypress), CI/CD pipeline integration, and agile cross-functional syncs.",
        "Reading manuals without executing any testing loops.",
        "Editing codebases directly without consulting the product manager."
      ],
      correctAnswer: 1,
      explanation: "Modern quality engineering blends core analytical thinking (test design limits) with engineering technical skills (automation, pipeline structures, performance debugging) to operate effectively."
    },
    {
      id: "m10-f2",
      question: "What is the career progression direction of entry-level testers in digital systems?",
      options: [
        "Starting with simple checks, advancing to precise test design, specializing in automation/performance engineering, and leading quality divisions.",
        "Changing profiles constantly to avoid learning automation principles.",
        "Working in isolated silos without participating in agile updates.",
        "Reverting to documentation drafting exclusively."
      ],
      correctAnswer: 0,
      explanation: "The QA trajectory starts with execution, advances to test design, moves to technical specialization (SDET, security, devops QA), and grows into management or advisory quality leadership."
    }
  ]
};

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  moduleId?: number;
  moduleTitle?: string;
  progress?: UserProgress;
  onUpdateProgress?: (progress: UserProgress) => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

export default function QuizModal({
  isOpen,
  onClose,
  questions,
  moduleId = 1,
  moduleTitle = "Interactive Assessment",
  progress,
  onUpdateProgress,
  onComplete
}: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerLocked, setAnswerLocked] = useState<boolean>(false);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [sessionXpEarned, setSessionXpEarned] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Collect questions upon open/shift of module
  useEffect(() => {
    if (isOpen) {
      // 1. Gather any questions defined in modulesData.ts sections
      const aggregated = [...questions];
      
      // 2. Mix with fallback questions to ensure there's a strong exam set
      const FallbackList = COMPREHENSIVE_MODULE_QUZZES[moduleId] || COMPREHENSIVE_MODULE_QUZZES[1];
      
      // We take a mix of aggregated and fallbacks to keep it fresh and complete
      const finalSet = aggregated.length > 0 ? aggregated : FallbackList;
      
      // Remove duplicate questions just in case, mapped by id
      const uniqueMap = new Map<string, QuizQuestion>();
      finalSet.forEach((q) => uniqueMap.set(q.id || q.question, q));
      
      setQuizQuestions(Array.from(uniqueMap.values()).slice(0, 5)); // cap at 5 questions for excellent length
      
      // Reset state for new quiz session
      setCurrentStep(0);
      setSelectedAnswer(null);
      setAnswerLocked(false);
      setSessionCorrectCount(0);
      setSessionXpEarned(0);
      setQuizFinished(false);
    }
  }, [isOpen, moduleId, questions]);

  if (!isOpen || quizQuestions.length === 0) return null;

  const currentQuestion = quizQuestions[currentStep];

  const handleSelectOption = (idx: number) => {
    if (answerLocked) return;
    setSelectedAnswer(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedAnswer === null || answerLocked) return;
    
    setAnswerLocked(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    let xpGain = 0;
    if (isCorrect) {
      setSessionCorrectCount((prev) => prev + 1);
      xpGain = 30; // 30 XP per correct question
      setSessionXpEarned((prev) => prev + xpGain);
    }
  };

  const handleNextStep = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswerLocked(false);
    } else {
      // Finish Quiz Assessment
      setQuizFinished(true);
      
      // Calculate final bonus XP
      const totalPassedPercentage = (sessionCorrectCount / quizQuestions.length) * 100;
      const passPassed = totalPassedPercentage >= 60;
      
      // Completion bonus + high-score bonus
      let completionBonus = 50; // default complete
      if (passPassed) {
        completionBonus += 50; // extra pass bonus
      }
      if (totalPassedPercentage === 100) {
        completionBonus += 50; // perfect score bonus!
      }
      
      const totalBonusAward = completionBonus;
      const finalXpAwardedTotal = sessionXpEarned + totalBonusAward;

      // Update global user progress structure if available
      if (progress && onUpdateProgress) {
        const currentCompletedQuizzes = progress.completedModuleQuizzes || [];
        const updatedList = currentCompletedQuizzes.includes(moduleId)
          ? currentCompletedQuizzes
          : [...currentCompletedQuizzes, moduleId];

        const currentScores = progress.quizScores || {};
        const previousBest = currentScores[moduleId] || 0;
        const currentScoreFraction = Math.round(totalPassedPercentage);
        const newBestScore = Math.max(previousBest, currentScoreFraction);

        const isBadgeUnlocked = [...(progress.unlockedBadges || [])];
        // Unlock module specific badge if passed
        const moduleBadgeId = `mod-${moduleId}-passed`;
        if (passPassed && !isBadgeUnlocked.includes(moduleBadgeId)) {
          isBadgeUnlocked.push(moduleBadgeId);
        }

        onUpdateProgress({
          ...progress,
          xp: progress.xp + finalXpAwardedTotal,
          completedModuleQuizzes: updatedList,
          quizScores: {
            ...currentScores,
            [moduleId]: newBestScore
          },
          unlockedBadges: isBadgeUnlocked
        });
      }

      // Invoke onComplete callback if specified
      if (onComplete) {
        onComplete(totalPercentage, finalXpAwardedTotal);
      }

      setSessionXpEarned((prev) => prev + totalBonusAward);
    }
  };

  const totalPercentage = Math.round((sessionCorrectCount / quizQuestions.length) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          id="quiz-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={answerLocked && quizFinished ? onClose : undefined}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Arena Card */}
        <motion.div
          id="quiz-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white border border-slate-100 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl z-10 flex flex-col justify-between"
        >
          {/* Top Decorative header header */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/20 text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Module Assessment</span>
                <h3 className="font-sans font-semibold text-sm truncate max-w-[340px]" title={moduleTitle}>
                  {moduleTitle}
                </h3>
              </div>
            </div>
            {!quizFinished && (
              <span className="bg-indigo-950 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-805/40 text-indigo-300">
                Q {currentStep + 1} of {quizQuestions.length}
              </span>
            )}
          </div>

          {!quizFinished ? (
            /* Active assessment content area */
            <div className="p-6 sm:p-8 space-y-6">
              {/* Question container */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0 mt-0.5">
                    <HelpCircle className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-sans font-medium text-slate-900 text-sm sm:text-base leading-relaxed">
                    {currentQuestion.question}
                  </h4>
                </div>
              </div>

              {/* Multiple Choice Options listing */}
              <div className="space-y-3" id={`quiz-modal-options-grid-${currentQuestion.id}`}>
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === oIdx;
                  const isCorrectAnswer = oIdx === currentQuestion.correctAnswer;
                  
                  let optStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                  
                  if (answerLocked) {
                    if (isCorrectAnswer) {
                      optStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium scale-[1.01] shadow-xs";
                    } else if (isSelected) {
                      optStyle = "bg-red-50 border-red-300 text-red-800";
                    } else {
                      optStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                    }
                  } else if (isSelected) {
                    optStyle = "bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold scale-[1.01] shadow-xs";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={answerLocked}
                      id={`quiz-modal-option-${oIdx}`}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs leading-relaxed transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs border ${
                          isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "bg-slate-55 bg-slate-50 border-slate-200 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {answerLocked && isCorrectAnswer && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                      {answerLocked && isSelected && !isCorrectAnswer && <X className="h-4 w-4 text-red-650 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Question Feedback explanation segment */}
              <AnimatePresence>
                {answerLocked && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "bg-emerald-50 border-emerald-250 border-emerald-200 text-emerald-900"
                        : "bg-red-50 border-red-250 border-red-200 text-red-900"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <Sparkles className="h-4 w-4 text-emerald-600 animate-bounce" />
                          <span>Excellent! +30 XP Secured</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-500" />
                          <span>Revision Check!</span>
                        </>
                      )}
                    </div>
                    <p className="font-sans font-light">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions footer bar */}
              <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                {!answerLocked ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleVerifyAnswer}
                    id="quiz-modal-validate-btn"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/10 flex items-center justify-center gap-2"
                  >
                    <span>Lock Answer & Validate</span>
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    id="quiz-modal-next-btn"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{currentStep === quizQuestions.length - 1 ? "Finish Exam" : "Next Question"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz finished scoreboard screen */
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-100 rounded-full scale-110 animate-ping opacity-35" />
                <div className="h-16 w-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                  <Trophy className="h-8 w-8 text-amber-300" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-sans font-semibold text-xl text-slate-900">
                  {totalPercentage >= 80 ? "Superb QA Comprehension!" : totalPercentage >= 60 ? "Nice Work, QA Specialist!" : "Revision highly recommended"}
                </h4>
                <p className="text-xs text-slate-500 max-w-[340px] mx-auto leading-relaxed">
                  You successfully addressed {sessionCorrectCount} out of {quizQuestions.length} evaluation questions from Module {moduleId}.
                </p>
              </div>

              {/* Performance status card */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 max-w-sm mx-auto">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Score Received</span>
                  <div className="font-sans font-bold text-2xl text-slate-800 mt-1 flex items-center justify-center gap-1">
                    <span>{totalPercentage}%</span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({sessionCorrectCount}/{quizQuestions.length})
                    </span>
                  </div>
                </div>

                <div className="text-center border-l border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">XP Gained</span>
                  <div className="font-sans font-bold text-2xl text-amber-600 mt-1 flex items-center justify-center gap-1 animate-pulse">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>+{sessionXpEarned}</span>
                  </div>
                </div>
              </div>

              {/* Score bar visual feedback */}
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      totalPercentage >= 80 ? "bg-emerald-500" : totalPercentage >= 60 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${totalPercentage}%` }}
                  />
                </div>
              </div>

              {totalPercentage >= 60 && (
                <div className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-800 rounded-full py-1.5 px-4 text-[10px] font-bold tracking-tight max-w-xs mx-auto">
                  <Award className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Module Completed Badge Unlocked!</span>
                </div>
              )}

              {/* Score card navigation */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedAnswer(null);
                    setAnswerLocked(false);
                    setSessionCorrectCount(0);
                    setSessionXpEarned(0);
                    setQuizFinished(false);
                    setCurrentStep(0);
                  }}
                  id="quiz-modal-retry-btn"
                  className="flex-1 py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry Practice Exam</span>
                </button>
                
                <button
                  onClick={onClose}
                  id="quiz-modal-finish-btn"
                  className="flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-505 bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
                >
                  Confirm and Return
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
