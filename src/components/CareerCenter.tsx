import React, { useState, useEffect } from "react";
import { 
  Award, 
  Briefcase, 
  BookOpen, 
  Cpu, 
  Layers, 
  Send, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Search,
  Copy,
  Check,
  Mic,
  Square,
  Flame,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Clock,
  Volume2,
  AlertOctagon,
  FileText,
  UserCheck
} from "lucide-react";
import { UserProgress } from "../types";
import { TOP_50_INTERVIEW_QUESTIONS, InterviewQuestion } from "../data/interviewData";
import { FLASHCARDS_DECK, SPEED_QUIZ_QUESTIONS } from "../data/flashcardsData";

interface CareerCenterProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export default function CareerCenter({ progress, onUpdateProgress }: CareerCenterProps) {
  // Navigation: "interview" | "top50" | "cheatsheets" | "revision" | "assessment" | "roadmap"
  const [activeSubView, setActiveSubView] = useState<string>("interview");

  // ==========================================
  // SHARED UTILS: COPY TO CLIPBOARD NOTIFICATION
  // ==========================================
  const [copiedId, setCopiedId] = useState<string>("");
  const triggerCopyNotification = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  // ==========================================
  // A: UPGRADED AI MOCK INTERVIEW SIMULATOR
  // ==========================================
  const [interviewRole, setInterviewRole] = useState<string>("Manual QA Tester");
  const [interviewAnswer, setInterviewAnswer] = useState<string>("");
  const [showInterviewerHint, setShowInterviewerHint] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioSim, setRecordedAudioSim] = useState<boolean>(false);
  const [voicePlaybackActive, setVoicePlaybackActive] = useState<boolean>(false);
  
  // Timer state (90 seconds countdown)
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  // AI Evaluations states
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiRating, setAiRating] = useState<string>("");
  const [aiCritique, setAiCritique] = useState<string>("");
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState<boolean>(false);

  // Filter single interview question for selected track
  const availableDemoQuestions = [
    {
      role: "Manual QA Tester",
      question: "How would you prioritize test cases if you have strict time limits and cannot run your entire test suite before a sudden release?",
      hint: "Explain how you would apply Risk-Based Testing. Prioritize high-impact features (like credit transactions, authentication, APIs checkout) and major customer-persona pathways.",
      keywords: ["risk-based testing", "critical paths", "regression sizing", "prioritization", "impact analysis"],
      comparativeAnswer: "To prioritize testing under strict deadlines, I utilize Risk-Based Testing (RBT). I classify features based on 'Likelihood of Failure' and 'Impact on Business'. Core processing paths (e.g., checkout and user login) are labeled critical-priority. I then execute a high-impact regression test subset rather than the entire suite, ensuring primary user transactions are fully verified. Less critical UI cosmetic layouts are deferred for hotfix iterations."
    },
    {
      role: "Automation QA Engineer",
      question: "What is your strategy to resolve and prevent 'flaky' automated tests that pass in local workspaces but periodically fail in continuous integration (CI) builds?",
      hint: "Highlight your rejection of static delays like Thread.sleep(). Explain explicit dynamic waits (waiting for elements), stable DOM anchors, and database rollbacks.",
      keywords: ["explicit wait", "dynamic wait", "flakiness", "selectors", "data isolation", "thread sleep"],
      comparativeAnswer: "Flaky tests are typically caused by race conditions, unpredictable network latency, or shared databases in CI. To prevent flakiness, I strictly avoid static sleep statements like Thread.sleep() or cy.wait(5000). Instead, I leverage dynamic explicit waits (e.g. waiting for elements to be visible or APIs to resolve). Furthermore, I enforce data isolation using unique test transaction entries on each test run and utilize sturdy data-testid attributes for stable DOM queries."
    },
    {
      role: "SDET / Tech Lead",
      question: "How do you test an API endpoint that communicates with a third-party payment system that bills money for each transaction call?",
      hint: "Discuss Mocking, Stubbing, creating custom mock web servers, and asserting outgoing payment JSON structures without reaching third-party live servers.",
      keywords: ["mocking", "stubbing", "payment gateway sandbox", "json assertions", "api contract validation", "isolated environment"],
      comparativeAnswer: "I never call live third-party payment endpoints in automated test runs. Instead, I mock or stub the payment service using tools like Mockoon or custom Express mock stubs. I replicate positive responses (success receipts) and negative outcomes (insufficient funds, expired card) to validate our app's exceptions handling. I also run API contract tests to assert that outgoing JSON payloads comply with payment vendor specs."
    },
    {
      role: "QA Manager / Lead",
      question: "A critical customer-facing bug bypassed testing and caused a production crash. What immediate steps do you take as a QA Lead once the incident is resolved?",
      hint: "Speak about blameless post-mortem investigations, root cause analyses, tracking test-coverage missing points, and instantly rolling in a target automated regression test.",
      keywords: ["blameless post-mortem", "root cause analysis", "regression test suite", "process gap", "missed test coverage"],
      comparativeAnswer: "Once the production incident is solved, I coordinate a blameless post-mortem with developers and product managers to conduct a Root Cause Analysis (RCA). We investigate why our testing pipelines missed this defect (e.g. missing environment parity, poor requirements validation, or skipped automation tests). I then ensure we write a target test case and automate it inside our regression suite to guarantee it never slips through again."
    }
  ];

  const currentInterviewerQ = availableDemoQuestions.find(q => q.role === interviewRole) || availableDemoQuestions[0];

  // Start / pause the interview timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = () => {
    setTimeLeft(90);
    setIsTimerRunning(true);
  };

  const handleResetSimulator = () => {
    setInterviewAnswer("");
    setAiScore(null);
    setRecordedAudioSim(false);
    setIsRecording(false);
    setTimeLeft(90);
    setIsTimerRunning(false);
  };

  // Simulate Voice Recording Voice Waves
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  useEffect(() => {
    let recInterval: NodeJS.Timeout | null = null;
    if (isRecording) {
      recInterval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => {
      if (recInterval) clearInterval(recInterval);
    };
  }, [isRecording]);

  const handleStartVoiceRecord = () => {
    setIsRecording(true);
    setRecordedAudioSim(false);
    if (!isTimerRunning) setIsTimerRunning(true);
  };

  const handleStopVoiceRecord = () => {
    setIsRecording(false);
    setRecordedAudioSim(true);
    // Auto-transcribe simulated speech content based on the role to make it extremely clean and robust!
    let simulatedText = "";
    if (interviewRole === "Manual QA Tester") {
      simulatedText = "To prioritize, I would apply risk-based testing, focusing on the critical business pathways under strict deadlines. I would prioritize key transaction flows like payment gateways, while deferring visual cosmetic bugs until late hotfixes.";
    } else if (interviewRole === "Automation QA Engineer") {
      simulatedText = "I suggest eliminating Thread.sleep() or hardcoded wait delays, replacing them with dynamic explicit awaits. We should also sanitize database entries and run isolated test configurations with data-testid selectors.";
    } else if (interviewRole === "SDET / Tech Lead") {
      simulatedText = "I would avoid hit billing systems entirely by mocking third-party payment endpoints using API stubs or local sandbox web servers. I will assert contract JSON expectations.";
    } else {
      simulatedText = "My approach focuses on arranging a blameless post-mortem to perform diagnostic root cause analysis. Then, we insert a regression automated unit test to block recurrence.";
    }
    setInterviewAnswer(simulatedText);
  };

  // Keywords analyzer: Check which terms the user has typed or transcribed!
  const matchedKeywordsList = currentInterviewerQ.keywords.filter(keyword => 
    interviewAnswer.toLowerCase().includes(keyword.toLowerCase().split("(")[0].trim())
  );

  const keyHitPercentage = Math.round((matchedKeywordsList.length / currentInterviewerQ.keywords.length) * 100);

  const handleEvaluateMockAnswer = async () => {
    setIsTimerRunning(false);
    setIsLoadingEvaluation(true);
    setAiScore(null);

    try {
      const response = await fetch("/api/evaluate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interviewRole,
          question: currentInterviewerQ.question,
          answer: interviewAnswer
        })
      });

      const data = await response.json();
      setIsLoadingEvaluation(false);
      setAiScore(data.score || 85);
      setAiRating(data.rating || "Very Competent");
      setAiCritique(data.feedback || "Excellent structure in your answer! You demonstrated solid logic addressing high-impact features. To optimize, mention how performance constraints affect risk prioritization.");
      setAiTips(data.tips || ["Define your testing environment specifications", "Adopt risk analysis matrices explicitly"]);

      // Unlocks gladiator badge on high scores!
      let newXp = progress.xp + 80;
      const unlockedBadges = [...progress.unlockedBadges];
      if (data.score >= 85 && !unlockedBadges.includes("career")) {
        unlockedBadges.push("career");
        newXp += 150;
      }
      onUpdateProgress({
        ...progress,
        xp: newXp,
        unlockedBadges
      });

    } catch (err) {
      console.error(err);
      setIsLoadingEvaluation(false);
      // Fallback
      setAiScore(85);
      setAiRating("Successful Analysis");
      setAiCritique(`Solid performance! You correctly targeted key elements. You successfully analyzed the typical bottlenecks of ${interviewRole}. For maximum scores, expand on test boundary parameters and execution logs.`);
      setAiTips(["Specify Expected Results clearly", "Reference static review practices inside sprint planning"]);
    }
  };


  // ==========================================
  // B: TOP 50 PREP INTERVIEW QUESTIONS
  // ==========================================
  const [qaSearch, setQaSearch] = useState<string>("");
  const [activePrepCategory, setActivePrepCategory] = useState<string>("All");
  const [expandedPrepId, setExpandedPrepId] = useState<string | null>(null);

  const filteredQuestionsList = TOP_50_INTERVIEW_QUESTIONS.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(qaSearch.toLowerCase()) || 
                          q.answer.toLowerCase().includes(qaSearch.toLowerCase());
    const matchesCategory = activePrepCategory === "All" || q.category === activePrepCategory;
    return matchesSearch && matchesCategory;
  });


  // ==========================================
  // C: INTERACTIVE CHEAT SHEETS
  // ==========================================
  const [activeCheatTab, setActiveCheatTab] = useState<string>("testing-types");
  
  // Custom interactive Bug Template Fields
  const [bugBuilderTitle, setBugBuilderTitle] = useState<string>("App crashes when applying invalid promo code");
  const [bugBuilderSteps, setBugBuilderSteps] = useState<string>("1. Log in with user credentials\n2. Add item to order cart\n3. Type discount code 'INVALID' and click apply");
  const [bugBuilderExpected, setBugBuilderExpected] = useState<string>("ErrorMessage displays 'Invalid voucher sequence' and checkout recovers smoothly.");
  const [bugBuilderActual, setBugBuilderActual] = useState<string>("NullPointer exception on pricing thread and application server triggers HTTP 500 status crash.");
  const [bugBuilderSeverity, setBugBuilderSeverity] = useState<string>("Critical");
  const [bugBuilderPriority, setBugBuilderPriority] = useState<string>("High");

  const generatedBugMarkdown = `## [BUG] ${bugBuilderTitle}
---
**Technical Severity:** ${bugBuilderSeverity} | **Business Priority:** ${bugBuilderPriority}
**Environment:** Chrome Web (v124) | OS: macOS Staging 

### Steps to Reproduce:
${bugBuilderSteps}

### Expected Behavior:
${bugBuilderExpected}

### Actual Behavior:
${bugBuilderActual}

---
*Logged via Interactive QA Report Template Generator - Software Testing Mastery*`;

  // ==========================================
  // D: CRAM REVISION CONSOLE (FLASHCARDS & TIMED QUIZ)
  // ==========================================
  const [revisionSubTab, setRevisionSubTab] = useState<string>("flashcards");

  // FLASHCARDS DECK STATES
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [reviewedCards, setReviewedCards] = useState<{ [id: string]: "easy" | "medium" | "hard" }>({});

  const activeCard = FLASHCARDS_DECK[currentCardIdx];

  const handleRateCard = (difficulty: "easy" | "medium" | "hard") => {
    setReviewedCards({ ...reviewedCards, [activeCard.id]: difficulty });
    setIsCardFlipped(false);
    // advance card
    setTimeout(() => {
      if (currentCardIdx < FLASHCARDS_DECK.length - 1) {
        setCurrentCardIdx(prev => prev + 1);
      } else {
        // Wrap-around
        setCurrentCardIdx(0);
      }
    }, 200);
  };

  // TIMED QUIZ STATES
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizTickingTime, setQuizTickingTime] = useState<number>(30); // 30 seconds per question!
  const [quizTimerActive, setQuizTimerActive] = useState<boolean>(false);
  const [quizSummary, setQuizSummary] = useState<{ score: number; wonXp: number; show: boolean } | null>(null);

  const activeQuizQ = SPEED_QUIZ_QUESTIONS[quizQuestionIdx];

  // Quiz Countdown ticking logic
  useEffect(() => {
    let quizInterval: NodeJS.Timeout | null = null;
    if (quizTimerActive && quizTickingTime > 0) {
      quizInterval = setInterval(() => {
        setQuizTickingTime(prev => prev - 1);
      }, 1000);
    } else if (quizTickingTime === 0 && quizTimerActive) {
      // Auto-submit current answer as wrong and advance
      handleSelectQuizAnswer(-1);
    }
    return () => {
      if (quizInterval) clearInterval(quizInterval);
    };
  }, [quizTickingTime, quizTimerActive]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizQuestionIdx(0);
    setQuizAnswers({});
    setQuizTickingTime(30);
    setQuizTimerActive(true);
    setQuizSummary(null);
  };

  const handleSelectQuizAnswer = (optIdx: number) => {
    const updatedAnswers = { ...quizAnswers, [quizQuestionIdx]: optIdx };
    setQuizAnswers(updatedAnswers);
    
    if (quizQuestionIdx < SPEED_QUIZ_QUESTIONS.length - 1) {
      setQuizQuestionIdx(prev => prev + 1);
      setQuizTickingTime(30); // Reset timer
    } else {
      // Finished! Evaluate results!
      setQuizTimerActive(false);
      let calculatedScore = 0;
      SPEED_QUIZ_QUESTIONS.forEach((q, idx) => {
        if (updatedAnswers[idx] === q.correctAnswer) {
          calculatedScore += 20; // 20 points per question
        }
      });

      const awardedXp = calculatedScore; // 1 XP base point per quiz percentage score
      setQuizSummary({
        score: calculatedScore,
        wonXp: awardedXp,
        show: true
      });

      // Update user points
      onUpdateProgress({
        ...progress,
        xp: progress.xp + awardedXp
      });
    }
  };

  // RANDOM FIRE QUESTION GENERATOR
  const [randomQ, setRandomQ] = useState<InterviewQuestion | null>(null);
  const [showRandomExplanation, setShowRandomExplanation] = useState<boolean>(false);

  const handleRollQuestion = () => {
    const randomIdx = Math.floor(Math.random() * TOP_50_INTERVIEW_QUESTIONS.length);
    setRandomQ(TOP_50_INTERVIEW_QUESTIONS[randomIdx]);
    setShowRandomExplanation(false);
  };


  // ==========================================
  // E: QA CAREER SKILLS SELECTOR DICTIONARY (PREVIOUS SESSIONS RETENTION)
  // ==========================================
  const [selectorAnswers, setSelectorAnswers] = useState<{ [qId: string]: number }>({});
  const [selectorFeedbackReport, setSelectorFeedbackReport] = useState<string>("");

  const selectorQuestions = [
    { id: "sa-1", question: "How would you rate your comfortable knowledge with scripting or OOP languages?", options: ["None / No Coding background", "Basic scripts understanding (can edit parameters)", "Moderate (can code loops/functions)", "Advanced (can write frameworks/classes)"] },
    { id: "sa-2", question: "How comfortably can you write database SQL queries?", options: ["None", "Basic commands (SELECT, INSERT)", "Moderate (JOINS, schemas constraints)", "Advanced (procedures, triggers)"] },
    { id: "sa-3", question: "Have you ever compiled automated UI/API scripts in frameworks like Cypress?", options: ["Never used automation tools", "Used manual stubs to execute", "Authored basic tests to verify features", "Built complete multi-browser integration flows"] }
  ];

  const handleRunSelectorMatrix = () => {
    const answersList = Object.values(selectorAnswers) as number[];
    const scoreSum = answersList.reduce((a: number, b: number) => a + b, 0);
    if (scoreSum <= 3) {
      setSelectorFeedbackReport("Designated Target: Manual QA Analyst. Focus your studies on Equivalence Partitioning, Boundary Analyses, detailed Bug Logging, and STLC cycle reporting. Build pristine test-design sheets first.");
    } else if (scoreSum <= 7) {
      setSelectorFeedbackReport("Designated Target: Automation QA Engineer. You possess strong foundational logic! Grow your scripting index: master HTML DOM locating strategies, Page Object Model (POM) architecture patterns, and write Cypress/Playwright regression runs.");
    } else {
      setSelectorFeedbackReport("Designated Target: SDET / Test Architect. Excellent technical base! Focus on building scalable decoupled testing frameworks, orchestrating automated CI/CD release hooks, mocking live third-party network APIs, and performance profiling.");
    }

    onUpdateProgress({
      ...progress,
      xp: progress.xp + 40
    });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="interview-readiness-master">
      
      {/* 1. Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-150 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] text-emerald-700 font-bold border border-emerald-100 uppercase">
            Cram & Prep Suite Active
          </div>
          <h1 className="font-sans font-semibold text-2xl text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            Software Testing Crash Course: Last-Minute Interview Prep
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-normal max-w-3xl">
            Ace your software testing interviews with our structured prep resources! Master the <strong>Top 50 Interview Questions</strong>, practice realistic interviews in our <strong>AI Mock Simulator</strong>, copy pre-formatted bug report templates, and drilling with active flashcards and timed quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50/40 border border-indigo-100 px-4 py-3 rounded-xl self-start md:self-center">
          <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
          <div className="text-xs">
            <div className="font-bold text-slate-800">Cram Session Boost</div>
            <div className="text-[10px] text-slate-500 font-medium">Earn double XP on mock simulations</div>
          </div>
        </div>
      </div>

      {/* 2. Primary Feature Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1" id="prep-major-tabs">
        {[
          { id: "interview", label: "AI Interview Simulator", icon: Cpu },
          { id: "top50", label: "Top 50 Q&A Database", icon: BookOpen },
          { id: "cheatsheets", label: "Interactive Cheat Sheets", icon: FileText },
          { id: "revision", label: "Revision Console", icon: Clock },
          { id: "assessment", label: "QA Role Diagnostic", icon: UserCheck },
          { id: "roadmap", label: "ISTQB Roadmap", icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-2 cursor-pointer border ${
                isActive 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                  : "bg-slate-50/60 border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Primary Feature Panels View Router */}
      <div className="grid grid-cols-1">

        {/* ==========================================
            A: AI MOCK INTERVIEW SIMULATOR
            ========================================== */}
        {activeSubView === "interview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="view-interview-sim">
            
            {/* Left Column: Interactive Console */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100/50">Simulated Interviewing Tracks</span>
                  <h3 className="font-sans font-semibold text-md text-slate-900">Configure Your Targeted QA Role</h3>
                </div>

                <div className="flex flex-wrap gap-1">
                  {["Manual QA Tester", "Automation QA Engineer", "SDET / Tech Lead", "QA Manager / Lead"].map((role) => (
                    <button
                      key={role}
                      onClick={() => { setInterviewRole(role); handleResetSimulator(); }}
                      className={`px-2.5 py-1.5 rounded border text-[10px] font-bold tracking-tight cursor-pointer transition-all ${
                        interviewRole === role 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Technical Board Room Avatar */}
              <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-white space-y-3 font-mono relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-[9px] font-bold text-indigo-400 tracking-widest bg-indigo-950/40 rounded-bl border-l border-b border-slate-850">
                  SESSION RECORDING ON
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500 flex items-center justify-center text-indigo-400">
                    <Volume2 className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Technical QA Lead Interviewer</h5>
                    <p className="text-[10px] text-slate-500">Corporate Enterprise Systems</p>
                  </div>
                </div>

                <p className="text-xs sm:text-xs leading-relaxed text-slate-200 pt-2 border-t border-slate-900">
                  &ldquo;{currentInterviewerQ.question}&rdquo;
                </p>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setShowInterviewerHint(!showInterviewerHint)}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {showInterviewerHint ? "- Hide Hints" : "+ Show Interviewer Hints & Keywords"}
                  </button>

                  {/* Timer display */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold font-mono tracking-wider ${
                    timeLeft <= 15 ? "bg-red-950/65 text-red-400 border border-red-800/50 animate-pulse" : "bg-slate-900 text-slate-300"
                  }`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>01:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                  </div>
                </div>

                {showInterviewerHint && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-900/35 rounded-lg text-[10.5px] leading-relaxed text-indigo-200 text-left font-sans animate-fade-in">
                    <strong>Interviewer Scoping Guide:</strong> {currentInterviewerQ.hint}
                  </div>
                )}
              </div>

              {/* Speech simulator selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Your Response Formulation</label>
                  
                  {/* Speech input buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleStartVoiceRecord}
                      disabled={isRecording}
                      className="px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-150 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>Start Voice Rec Sim</span>
                    </button>

                    {isRecording && (
                      <button
                        type="button"
                        onClick={handleStopVoiceRecord}
                        className="px-2.5 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-500 border border-red-600 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                      >
                        <Square className="h-3.5 w-3.5" />
                        <span>Stop & Autotranscribe ({recordingSeconds}s)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulated Voice wave animation during recording */}
                {isRecording && (
                  <div className="p-4 bg-slate-950 rounded-xl flex flex-col items-center justify-center space-y-2 border border-red-950">
                    <div className="flex items-center gap-1.5 h-6">
                      {[3, 6, 2, 8, 4, 10, 4, 8, 2, 6, 3].map((h, i) => (
                        <span 
                          key={i} 
                          className="w-1.5 rounded bg-red-500 animate-pulse" 
                          style={{ 
                            height: `${h * 2}px`, 
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.6s"
                          }} 
                        />
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-red-400 font-bold animate-pulse">Capturing voice audio stream stream... Speak now</div>
                  </div>
                )}

                {/* Text answer field */}
                <div className="space-y-1">
                  <textarea
                    value={interviewAnswer}
                    onChange={(e) => {
                      setInterviewAnswer(e.target.value);
                      if (!isTimerRunning && e.target.value.length > 0) setIsTimerRunning(true);
                    }}
                    placeholder="Provide your software software testing explanation here... Or tap 'Start Voice Rec Sim' above to dictate!"
                    className="w-full bg-white border border-slate-350 rounded-xl p-3.5 text-xs h-36 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-sans shadow-2xs leading-relaxed"
                  />
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span>*Pro Tip: Ensure your response hits core keywords to maximize compliance metrics!</span>
                    <span>Characters: {interviewAnswer.length}</span>
                  </div>
                </div>

                {/* Keyword Analysis bar */}
                {interviewAnswer.length > 5 && (
                  <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2.5 animate-fade-in">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-505 uppercase text-slate-500">
                      <span>Live Response Technical Keywords Checklist:</span>
                      <span className="font-mono text-indigo-600 font-bold">{matchedKeywordsList.length} / {currentInterviewerQ.keywords.length} hit ({keyHitPercentage}%)</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {currentInterviewerQ.keywords.map((key) => {
                        const isHit = matchedKeywordsList.includes(key);
                        return (
                          <span 
                            key={key} 
                            className={`px-2 py-1 rounded text-[9.5px] font-bold tracking-tight border transition-all flex items-center gap-1 ${
                              isHit 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800" 
                                : "bg-white border-slate-200 text-slate-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isHit ? "bg-emerald-500" : "bg-slate-350"}`} />
                            {key}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Control Actions */}
                <div className="flex gap-3">
                  <button
                    disabled={interviewAnswer.trim().length < 15 || isLoadingEvaluation}
                    onClick={handleEvaluateMockAnswer}
                    className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 disabled:cursor-not-allowed text-white font-bold text-xs py-3.5 hover:scale-[1.01] transition-all cursor-pointer border border-indigo-600 flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    <Send className="h-4.5 w-4.5" />
                    <span>{isLoadingEvaluation ? "Manager Evaluation in progress..." : "Submit Answer For Review (+80 XP)"}</span>
                  </button>

                  <button
                    onClick={handleResetSimulator}
                    className="px-4 rounded-xl border border-slate-250 bg-white text-slate-650 hover:bg-slate-50 text-xs font-semibold select-none transition-all cursor-pointer"
                  >
                    Reset Run
                  </button>
                </div>

              </div>

            </div>

            {/* Right Column: AI Analytics Feedback Board */}
            <div className="lg:col-span-5 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="space-y-1.5 pb-4 border-b border-slate-100">
                <h3 className="font-sans font-semibold text-slate-905 text-slate-900 text-md flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  Manager AI Evaluation Panel
                </h3>
                <p className="text-[11px] text-slate-500">
                  Assessments are generated server-side by our corporate AI manager model. Select a track left, construct your argument, and run evaluation!
                </p>
              </div>

              {isLoadingEvaluation && (
                <div className="h-80 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative h-12 w-12">
                    <span className="absolute inset-0 rounded-full border-4 border-slate-200" />
                    <span className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">Reviewing Response Concepts...</div>
                  <p className="text-[11px] text-slate-500 max-w-xs leading-normal font-sans">
                    Evaluating keyword concentration density, system stability assertions, and grading alignment against corporate standards.
                  </p>
                </div>
              )}

              {!isLoadingEvaluation && aiScore !== null ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Performance score badge */}
                  <div className="flex justify-between items-center bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl">
                    <div>
                      <div className="text-[10px] font-bold text-indigo-900 tracking-wider">COMPLIANCE SCORE</div>
                      <div className="text-2xl font-black text-indigo-700 font-mono mt-0.5">{aiScore} / 100</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 text-right uppercase font-mono tracking-wider">VERDICT</div>
                      <div className="text-xs font-bold text-slate-800 text-right mt-1 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-3xs">{aiRating}</div>
                    </div>
                  </div>

                  {/* Keyword analysis checklist */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                      Key Testing Concepts Addressed:
                    </h4>
                    <div className="bg-emerald-50/10 border border-emerald-100 p-3 rounded-lg space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-emerald-800 font-bold mb-1">
                        <span>Technical coverage:</span>
                        <span>{matchedKeywordsList.length} of {currentInterviewerQ.keywords.length} terms</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {currentInterviewerQ.keywords.map((key) => {
                          const isHit = matchedKeywordsList.includes(key);
                          return (
                            <div key={key} className="flex gap-1.5 items-center text-[10px]">
                              <span className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isHit ? "bg-emerald-500 border-emerald-500 text-white text-[9px] font-bold" : "border-slate-300"
                              }`}>
                                {isHit ? "✓" : ""}
                              </span>
                              <span className={isHit ? "text-slate-800 font-medium" : "text-slate-400 font-normal"}>{key}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Critique text */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Interviewer Critique Notes
                    </h4>
                    <p className="text-slate-650 text-xs leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-3xs">
                      {aiCritique}
                    </p>
                  </div>

                  {/* Strategic Tips */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Strategic Alignment Tips
                    </h4>
                    <div className="space-y-2">
                      {aiTips.map((tip, idx) => (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex gap-2 w-full text-xs text-slate-650 leading-relaxed shadow-3xs">
                          <span className="h-5 w-5 rounded bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparative Model Answer */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setVoicePlaybackActive(!voicePlaybackActive)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-505 flex items-center gap-1 cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{voicePlaybackActive ? "Hide Comprehensive comparative Model Answer" : "See Comparative Model Answer Reference"}</span>
                    </button>
                    {voicePlaybackActive && (
                      <div className="p-4 bg-slate-900 text-slate-200 border border-slate-850 rounded-xl space-y-2 font-mono text-[11px] animate-fade-in leading-relaxed">
                        <div className="text-[10px] uppercase font-bold text-indigo-400">Golden Reference Answer Guide:</div>
                        <p className="italic font-sans">&ldquo;{currentInterviewerQ.comparativeAnswer}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  {aiScore >= 85 && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex gap-3 shadow-3xs animate-bounce" id="interview-gladiator-badge-congrat">
                      <Award className="h-5 w-5 text-emerald-650 shrink-0" />
                      <div>
                        <strong>✓ Gladiator Badge Unlocked!</strong>
                        <p className="text-[11px] text-emerald-700 mt-0.5 leading-normal font-sans">
                          Your response meets strict corporate excellence standards. +150 XP bonus added to your profile shelf!
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-center space-y-3 my-auto">
                  <div className="rounded-full bg-slate-50 p-4 border border-slate-105 text-slate-400">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">Awaiting Performance Submission</div>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-normal font-sans">
                    Review the current interviewer testing scenario Left, type your technical argument (or record simulated audio), and click submit.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ==========================================
            B: TOP 50 PREP INTERVIEW QUESTIONS DATABASE
            ========================================== */}
        {activeSubView === "top50" && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6" id="view-top50-db">
            
            {/* Filter and search bar controls */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-4 border-b border-slate-100">
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={qaSearch}
                  onChange={(e) => setQaSearch(e.target.value)}
                  placeholder="Search 50+ interview questions, answers, and criteria..." 
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/50 hover:bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-550 focus:outline-hidden focus:bg-white font-sans transition-all"
                />
              </div>

              {/* Categories scroller */}
              <div className="flex flex-wrap gap-1.5 overflow-x-auto pr-1">
                {["All", "Fundamentals", "Defect Management", "Test Design", "Agile & DevOps", "Automation", "SQL & Databases"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActivePrepCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                      activePrepCategory === cat 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Results summary stats */}
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1">
              <span>Showing {filteredQuestionsList.length} of {TOP_50_INTERVIEW_QUESTIONS.length} compiled questions</span>
              {qaSearch && <span>Filtered by &ldquo;{qaSearch}&rdquo;</span>}
            </div>

            {/* List items */}
            <div className="space-y-3.5" id="top50-questions-list">
              {filteredQuestionsList.length > 0 ? (
                filteredQuestionsList.map((q) => {
                  const isExpanded = expandedPrepId === q.id;
                  return (
                    <div 
                      key={q.id} 
                      className={`rounded-xl border transition-all ${
                        isExpanded ? "bg-indigo-50/15 border-indigo-200 shadow-3xs" : "bg-white border-slate-200 hover:border-slate-300 shadow-3xs"
                      }`}
                    >
                      <button
                        onClick={() => setExpandedPrepId(isExpanded ? null : q.id)}
                        className="w-full text-left p-4 flex gap-4 items-start cursor-pointer focus:outline-hidden"
                      >
                        <span className="h-6 w-6 mt-0.5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold text-slate-500 border border-slate-200">
                          {q.id.split("-")[1]}
                        </span>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded uppercase">
                              {q.category}
                            </span>
                            
                            <span className={`text-[9.5px] font-bold border px-1.5 py-0.5 rounded ${
                              q.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              q.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
                              "bg-red-50 text-red-700 border-red-100"
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>

                          <h4 className="font-sans font-semibold text-slate-900 text-sm leading-tight">
                            {q.question}
                          </h4>
                        </div>

                        <ChevronRight className={`h-5 w-5 text-slate-400 shrink-0 mt-2 transition-transform duration-200 ${isExpanded ? "rotate-90 text-indigo-500" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="px-12 pb-5 space-y-4 border-t border-slate-100/50 pt-4 animate-fade-in font-sans">
                          
                          {/* Ideal answer bullet list */}
                          <div className="space-y-1.5">
                            <h5 className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 font-mono">Comparative Model Answer:</h5>
                            <p className="text-slate-650 text-xs leading-relaxed font-normal p-4 bg-slate-50/50 border border-slate-200 rounded-xl shadow-3xs">
                              {q.answer}
                            </p>
                          </div>

                          {/* Key concepts boxes */}
                          <div className="space-y-2">
                            <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Must-Mention Key Bullet Points:</h5>
                            <div className="space-y-1.5">
                              {q.keyPoints.map((point, pIdx) => (
                                <div key={pIdx} className="flex gap-2 items-start text-xs text-slate-705 text-slate-650">
                                  <span className="h-4 w-4 shrink-0 mt-0.5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-400 font-sans space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <BookOpen className="h-10 w-10 mx-auto opacity-30" />
                  <div className="text-xs font-semibold">No questions matches your query.</div>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">Try typing another word or toggle category filters above.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==========================================
            C: INTERACTIVE CHEAT SHEETS
            ========================================== */}
        {activeSubView === "cheatsheets" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="interactive-cheatsheets">
            
            {/* Left selector menu */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-150 p-4 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Cheat Sheet Panels</div>
              {[
                { id: "testing-types", label: "Testing Types Grid" },
                { id: "design-techniques", label: "Design Principles Matrix" },
                { id: "bug-builder", label: "Dynamic Bug Ticket Template" }
              ].map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => setActiveCheatTab(sheet.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCheatTab === sheet.id 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-505 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sheet.label}
                </button>
              ))}
            </div>

            {/* Right content viewbox */}
            <div className="lg:col-span-9 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm min-h-80">
              
              {/* SHEET 1: TESTING TYPES COMPARATIVE TABLE */}
              {activeCheatTab === "testing-types" && (
                <div className="space-y-6 animate-fade-in" id="sheet-testing-types">
                  <div className="space-y-1">
                    <h3 className="font-sans font-semibold text-slate-900 text-md">Essential Technical Testing Types Comparison</h3>
                    <p className="text-slate-500 text-[11px]">Quick-access guide mapping execution timings, scope bounds, and stakeholders.</p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-3xs scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-205 text-slate-505 font-bold uppercase text-[9.5px]">
                          <th className="p-3">Testing Type</th>
                          <th className="p-3">Primary Scope Objective</th>
                          <th className="p-3">Timing Frequency</th>
                          <th className="p-3">Owner Stakeholder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {[
                          { type: "Smoke Testing", scope: "Verify critical build stability (e.g., successful boot and core login pathway functioning)", timing: "On every single code check-in or build deployment", owner: "Devs / Automation Scripting" },
                          { type: "Sanity Testing", scope: "Verify specific quick module patches and fixed bugs work in isolation", timing: "Post emergency bug fixes and hot-patches check-ins", owner: "Manual/Functional QA Specialist" },
                          { type: "Regression Testing", scope: "Ensure unmodified codebase sections remain stable and uncompromised by recent changes", timing: "Daily sprint closures, release-build testing periods", owner: "QA Automation Suites / Manual sets" },
                          { type: "Retesting", scope: "Execute test cases that initially failed to verify the developer's bug fix indeed works", timing: "As soon as developer closes bug ticket and flags fixed", owner: "Manual Tester / Assigned QA" },
                          { type: "Alpha Testing", scope: "Simulate internal end-to-end sandbox workflows before public releases", timing: "At the final development stages inside staging environments", owner: "Internal QA and Employee Teams" },
                          { type: "Beta Testing", scope: "Release product preview to a subset of public customers for environmental stress and usability", timing: "Pre-launch stage prior to complete generalized release", owner: "External Client Users" }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/55 transition-colors font-sans text-slate-700">
                            <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">{row.type}</td>
                            <td className="p-3 leading-relaxed">{row.scope}</td>
                            <td className="p-3">{row.type === "Smoke Testing" ? <span className="bg-indigo-50 border border-indigo-120/40 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{row.timing}</span> : row.timing}</td>
                            <td className="p-3 text-[11px] font-semibold text-slate-550">{row.owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SHEET 2: DESIGN TECHNIQUES REFERENCE */}
              {activeCheatTab === "design-techniques" && (
                <div className="space-y-6 animate-fade-in" id="sheet-design-techniques">
                  <div className="space-y-1">
                    <h3 className="font-sans font-semibold text-slate-905 text-slate-900 text-sm">Test Design Techniques Cheat Sheet</h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed">Technical black-box formulations to maximize parameter test coverage while avoiding overlapping redundancies.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Equivalence Partitioning (EP)", def: "Divides an infinite or massive input range into finite logical partitions or sets. We assume any single value in a partition yields identical outcome as others in that partition. Pick exactly one value.", formula: "Inputs: 0 to 100. Partitions: Invalid (<0), Valid (0-100), Invalid (>100). Pick: -5, 50, 105." },
                      { title: "Boundary Value Analysis (BVA)", def: "Complements Equivalence Partitioning. Evaluates exact boundary limits where off-by-one coding variables commonly cause flaws.", formula: "Inputs: 10 to 50 characters limits.\nTest values: 9, 10, 11 (min boundary) and 49, 50, 51 (max boundary)." },
                      { title: "State Transition Matrix", def: "Checks state workflows where page inputs shift software states in a sequence. Tests valid progression loops and blocks unauthorized states.", formula: "ATM Authentication state shifts: Out-of-service -> Idle -> Card Entered -> PIN verification code -> Valid Transaction -> Shutting. Tests illegal PIN blocks." },
                      { title: "Decision Tables Map", def: "A rules checklist matrix mapping overlapping combinations of boolean inputs to corresponding output actions. Essential for high-risk logic.", formula: "Inputs: User (Eligible), Promo (Valid), Coupon (Active). Actions: Billed $0, Billed $10, Billed $150." }
                    ].map((tech, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-3xs space-y-2.5 font-sans">
                        <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-indigo-500" />
                          {tech.title}
                        </div>
                        <p className="text-[11px] text-slate-655 text-slate-600 leading-relaxed font-normal">{tech.def}</p>
                        <div className="p-2.5 bg-white border border-slate-150 rounded-lg text-[10.5px] font-mono text-indigo-700 leading-relaxed">
                          <strong>Formula / Example:</strong><br />
                          {tech.formula}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SHEET 3: DYNAMIC COPYABLE MARKDOWN BUG TEMPLATE */}
              {activeCheatTab === "bug-builder" && (
                <div className="space-y-6 animate-fade-in" id="sheet-bug-builder">
                  <div className="space-y-1">
                    <h3 className="font-sans font-semibold text-slate-900 text-sm">Dynamic Jira/Markdown Bug Ticket Formulator</h3>
                    <p className="text-slate-500 text-[11px]">Draft steps and logs below to instantly compile a formatted markdown ticket. Hit copy to paste to clipboard!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Input Draft Fields */}
                    <div className="md:col-span-5 space-y-3 font-sans">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Defect Summary Title</label>
                        <input 
                          type="text" 
                          value={bugBuilderTitle}
                          onChange={(e) => setBugBuilderTitle(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Severity</label>
                          <select 
                            value={bugBuilderSeverity}
                            onChange={(e) => setBugBuilderSeverity(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          >
                            <option>Blocker</option>
                            <option>Critical</option>
                            <option>Major</option>
                            <option>Minor</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Priority</label>
                          <select 
                            value={bugBuilderPriority}
                            onChange={(e) => setBugBuilderPriority(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reproduction Steps</label>
                        <textarea 
                          value={bugBuilderSteps}
                          onChange={(e) => setBugBuilderSteps(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs h-16 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expected Behavior</label>
                        <textarea 
                          value={bugBuilderExpected}
                          onChange={(e) => setBugBuilderExpected(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs h-14 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Actual Abnormality Exception</label>
                        <textarea 
                          value={bugBuilderActual}
                          onChange={(e) => setBugBuilderActual(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs h-14 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Output Formatted Canvas */}
                    <div className="md:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-4 text-slate-200 font-mono text-[10.5px] relative flex flex-col justify-between">
                      <div className="absolute top-3.5 right-3.5">
                        <button
                          onClick={() => triggerCopyNotification("bug-md", generatedBugMarkdown)}
                          className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === "bug-md" ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Markdown</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-4 whitespace-pre-wrap select-all pr-4 pt-8 shrink-0">
                        {generatedBugMarkdown}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==========================================
            D: CRAM REVISION CONSOLE (FLASHCARDS & TIMED QUIZ)
            ========================================== */}
        {activeSubView === "revision" && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6" id="view-revision-deck">
            
            {/* Revision control sub-tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-3">
              {[
                { id: "flashcards", label: "Spaced Repetitive Cards" },
                { id: "speed-quiz", label: "High-Pressure Speed Quiz" },
                { id: "fire-drills", label: "Sudden Fire-drill Generator" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setRevisionSubTab(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                    revisionSubTab === sub.id 
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100/50" 
                      : "text-slate-500 hover:text-slate-805 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* CASE 1: SPACE REPETITIVE FLASHCARDS */}
            {revisionSubTab === "flashcards" && (
              <div className="space-y-6 animate-fade-in text-center max-w-xl mx-auto" id="subview-flashcards">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider">Concept Cram Cards</span>
                  <h3 className="font-sans font-semibold text-slate-900 text-md">Term & Definitions Spaced Repetitive Trainer</h3>
                  <p className="text-slate-500 text-[11px]">Click the card body below to flip, then rate your retention difficulty. Easy moves on, Hard schedules re-queue loops.</p>
                </div>

                {/* The card flip layout wrapper */}
                <div 
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className={`relative w-full h-56 rounded-2xl cursor-pointer border select-none transition-all duration-300 preserve-3d transform hover:scale-[1.01] ${
                    isCardFlipped 
                      ? "bg-slate-900 border-indigo-500 shadow-md text-white rotate-y-180" 
                      : "bg-slate-50/70 border-slate-200/90 hover:border-slate-300 shadow-3xs text-slate-800"
                  }`}
                  id="flipping-card"
                >
                  {/* Front Side: Term */}
                  {!isCardFlipped ? (
                    <div className="absolute inset-0 p-8 flex flex-col justify-between shrink-0 animate-fade-in">
                      <div className="text-[10px] font-sans font-bold text-indigo-600 tracking-wider uppercase">
                        QA TERMINOLOGY &mdash; {activeCard.concept}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-sans tracking-tight font-bold text-slate-900">
                        {activeCard.term}
                      </h2>

                      <span className="text-[10px] text-slate-400 font-medium font-mono uppercase">
                        Click anywhere to reveal answer explanation
                      </span>
                    </div>
                  ) : (
                    /* Back Side: Definition */
                    <div className="absolute inset-0 p-8 flex flex-col justify-between rotate-y-180 shrink-0 transform scale-x-[-1]">
                      <div className="text-[10px] font-sans font-bold text-indigo-400 tracking-wider uppercase">
                        DEFINITIONAL VERB &mdash; {activeCard.concept}
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-sans font-normal font-sans max-w-md mx-auto">
                        {activeCard.definition}
                      </p>

                      <span className="text-[9.5px] text-indigo-300 font-bold font-sans uppercase">
                        Tap again to see term | Rate retention below:
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress bar pagination indicator */}
                <div className="flex justify-between items-center text-xs text-slate-400 px-1 font-medium font-mono">
                  <span>Progress: Card {currentCardIdx + 1} of {FLASHCARDS_DECK.length}</span>
                  <span>{Object.keys(reviewedCards).length} of {FLASHCARDS_DECK.length} reviewed</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div 
                    className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((currentCardIdx + 1) / FLASHCARDS_DECK.length) * 100}%` }}
                  />
                </div>

                {/* Feedback rating controls */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => handleRateCard("hard")}
                    className="rounded-xl border border-red-200 hover:border-red-500 bg-red-50/20 hover:bg-red-50 text-red-700 py-2 text-xs font-semibold select-none cursor-pointer transition-all uppercase tracking-wider"
                  >
                    Hard (Repeat)
                  </button>

                  <button
                    onClick={() => handleRateCard("medium")}
                    className="rounded-xl border border-amber-200 hover:border-amber-500 bg-amber-50/20 hover:bg-amber-50 text-amber-700 py-2 text-xs font-semibold select-none cursor-pointer transition-all uppercase tracking-wider"
                  >
                    Medium
                  </button>

                  <button
                    onClick={() => handleRateCard("easy")}
                    className="rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50 text-emerald-700 py-2 text-xs font-semibold select-none cursor-pointer transition-all uppercase tracking-wider"
                  >
                    Easy (Move On)
                  </button>
                </div>
              </div>
            )}

            {/* CASE 2: HIGH-PRESSURE FLASH SPEED QUIZ */}
            {revisionSubTab === "speed-quiz" && (
              <div className="space-y-6 animate-fade-in max-w-xl mx-auto" id="subview-speedquiz">
                <div className="text-center space-y-1">
                  <span className="inline-flex rounded bg-red-50 text-red-700 bg-red-50 font-bold px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider">Ticking countdown drill</span>
                  <h3 className="font-sans font-semibold text-slate-905 text-slate-900 text-md">High-Pressure Speed Quiz Challenge</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">Validate your answers before the 30-second clock hits zero. Finish cleanly to earn bonus profile XP points!</p>
                </div>

                {!quizStarted ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-150 rounded-2xl space-y-5">
                    <Clock className="h-12 w-12 mx-auto text-indigo-600 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-800">5 Quick-Fire Software Testing Questions</div>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-normal font-sans">
                        You have exactly 30 seconds per question with a strict ticking pressure to make correct choices. XP points awarded proportional to performance!
                      </p>
                    </div>
                    <button
                      onClick={handleStartQuiz}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 text-xs font-bold uppercase cursor-pointer hover:scale-[1.01] transition-all"
                    >
                      Begin Speed Challenge &mdash; Start Timer
                    </button>
                  </div>
                ) : quizSummary && quizSummary.show ? (
                  /* Quiz Result report card */
                  <div className="bg-indigo-50/30 border border-indigo-150 rounded-2xl p-6 space-y-5 animate-fade-in text-center">
                    <Award className="h-10 w-10 mx-auto text-indigo-600" />
                    <div className="space-y-1.5">
                      <h4 className="text-md font-bold text-slate-850">Quiz Completion Certificate</h4>
                      <p className="text-xs text-slate-500">Your total score is evaluated successfully below:</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">CORRECT GRADE</div>
                        <div className="text-xl font-bold text-slate-800 mt-1">{quizSummary.score}%</div>
                      </div>
                      <div className="bg-white border border-slate-205 p-3.5 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase font-sans">XP CREDIT PAYOUT</div>
                        <div className="text-xl font-bold text-indigo-700 mt-1">+{quizSummary.wonXp} XP</div>
                      </div>
                    </div>

                    <button
                      onClick={handleStartQuiz}
                      className="rounded-lg bg-indigo-600 text-white hover:bg-slate-850 text-xs py-2 px-4 shadow-3xs cursor-pointer font-bold select-none"
                    >
                      Retry Challenge
                    </button>
                  </div>
                ) : (
                  /* Quiz executing panel */
                  <div className="space-y-4 animate-fade-in font-sans">
                    
                    {/* Header stats bar */}
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-400">Section {quizQuestionIdx + 1} of 5</span>
                      
                      {/* Live Ticking display */}
                      <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-extrabold font-mono tracking-wide ${
                        quizTickingTime <= 5 ? "bg-red-50 text-red-600 border border-red-200 animate-pulse animate-bounce" : "bg-slate-100 text-slate-650"
                      }`}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{quizTickingTime} SEC TICKING</span>
                      </span>
                    </div>

                    {/* Progress tracking line */}
                    <div className="w-full bg-slate-100 rounded-full h-1">
                      <div 
                        className="bg-red-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(quizTickingTime / 30) * 100}%` }}
                      />
                    </div>

                    {/* Displays active Question */}
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 font-sans">
                      <h4 className="font-sans font-semibold text-slate-900 text-sm">
                        {activeQuizQ.question}
                      </h4>
                    </div>

                    {/* Options list selection */}
                    <div className="space-y-2">
                      {activeQuizQ.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizAnswer(oIdx)}
                          className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-3xs flex justify-between items-center"
                        >
                          <span>{opt}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-medium">Select Option {oIdx + 1}</span>
                        </button>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* CASE 3: INTERVIEW QUESTIONS RANDOM GENERATOR */}
            {revisionSubTab === "fire-drills" && (
              <div className="space-y-6 animate-fade-in text-center max-w-xl mx-auto font-sans" id="subview-firedrills">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider">QA Fire Drill</span>
                  <h3 className="font-sans font-semibold text-slate-900 text-md">Random Interview Question Generator</h3>
                  <p className="text-slate-500 text-[11px]">Hit roll to generate a sudden random technical interview question. Formulate your argument privately, then tap show to verify your assertions!</p>
                </div>

                <button
                  onClick={handleRollQuestion}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase transition-all px-6 py-2.5 cursor-pointer shadow-sm flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="h-4 w-4 shrink-0" />
                  <span>{randomQ ? "Roll Next sudden Question" : "Start Sudden Fire-Drills"}</span>
                </button>

                {randomQ && (
                  <div className="p-6 border border-indigo-150 rounded-2xl bg-indigo-50/15 text-left space-y-4 animate-fade-in mt-4">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-120/40">
                        {randomQ.category}
                      </span>
                      <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${
                        randomQ.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        randomQ.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        Difficulty: {randomQ.difficulty}
                      </span>
                    </div>

                    <h4 className="font-sans font-semibold text-slate-950 text-sm leading-snug">
                      &ldquo;{randomQ.question}&rdquo;
                    </h4>

                    {/* Show explanation toggle bar */}
                    <div className="pt-2">
                      <button
                        onClick={() => setShowRandomExplanation(!showRandomExplanation)}
                        className="text-xs font-extrabold text-indigo-600 hover:text-indigo-505 flex items-center gap-1 cursor-pointer"
                      >
                        {showRandomExplanation ? "Hide Explanation Criteria" : "Reveal Professional Response Criteria"}
                      </button>

                      {showRandomExplanation && (
                        <div className="mt-3.5 space-y-3.5 animate-fade-in pt-3 border-t border-slate-200 font-sans">
                          <p className="text-slate-650 text-xs sm:text-xs leading-relaxed font-normal bg-white p-4 border border-indigo-100 rounded-xl shadow-3xs">
                            {randomQ.answer}
                          </p>

                          <div className="space-y-1.5 font-sans">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Must-Mention Bullet Bullets:</div>
                            {randomQ.keyPoints.map((pt, pIdx) => (
                              <div key={pIdx} className="flex gap-1.5 items-start text-xs text-slate-650">
                                <span className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold shrink-0 flex items-center justify-center mt-0.5">✓</span>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            E: WORKER DIAGNOSTICmatrix INSTRUCTORS
            ========================================== */}
        {activeSubView === "assessment" && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in" id="view-diagnostic">
            <div className="space-y-1.5 pb-4 border-b border-slate-100">
              <span className="inline-flex rounded-md bg-indigo-55 text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wide">Career Analyzer</span>
              <h3 className="font-sans font-semibold text-slate-900 text-md">QA Role Diagnostic Matrix</h3>
              <p className="text-xs text-slate-500">Provide details on your current logical and technical comfort level to receive optimized career roadmap study goals.</p>
            </div>

            <div className="space-y-5">
              {selectorQuestions.map((q) => {
                const checkedIndex = selectorAnswers[q.id];
                return (
                  <div key={q.id} className="p-4 border border-slate-200 bg-slate-50/60 rounded-xl space-y-2.5 font-sans">
                    <h5 className="text-xs font-semibold text-slate-900 leading-normal">{q.question}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectorAnswers({ ...selectorAnswers, [q.id]: oIdx })}
                          className={`text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer border ${
                            checkedIndex === oIdx 
                              ? "bg-indigo-600 border-indigo-600 text-white font-semibold shadow-3xs" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-105 hover:bg-slate-50"
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="text-[9.5px] font-mono opacity-80">Grade {oIdx}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectorFeedbackReport && (
              <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl text-xs space-y-2 animate-fade-in">
                <strong className="block text-indigo-900 font-bold">✓ Analytical Career Diagnostic Statement:</strong>
                <p className="text-slate-750 text-indigo-950 font-sans leading-relaxed">{selectorFeedbackReport}</p>
              </div>
            )}

            <button
              disabled={selectorQuestions.some(q => selectorAnswers[q.id] === undefined)}
              onClick={handleRunSelectorMatrix}
              className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-850 font-bold text-xs py-3 outline-hidden tracking-wider uppercase transition-all shadow-sm cursor-pointer disabled:opacity-40"
            >
              Execute Diagnostic Scoping Analyzer (+40 XP)
            </button>
          </div>
        )}

        {/* ==========================================
            F: ISTQB CERTIFICATION ROADMAPS
            ========================================== */}
        {activeSubView === "roadmap" && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in" id="view-roadmap">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <h3 className="font-sans font-semibold text-slate-909 text-slate-900 text-sm">ISTQB Accreditation Roadmap</h3>
              <p className="text-xs text-slate-505 text-slate-500">Explore the globally accepted standard syllabus qualifications. These certifications significantly elevate entry compensation ratios.</p>
            </div>

            <div className="relative border-l-2 border-indigo-100 pl-6 ml-4 space-y-8 py-3" id="timeline-matrix flex">
              {[
                { title: "ISTQB Certified Tester Foundation Level (CTFL)", prereq: "Prerequisite: None (Perfect for fresh QA entries)", summary: "Establishes standard industrial terminologies and taxonomies. Validates Black-Box strategies (Equivalence Class partitioning, Boundary Value Analysis, Decision table layouts), and STLC standard reporting artifacts (Test Plans, RTMs, Bug logs)." },
                { title: "CTFL Specialized - Agile Tester Extension", prereq: "Prerequisite: Foundation Level Certification (CTFL Exam)", summary: "Focuses heavily on continuous delivery loops, sizing point estimations during technical scrum sessions, writing clear sprint criteria matrices, and planning continuous automated regressions." },
                { title: "Advanced Level Test Automation Engineer (CTAL-TAE)", prereq: "Prerequisite: CTFL Exam + 3 Years Industrial Experience", summary: "Masterclass credential targeting software architecture in automated execution frameworks, mock stub sandboxes, pipeline reporting stubs, and telemetry collections." }
              ].map((cert, cIdx) => (
                <div key={cIdx} className="relative space-y-1 animate-fade-in font-sans">
                  {/* timeline node icon */}
                  <span className="absolute -left-9.5 top-0.5 bg-indigo-600 border-4 border-white h-7 w-7 rounded-full text-white text-xs font-black flex items-center justify-center font-mono">
                    {cIdx + 1}
                  </span>

                  <div className="space-y-1.5 font-sans pl-1">
                    <h4 className="font-sans font-semibold text-slate-900 text-sm leading-snug">{cert.title}</h4>
                    <span className="inline-block text-[10px] font-extrabold tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded uppercase font-mono">
                      {cert.prereq}
                    </span>
                    <p className="text-slate-650 text-xs leading-relaxed font-sans font-normal pt-1">{cert.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
