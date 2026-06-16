import React, { useState, useEffect } from "react";
import { 
  Check, 
  X, 
  HelpCircle, 
  BookmarkCheck, 
  ArrowRight, 
  Lightbulb, 
  HeartHandshake, 
  ExternalLink,
  Shuffle,
  ShieldCheck,
  Award,
  Trophy
} from "lucide-react";
import { Module, Section, UserProgress, QuizQuestion, MatchOption, DragDropOption } from "../types";
import QuizModal from "./QuizModal";

interface ModuleViewerProps {
  module: Module;
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export default function ModuleViewer({ module, progress, onUpdateProgress }: ModuleViewerProps) {
  // Store selected sub-section index inside the module
  const [activeTab, setActiveTab] = useState<string>("");

  // Quiz Modal visibility state
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // Quiz active choice tracking state
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [questionId: string]: boolean }>({});

  // Matching pair activity tracking states
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // list of match item IDs completed
  const [matchStatusMsg, setMatchStatusMsg] = useState<string>("");

  // Category Sorting game states
  const [sortedItems, setSortedItems] = useState<{ [itemId: string]: string }>({}); // itemId to categorized choice
  const [sortSubmitted, setSortSubmitted] = useState<boolean>(false);
  const [sortMessage, setSortMessage] = useState<string>("");

  // Case Study QA scores tracking state
  const [caseAnswers, setCaseAnswers] = useState<{ [questionId: string]: number }>({});
  const [caseSubmitted, setCaseSubmitted] = useState<boolean>(false);

  // Set first subsection as active whenever active module shifts
  useEffect(() => {
    if (module && module.sections.length > 0) {
      setActiveTab(module.sections[0].id);
      // Clean up interactive states
      setQuizAnswers({});
      setQuizSubmitted({});
      setSelectedConcept(null);
      setSelectedDescription(null);
      setMatchedPairs([]);
      setMatchStatusMsg("");
      setSortedItems({});
      setSortSubmitted(false);
      setSortMessage("");
      setCaseAnswers({});
      setCaseSubmitted(false);
    }
  }, [module]);

  const currentSection = module.sections.find((s) => s.id === activeTab);

  if (!currentSection) {
    return (
      <div className="p-8 text-center bg-slate-50 border rounded-xl">
        <p className="text-slate-500 text-sm">No section selected. Choose a module from the sidebar.</p>
      </div>
    );
  }

  // Handle section complete marking and award XP
  const handleMarkComplete = () => {
    if (!progress.completedSections.includes(currentSection.id)) {
      const updatedSects = [...progress.completedSections, currentSection.id];
      let newXp = progress.xp + 50; // award 50 XP for reading

      // Dynamic check for Module 1 completion badge
      const unlockedBadges = [...progress.unlockedBadges];
      if (module.id === 1 && !unlockedBadges.includes("intro")) {
        unlockedBadges.push("intro");
        newXp += 100; // bonus badge point
      }

      // Check for basics of testing fundamentals completed badge (Module 2)
      if (module.id === 2 && !unlockedBadges.includes("fundamentals")) {
        const mod2Sects = ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"];
        const hasCompletedAllMod2 = mod2Sects.every((id) => updatedSects.includes(id));
        if (hasCompletedAllMod2) {
          unlockedBadges.push("fundamentals");
          newXp += 150;
        }
      }

      // Check for methodology module badge (Module 5)
      if (module.id === 5 && !unlockedBadges.includes("design") && updatedSects.includes("5.1")) {
        unlockedBadges.push("design");
        newXp += 100;
      }

      // Automatically trigger the Quiz Modal if all sections are completed now
      const isAllSectsCompleted = module.sections.every(s => updatedSects.includes(s.id));
      const previouslyAllCompleted = module.sections.every(s => progress.completedSections.includes(s.id));
      const hasCompletedQuizBefore = progress.completedModuleQuizzes?.includes(module.id);

      if (isAllSectsCompleted && !previouslyAllCompleted && !hasCompletedQuizBefore) {
        setIsQuizOpen(true);
      }

      onUpdateProgress({
        ...progress,
        completedSections: updatedSects,
        xp: newXp,
        unlockedBadges
      });
    }
  };

  const isSectionComplete = progress.completedSections.includes(currentSection.id);

  // Compile all quiz questions defined across the active module's sections
  const moduleQuestions: QuizQuestion[] = module.sections.reduce((acc, s) => {
    if (s.quiz && s.quiz.length > 0) {
      acc.push(...s.quiz);
    }
    return acc;
  }, [] as QuizQuestion[]);

  // Modules metadata tracking for quiz completion
  const isModuleFullyCompleted = module.sections.every((s) => progress.completedSections.includes(s.id));
  const hasTakenQuiz = progress.completedModuleQuizzes?.includes(module.id);
  const bestQuizScore = progress.quizScores?.[module.id] || 0;

  // Submit quiz answer logic
  const handleSelectQuizOption = (qId: string, optIndex: number) => {
    if (quizSubmitted[qId]) return; // lock answer once submitted
    setQuizAnswers({ ...quizAnswers, [qId]: optIndex });
  };

  const handleSubmitQuizQuestion = (q: QuizQuestion) => {
    if (quizAnswers[q.id] === undefined) return;
    
    setQuizSubmitted({ ...quizSubmitted, [q.id]: true });

    // Answer evaluation and XP awards
    const isCorrect = quizAnswers[q.id] === q.correctAnswer;
    if (isCorrect) {
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 25 // 25 XP for correct quiz answer
      });
    }
  };

  // Interactive Match-pairs logic
  const handleMatchClick = (type: "concept" | "description", id: string) => {
    if (type === "concept") {
      setSelectedConcept(id);
      if (selectedDescription) {
        // Evaluate Match Action
        checkPairMatch(id, selectedDescription);
      }
    } else {
      setSelectedDescription(id);
      if (selectedConcept) {
        checkPairMatch(selectedConcept, id);
      }
    }
  };

  const checkPairMatch = (conceptId: string, descId: string) => {
    if (conceptId === descId) {
      // Correct Match Pair
      const newMatched = [...matchedPairs, conceptId];
      setMatchedPairs(newMatched);
      setMatchStatusMsg("Excellent Match Found! +15 XP");
      setSelectedConcept(null);
      setSelectedDescription(null);

      // Award XP
      const testCasesSnd = [...progress.completedSections];
      let plusXp = 15;
      if (currentSection.matchPairs && newMatched.length === currentSection.matchPairs.length) {
        setMatchStatusMsg("Awesome! All Pairs Completed Successfully! +50 XP Bonus");
        plusXp += 50; // extra complete bonus
      }
      onUpdateProgress({
        ...progress,
        xp: progress.xp + plusXp
      });
    } else {
      // Incorrect mismatch
      setMatchStatusMsg("Mismatch, please review the definition card again.");
      setTimeout(() => {
        setSelectedConcept(null);
        setSelectedDescription(null);
      }, 800);
    }
  };

  // Sorting Categorization game logic
  const handleSortItemClick = (itemId: string, category: string) => {
    if (sortSubmitted) return;
    setSortedItems({ ...sortedItems, [itemId]: category });
  };

  const handleSubmitSortingGame = () => {
    if (!currentSection.sortOptions) return;
    
    const allRight = currentSection.sortOptions.every(
      (opt) => sortedItems[opt.id] === opt.category
    );

    setSortSubmitted(true);
    if (allRight) {
      setSortMessage("Absolutely Spot-on! You categorized all elements 100% correctly! +75 XP");
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 75
      });
    } else {
      setSortMessage("Not quite perfect. Review structural paths vs performance parameters and retry!");
    }
  };

  const handleResetSortingGame = () => {
    setSortedItems({});
    setSortSubmitted(false);
    setSortMessage("");
  };

  // Case Study questions validation logic
  const handleCaseSelect = (qId: string, index: number) => {
    if (caseSubmitted) return;
    setCaseAnswers({ ...caseAnswers, [qId]: index });
  };

  const handleSubmitCaseStudy = () => {
    if (!currentSection.caseStudy) return;

    const allCorrect = currentSection.caseStudy.questions.every(
      (q) => caseAnswers[q.id] === q.correct
    );

    setCaseSubmitted(true);
    if (allCorrect) {
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 80 // massive case study bonus
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="module-viewer-arena">
      
      {/* Module Title Jumbotron Panel */}
      <div className="rounded-xl bg-white border border-slate-100 p-6 shadow-sm">
        <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Module {module.id}</p>
        <h1 className="font-sans font-medium text-2xl text-slate-900 mt-1 leading-tight">{module.title}</h1>
        <p className="text-slate-500 text-sm mt-2">{module.description}</p>

        {/* Sub-Tabs Nav bar inside modern frame */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-150 pt-5 pr-1 scrollbar-none" id="subsection-tabs-rail">
          {module.sections.map((sect) => {
            const isCompletedSect = progress.completedSections.includes(sect.id);
            return (
              <button
                key={sect.id}
                onClick={() => setActiveTab(sect.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === sect.id 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                {isCompletedSect && <BookmarkCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                <span>{sect.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Quiz Completion CTA Banner */}
      {isModuleFullyCompleted && (
        <div id="module-completion-banner" className="p-6 bg-gradient-to-r from-indigo-50/75 to-indigo-100/40 border border-indigo-250 border-indigo-200 text-slate-900 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-4 text-left">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Trophy className="h-6 w-6 text-amber-350" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-slate-900 text-sm flex flex-wrap items-center gap-2">
                <span>Quiz Assessment Ready for Module {module.id}!</span>
                {hasTakenQuiz && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Completed Best: {bestQuizScore}%
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                You have successfully completed every lecture section in this module. Challenge yourself in the comprehensive final assessment exam to receive bonus XP rewards and unlock high-tier QA badges!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuizOpen(true)}
            id="start-module-exam-btn"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0 cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Award className="h-4 w-4" />
            <span>{hasTakenQuiz ? "Retake Exam Quiz" : "Start Module Quiz (+150 XP)"}</span>
          </button>
        </div>
      )}

      {/* Structured Theory layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-sm space-y-8">
            
            {/* Header section complete action */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400">LECTURE SECTION CONTENT</span>
              <button
                id="mark-complete-btn"
                onClick={handleMarkComplete}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-all ${
                  isSectionComplete 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-indigo-600 border-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                }`}
              >
                <Check className="h-4 w-4" />
                <span>{isSectionComplete ? "Completed ✓ (+50 XP Claimed)" : "Mark Lecture Completed (+50 XP)"}</span>
              </button>
            </div>

            {/* WHAT Card */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                  <Lightbulb className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-sans font-semibold text-slate-900 text-md">What: Definition & Concept</h3>
              </div>
              <p className="text-slate-650 text-sm leading-relaxed font-sans">{currentSection.content.what}</p>
            </div>

            {/* WHEN & WHY split grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                  When to use?
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">{currentSection.content.whenToUse}</p>
              </div>

              <div className="space-y-2 p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/40">
                <h4 className="font-semibold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  Why is it critical?
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">{currentSection.content.whyToUse}</p>
              </div>
            </div>

            {/* HOW to use - step list */}
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-slate-900 text-sm">How to Apply (Practical Steps)</h3>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <ul className="space-y-3">
                  {currentSection.content.howToUse.split("\n").map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-relaxed font-sans">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step.substring(3)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Structured Examples list */}
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-slate-900 text-sm">Real-world Analogy & Examples</h3>
              <div className="grid grid-cols-1 gap-4">
                {currentSection.content.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-indigo-100/50 bg-indigo-50/10 flex gap-3">
                    <div className="text-indigo-600 shrink-0 mt-0.5">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-indigo-900">
                        {ex.startsWith("Analogy:") ? "Corporate Analogy" : ex.startsWith("Historical") ? "Historical Failure Case Study" : "Production Example"}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {ex.substring(ex.indexOf(":") === -1 ? 0 : ex.indexOf(":") + 2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive activities container */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 flex flex-col justify-between" id="section-interactive-workspace">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">SKILLS CHECK</span>
              <h2 className="font-sans font-medium text-lg text-slate-900">Interactive Learning Sandbox</h2>
              <p className="text-slate-500 text-xs">Analyze the concept and perform the interactive lesson check below to secure bonus validation XP.</p>
            </div>

            {/* Option A: Case Study Panel */}
            {currentSection.caseStudy && (
              <div className="space-y-6 pt-4" id="case-study-activity">
                <div className="p-5 rounded-xl bg-slate-900 text-slate-100 border border-slate-850 space-y-3">
                  <h3 className="font-sans font-medium text-amber-400 text-sm tracking-tight flex items-center gap-1.5">
                    <Award className="h-5 w-5 text-amber-500" />
                    Regressive Review: {currentSection.caseStudy.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-xs leading-relaxed font-mono">
                    {currentSection.caseStudy.scenario}
                  </p>
                </div>

                <div className="space-y-6">
                  {currentSection.caseStudy.questions.map((q) => {
                    const isCorrect = caseAnswers[q.id] === q.correct;
                    return (
                      <div key={q.id} className="space-y-3 p-4 rounded-xl border border-slate-150">
                        <div className="text-xs font-semibold text-slate-900">{q.question}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.choices.map((choice, cidx) => {
                            const isSelected = caseAnswers[q.id] === cidx;
                            return (
                              <button
                                key={cidx}
                                disabled={caseSubmitted}
                                onClick={() => handleCaseSelect(q.id, cidx)}
                                className={`text-left p-3 rounded-lg text-xs leading-normal transition-all font-medium cursor-pointer border ${
                                  isSelected 
                                    ? "bg-indigo-600 border-indigo-600 text-white" 
                                    : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                        {caseSubmitted && (
                          <div className={`p-3 rounded-lg text-xs mt-2 ${
                            isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                          }`}>
                            <strong>{isCorrect ? "✓ Correct Answer!" : "✗ Revision Needed."}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!caseSubmitted ? (
                  <button
                    onClick={handleSubmitCaseStudy}
                    disabled={currentSection.caseStudy.questions.some(q => caseAnswers[q.id] === undefined)}
                    className="w-full rounded-lg bg-indigo-600 text-white font-semibold text-xs py-2.5 hover:bg-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Submit Case Study Assessment
                  </button>
                ) : (
                  <button
                    onClick={() => { setCaseAnswers({}); setCaseSubmitted(false); }}
                    className="w-full rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Reset & Retake Case Study
                  </button>
                )}
              </div>
            )}

            {/* Option B: Active Multi-choice Quiz Questions */}
            {currentSection.quiz && currentSection.quiz.length > 0 && (
              <div className="space-y-8 pt-4" id="quiz-question-activity">
                {currentSection.quiz.map((q) => {
                  const hasSubmitted = quizSubmitted[q.id];
                  const selectedIndex = quizAnswers[q.id];
                  const isCorrect = selectedIndex === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-5 border border-slate-150 rounded-xl space-y-4 shadow-xs">
                      <div className="flex gap-2.5 items-start">
                        <span className="mt-0.5 rounded-full bg-slate-100 p-1 text-slate-600">
                          <HelpCircle className="h-4 w-4" />
                        </span>
                        <div className="text-xs font-semibold text-slate-950 leading-relaxed font-sans">{q.question}</div>
                      </div>

                      <div className="space-y-2 mt-3" id={`options-grid-${q.id}`}>
                        {q.options.map((opt, oIdx) => {
                          const isOptionSelected = selectedIndex === oIdx;
                          let btnStyle = "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";

                          if (hasSubmitted) {
                            if (oIdx === q.correctAnswer) {
                              btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium";
                            } else if (isOptionSelected) {
                              btnStyle = "bg-red-50 border-red-300 text-red-800";
                            } else {
                              btnStyle = "bg-white border-slate-150 text-slate-400 opacity-60";
                            }
                          } else if (isOptionSelected) {
                            btnStyle = "bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold";
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={hasSubmitted}
                              onClick={() => handleSelectQuizOption(q.id, oIdx)}
                              className={`w-full text-left p-3.5 rounded-lg border text-xs leading-normal transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasSubmitted && oIdx === q.correctAnswer && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                              {hasSubmitted && isOptionSelected && oIdx !== q.correctAnswer && <X className="h-4 w-4 text-red-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quiz validation feedback */}
                      {hasSubmitted && (
                        <div className={`p-4 rounded-lg text-xs leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-55/10 bg-red-50 text-red-800"}`} id={`quiz-feedback-${q.id}`}>
                          <strong className="block font-bold mb-1">{isCorrect ? "✓ Correct Answer! (+25 XP)" : "✗ Incorrect Select."}</strong>
                          <p>{q.explanation}</p>
                        </div>
                      )}

                      {!hasSubmitted && (
                        <button
                          onClick={() => handleSubmitQuizQuestion(q)}
                          disabled={selectedIndex === undefined}
                          className="mt-2 text-xs font-semibold bg-slate-900 text-white rounded-lg px-4 py-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          Lock Answer & Validate
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Option C: Dynamic Matching pairs layout */}
            {currentSection.matchPairs && currentSection.matchPairs.length > 0 && (
              <div className="space-y-4 pt-4" id="match-pairs-activity">
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  <strong>Instructions:</strong> Match concepts to corresponding definitions. Select one concept from list Left, then match the corresponding explanation card on list Right.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Concept panel */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Testing Concepts</div>
                    {currentSection.matchPairs.map((pair) => {
                      const isMatched = matchedPairs.includes(pair.id);
                      const isSelected = selectedConcept === pair.id;
                      
                      return (
                        <button
                          key={pair.id}
                          disabled={isMatched}
                          onClick={() => handleMatchClick("concept", pair.id)}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                            isMatched 
                              ? "bg-slate-50 border-emerald-200 text-slate-400 line-through" 
                              : isSelected 
                                ? "bg-indigo-600 border-indigo-600 text-white scale-[1.01]" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50/80"
                          }`}
                        >
                          {pair.concept}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Description panel */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Explanations</div>
                    {currentSection.matchPairs
                      .map((p) => p) // keep referential stability and map description cards
                      .sort((a, b) => a.id.localeCompare(b.id) * -1) // simple reverse sort key for scramble effect
                      .map((pair) => {
                        const isMatched = matchedPairs.includes(pair.id);
                        const isSelected = selectedDescription === pair.id;

                        return (
                          <button
                            key={pair.id}
                            disabled={isMatched}
                            onClick={() => handleMatchClick("description", pair.id)}
                            className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                              isMatched 
                                ? "bg-slate-50 border-emerald-200 text-slate-400 line-through" 
                                : isSelected 
                                  ? "bg-indigo-600 border-indigo-600 text-white scale-[1.01]" 
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50/80"
                            }`}
                          >
                            {pair.description}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {matchStatusMsg && (
                  <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-lg text-center font-semibold text-xs text-indigo-800 animate-pulse">
                    {matchStatusMsg}
                  </div>
                )}

                {matchedPairs.length === currentSection.matchPairs.length && (
                  <button
                    onClick={() => setMatchedPairs([])}
                    className="mt-2 w-full rounded-lg bg-slate-105 border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Reset & Retake Matching Game
                  </button>
                )}
              </div>
            )}

            {/* Option D: Drag & Click sorting game */}
            {currentSection.sortOptions && currentSection.sortOptions.length > 0 && (
              <div className="space-y-6 pt-4" id="sorting-game-activity">
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <strong>Testing Categories Matrix:</strong> Sort the following testing methodologies into their accurate parent categories: <strong>Functional</strong>, <strong>Non-Functional</strong>, or <strong>Structural</strong>.
                </div>

                <div className="space-y-4">
                  {currentSection.sortOptions.map((opt) => {
                    const activeChoice = sortedItems[opt.id];

                    return (
                      <div key={opt.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="inline-flex rounded bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 text-[9px] uppercase tracking-wide">Method</span>
                          <div className="text-xs font-semibold text-slate-900">{opt.label}</div>
                          <p className="text-[11px] text-slate-500">{opt.description}</p>
                        </div>

                        {/* Category selection selector */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                          {["functional", "non-functional", "structural"].map((cat) => {
                            const isSelected = activeChoice === cat;
                            let btnStyle = "bg-white border-slate-200 text-slate-600 hover:bg-slate-100";

                            if (isSelected) {
                              if (sortSubmitted) {
                                btnStyle = opt.category === cat 
                                  ? "bg-emerald-500 border-emerald-500 text-white" 
                                  : "bg-red-500 border-red-500 text-white";
                              } else {
                                btnStyle = "bg-indigo-600 border-indigo-600 text-white";
                              }
                            }

                            return (
                              <button
                                key={cat}
                                disabled={sortSubmitted}
                                onClick={() => handleSortItemClick(opt.id, cat)}
                                className={`px-2.5 py-1.5 rounded-md border text-[10px] uppercase font-bold tracking-tight cursor-pointer transition-all ${btnStyle}`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sortMessage && (
                  <div className={`p-3 rounded-lg text-center font-semibold text-xs ${
                    sortMessage.includes("Spot-on") ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                  }`}>
                    {sortMessage}
                  </div>
                )}

                <div className="flex gap-4">
                  {!sortSubmitted ? (
                    <button
                      onClick={handleSubmitSortingGame}
                      disabled={currentSection.sortOptions.some(o => !sortedItems[o.id])}
                      className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 transition-all cursor-pointer disabled:opacity-40"
                    >
                      Assess Categorized Alignment
                    </button>
                  ) : (
                    <button
                      onClick={handleResetSortingGame}
                      className="w-full rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      Reset & Try Sorting Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info/Navigation blocks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Subsections progress block */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Module Summary Checklist</h4>
            <div className="space-y-2">
              {module.sections.map((sect) => {
                const isActive = activeTab === sect.id;
                const isCompleted = progress.completedSections.includes(sect.id);

                return (
                  <div 
                    key={sect.id} 
                    onClick={() => setActiveTab(sect.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      isActive ? "bg-indigo-50/50 text-indigo-900 font-semibold" : "text-slate-650 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className={`shrink-0 rounded-full h-4.5 w-4.5 border flex items-center justify-center text-[10px] ${
                      isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 bg-white text-slate-400"
                    }`}>
                      {isCompleted ? "✓" : ""}
                    </div>
                    <span className="truncate">{sect.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theoretical Cheat-sheet card */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              Syllabus Study Tip
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Theoretical structures establish confidence. QAs look past positive variables inputs ('Is the email correct?') to inspect unexpected negative scenarios ('What happens when user types numeric scripts or loads the payment button 10 times concurrent?'). Use these study materials to program boundary value assertions.
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Quiz Modal Assessment overlay */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        moduleId={module.id}
        moduleTitle={module.title}
        questions={moduleQuestions}
        progress={progress}
        onUpdateProgress={onUpdateProgress}
      />
    </div>
  );
}
