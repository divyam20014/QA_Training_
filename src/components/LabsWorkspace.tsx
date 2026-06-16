import React, { useState } from "react";
import { 
  Bug, 
  Cpu, 
  Terminal, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Play, 
  RotateCcw, 
  Layers, 
  Send, 
  Info, 
  Plus, 
  Trash2,
  BookmarkCheck,
  Bot
} from "lucide-react";
import { UserProgress } from "../types";

interface LabsWorkspaceProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

interface TestCaseDraft {
  title: string;
  steps: string;
  expected: string;
}

export default function LabsWorkspace({ progress, onUpdateProgress }: LabsWorkspaceProps) {
  // Navigation tabs inside the Lab workspace
  const [activeLab, setActiveLab] = useState<string>("sandbox");

  // ==========================================
  // LAB 5 STATE: AI TEST GENERATOR MODULE
  // ==========================================
  const [requirementInput, setRequirementInput] = useState<string>("User Profile Upload Form with JPEG/PNG restrictions and size bounds of 5MB.");
  const [generationFormat, setGenerationFormat] = useState<string>("automated"); // 'manual' | 'automated'
  const [generatedCases, setGeneratedCases] = useState<string>("");
  const [genLoading, setGenLoading] = useState<boolean>(false);

  const handleGenerateCases = async () => {
    if (!requirementInput.trim()) return;
    setGenLoading(true);
    setGeneratedCases("");
    try {
      const res = await fetch("/api/generate-test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: requirementInput,
          format: generationFormat
        })
      });
      const data = await res.json();
      setGeneratedCases(data.testCases || "");

      // Reward XP for using tools
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 40,
        labsCompleted: progress.labsCompleted.includes("ai-generator") ? progress.labsCompleted : [...progress.labsCompleted, "ai-generator"]
      });
    } catch (err) {
      console.error(err);
      setGeneratedCases("// Gateway error formulation. Try again.");
    } finally {
      setGenLoading(false);
    }
  };

  // ==========================================
  // LAB 6 STATE: SMART BUG TICKET FORMATTER
  // ==========================================
  const [bugRawInput, setBugRawInput] = useState<string>("i tried checking out with 2 items and it crashed immediately when i typed promo code FATAL_ERROR. it showed a long database trace inside dynamic SQL and returned blank screens on chrome.");
  const [formattedBugTicket, setFormattedBugTicket] = useState<string>("");
  const [formattingLoading, setFormattingLoading] = useState<boolean>(false);

  const handleFormatBugTicket = async () => {
    if (!bugRawInput.trim()) return;
    setFormattingLoading(true);
    setFormattedBugTicket("");
    try {
      const res = await fetch("/api/format-bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: bugRawInput
        })
      });
      const data = await res.json();
      setFormattedBugTicket(data.formattedReport || "");

      // Reward XP for using diagnostics formatter
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 40,
        labsCompleted: progress.labsCompleted.includes("ai-bug-form") ? progress.labsCompleted : [...progress.labsCompleted, "ai-bug-form"]
      });
    } catch (err) {
      console.error(err);
      setFormattedBugTicket("Failed to translate bug. Check connectivity and credentials.");
    } finally {
      setFormattingLoading(false);
    }
  };

  // ==========================================
  // LAB 1 STATE: BUG HUNTING FORM SANDBOX
  // ==========================================
  const [itemCount, setItemCount] = useState<string>("1");
  const [promoCode, setPromoCode] = useState<string>("");
  const [cardNo, setCardNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [sandboxReport, setSandboxReport] = useState<string>("Checkout success.");
  const [sandboxCrash, setSandboxCrash] = useState<boolean>(false);
  const [isFormPatched, setIsFormPatched] = useState<boolean>(false);

  // User bug hunting reporting states
  const [selectedBugTitle, setSelectedBugTitle] = useState<string>("");
  const [bugExp, setBugExp] = useState<string>("");
  const [bugAct, setBugAct] = useState<string>("");
  const [foundBugs, setFoundBugs] = useState<string[]>([]); // list of developer keys unlocked: "neg-items", "promo-crash", "short-card", "sql-inject"
  const [huntFeedback, setHuntFeedback] = useState<string>("");

  const hiddenBugsCatalog = [
    { id: "neg-items", keyPhrase: "-5", title: "Checkout succeeds on negative item count quantity (-5 items)" },
    { id: "promo-crash", keyPhrase: "FATAL_ERROR", title: "Promo code 'FATAL_ERROR' outputs database thread crash" },
    { id: "short-card", keyPhrase: "123", title: "Payment accepts cards with less than 8 digits" },
    { id: "sql-inject", keyPhrase: "' OR '1'='1", title: "Email accepts raw SQL character sequence variables" }
  ];

  const handleCheckoutSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    setSandboxCrash(false);

    // If patched, enforce rigid clean UI validations
    if (isFormPatched) {
      const itemsNumeric = parseInt(itemCount);
      if (isNaN(itemsNumeric) || itemsNumeric <= 0) {
        setSandboxReport("Validation Error: Item quantities must be greater than zero.");
        return;
      }
      if (promoCode === "FATAL_ERROR") {
        setSandboxReport("Validation Error: Invalid or unrecognized promotional code.");
        return;
      }
      if (cardNo.length < 12) {
        setSandboxReport("Validation Error: Credit Card numbers must contain minimum 12 digits.");
        return;
      }
      if (email.includes("'") || email.includes("SELECT") || email.includes("OR")) {
        setSandboxReport("Validation Error: Invalid security characters detected in email.");
        return;
      }
      setSandboxReport("Order processed successfully under patched security validations!");
      return;
    }

    // Bug evaluations:
    if (promoCode.toUpperCase().trim() === "FATAL_ERROR") {
      setSandboxCrash(true);
      setSandboxReport("INTERNAL_DATABASE_EXCEPTION: Syntax error at or near 'LIMIT' thread block.");
      return;
    }

    const valNumeric = parseInt(itemCount);
    if (valNumeric < 0) {
      setSandboxReport(`Order complete! Billed $${valNumeric * 49} for negative elements successfully.`);
      return;
    }

    if (cardNo.length > 0 && cardNo.length < 8) {
      setSandboxReport("Payment Accepted. Balance charged on truncated bank parameters.");
      return;
    }

    if (email.includes("' OR '1'='1") || email.includes("SELECT")) {
      setSandboxReport("Query complete! Database elements returned: dump_users_tables, hash_pwds.");
      return;
    }

    setSandboxReport("Checkout completed successfully.");
  };

  const handleReportBug = () => {
    if (!selectedBugTitle) return;

    // Determine if reported inputs match actual bugs
    const targetBug = hiddenBugsCatalog.find(b => b.id === selectedBugTitle);

    if (targetBug) {
      if (foundBugs.includes(targetBug.id)) {
        setHuntFeedback("You already cataloged and documented this defect successfully.");
        return;
      }

      const freshBugs = [...foundBugs, targetBug.id];
      setFoundBugs(freshBugs);
      setHuntFeedback(`✓ Correct Bug Identified! ${targetBug.title}. +50 XP Awarded.`);

      let newXp = progress.xp + 50;
      const unlockedBadges = [...progress.unlockedBadges];

      // Unlock Elite Bug hunter if all 4 are uncovered
      if (freshBugs.length === 4 && !unlockedBadges.includes("sandbox")) {
        unlockedBadges.push("sandbox");
        newXp += 150; // badge completion prize
        setHuntFeedback("✓ STUNNING! You found all 4 hidden defects. Elite Bug Hunter badge UNLOCKED! +150 XP Bonus!");
      }

      onUpdateProgress({
        ...progress,
        xp: newXp,
        unlockedBadges,
        labsCompleted: progress.labsCompleted.includes("sandbox") ? progress.labsCompleted : [...progress.labsCompleted, "sandbox"]
      });

      // Clear report fields
      setSelectedBugTitle("");
      setBugExp("");
      setBugAct("");
    }
  };

  const handleApplyFormPatch = () => {
    setIsFormPatched(true);
    setSandboxCrash(false);
    setSandboxReport("Patch Deployed! Testing boundaries have been structurally locked.");
  };

  // ==========================================
  // LAB 2 STATE: AUTOMATION SCRIPT PLAYER
  // ==========================================
  const [isRunningScript, setIsRunningScript] = useState<boolean>(false);
  const [activeScriptLine, setActiveScriptLine] = useState<number>(-1);
  const [simulatedBrowserUrl, setSimulatedBrowserUrl] = useState<string>("chrome://newtab");
  const [simViewportHtml, setSimViewportHtml] = useState<{ username: string; status: string }>({ username: "", status: "Please sign in." });

  const cypressScript = [
    { code: "cy.visit('/profile_landing')", action: () => { setSimulatedBrowserUrl("https://academy.qa/profile_landing"); } },
    { code: "cy.get('#username').type('QA_Master')", action: () => { setSimViewportHtml(prev => ({ ...prev, username: "QA_Master" })); } },
    { code: "cy.get('#submit-login').click()", action: () => { setSimViewportHtml(prev => ({ ...prev, status: "Verifying Authentication..." })); } },
    { code: "cy.wait(800)", action: () => {} },
    { code: "cy.assert('#status', 'Access Granted')", action: () => { setSimViewportHtml(prev => ({ ...prev, status: "Access Granted ✓ Welcome, QA_Master!" })); } }
  ];

  const handlePlayAutomation = () => {
    setIsRunningScript(true);
    setActiveScriptLine(0);
    
    // Serialized execution delays mimicking dynamic loops
    cypressScript.forEach((step, idx) => {
      setTimeout(() => {
        setActiveScriptLine(idx);
        step.action();
        
        if (idx === cypressScript.length - 1) {
          setIsRunningScript(false);
          // Unlock automation badges
          let newXp = progress.xp + 50;
          const unlockedBadges = [...progress.unlockedBadges];
          if (!unlockedBadges.includes("automation")) {
            unlockedBadges.push("automation");
            newXp += 100;
          }
          onUpdateProgress({
            ...progress,
            xp: newXp,
            unlockedBadges,
            labsCompleted: progress.labsCompleted.includes("automation") ? progress.labsCompleted : [...progress.labsCompleted, "automation"]
          });
        }
      }, (idx + 1) * 1100);
    });
  };

  const handleResetBrowserSim = () => {
    setActiveScriptLine(-1);
    setSimulatedBrowserUrl("chrome://newtab");
    setSimViewportHtml({ username: "", status: "Please sign in." });
  };

  // ==========================================
  // LAB 3 STATE: MANUAL TEST CASE REVIEWER (AI-POWERED)
  // ==========================================
  const requirementStatement = "Verify validation criteria for a multi-currency ATM terminal that supports cash withdraw amounts from minimum of $20 up to maximum of $500 per transaction, and displays out-of-balance warnings.";
  
  const [draftedCases, setDraftedCases] = useState<TestCaseDraft[]>([
    { title: "Withdraw valid median value $100", steps: "1. Insert valid debit card.\n2. Key in amount option $100.\n3. Push withdraw validation.", expected: "Cash is dispensed, balance adjusts." }
  ]);

  const [aiReviewScore, setAiReviewScore] = useState<number | null>(null);
  const [aiReviewGrade, setAiReviewGrade] = useState<string>("");
  const [aiReviewFeedback, setAiReviewFeedback] = useState<string>("");
  const [aiReviewMissing, setAiReviewMissing] = useState<string[]>([]);
  const [aiIsLoading, setAiIsLoading] = useState<boolean>(false);

  // ==========================================
  // LAB 4 STATE: CORPORATE BUG TRIAGING GAME
  // ==========================================
  const [triageIndex, setTriageIndex] = useState<number>(0);
  const [userSeverity, setUserSeverity] = useState<string>("");
  const [userPriority, setUserPriority] = useState<string>("");
  const [triageEvaluated, setTriageEvaluated] = useState<boolean>(false);
  const [triageScore, setTriageScore] = useState<number>(0);
  const [triageSubmittedCount, setTriageSubmittedCount] = useState<number>(0);
  const [triageFeedback, setTriageFeedback] = useState<string>("Awaiting Your Triaging Selection");
  const [triageIsComplete, setTriageIsComplete] = useState<boolean>(false);

  const triageIssues = [
    {
      id: "tr-1",
      title: "SQL Injection vulnerability on checkout payment page",
      description: "Entering specialized query comments (e.g. ' OR '1'='1) into the voucher input field allows full access to the users database keys and raw credential dumps.",
      correctSeverity: "Blocker",
      correctPriority: "High",
      severityExplanation: "Because it represents a catastrophic security vulnerability exposing confidential customer credit codes and personal password hashes, completely violating compliance.",
      priorityExplanation: "Must be addressed immediately to prevent legal breaches, customer data leakages, and reputational collapse."
    },
    {
      id: "tr-2",
      title: "System crashes when purchasing element ID 9999",
      description: "Whenever a customer attempts to click purchase on 'Product ID 9999' (a special seasonal discount tier), the system locks up, triggers a NullPointer error, and crashes the app server.",
      correctSeverity: "Critical",
      correctPriority: "High",
      severityExplanation: "A system crash with no visible workaround represents Critical severity.",
      priorityExplanation: "It blocks direct financial transactions and conversion pathways on a major promotional tier (High Priority)."
    },
    {
      id: "tr-3",
      title: "Corporate brand logo is rotated upside down on landing page",
      description: "The primary high-resolution SVG company trademark asset is styled with an incorrect standard rotation matrix, causing the logo to appear upside-down exclusively on standard desktop viewports.",
      correctSeverity: "Minor",
      correctPriority: "High",
      severityExplanation: "It is a purely visual, cosmetic asset layout error that does not impede any shopping, searching, or payment functionality (Minor Severity).",
      priorityExplanation: "The main page logo represents the core visible face of the firm. An upside-down logo looks highly ameteurish and instantly damages customer trust, requiring immediate priority (High Priority)."
    },
    {
      id: "tr-4",
      title: "Terms and Services page contains spelling mistake ('Agreemunt')",
      description: "In the 4th sub-clause of the long Legal Terms of Agreement policy scrolling text, the word 'Agreement' is written as 'Agreemunt'.",
      correctSeverity: "Minor",
      correctPriority: "Low",
      severityExplanation: "It is a microscopic text typo in a nested, rarely-visited static text block with zero operational impact (Minor Severity).",
      priorityExplanation: "Most users do not read or load long legally detailed terms pages. The business impact is negligible, and it can safely be batched into future routine content releases (Low Priority)."
    },
    {
      id: "tr-5",
      title: "Checkout payment loading has a slow 4-seconds latency delay",
      description: "When submitting order sheets, the confirmation loader spinner rotates for 4 full seconds before rendering the 'Receipt OK' screen. However, transactions always settle correctly.",
      correctSeverity: "Major",
      correctPriority: "Medium",
      severityExplanation: "Slow user experiences are performance deviations that negatively impact conversion but do not completely break operations or lose transactions (Major Severity).",
      priorityExplanation: "While annoying and affecting checkout completion conversion, it doesn't represent a terminal crash or a blank screen, allowing scheduling within standard sprint cycles (Medium Priority)."
    }
  ];

  const handleEvaluateTriageDecision = () => {
    const current = triageIssues[triageIndex];
    const isSevCorrect = userSeverity === current.correctSeverity;
    const isPriCorrect = userPriority === current.correctPriority;

    let pointsEarned = 0;
    let textFeedback = "";

    if (isSevCorrect && isPriCorrect) {
      pointsEarned = 30;
      textFeedback = "PERFECT TRIAGE DECISION! Your assessment aligns 100% with standard industrial metrics. +30 XP credited!";
      setTriageScore(prev => prev + 1);
    } else if (isSevCorrect || isPriCorrect) {
      pointsEarned = 15;
      textFeedback = `PARTIAL ALIGNMENT. You mapped ${isSevCorrect ? "Severity" : "Priority"} correctly, but missed the other parameter. +15 XP credited. Check the explanation below.`;
    } else {
      pointsEarned = 0;
      textFeedback = "TRIAGE MISALIGNMENT. Your assessment departed from quality assurance standards. Study the details below.";
    }

    setTriageSubmittedCount(prev => prev + 1);
    setTriageEvaluated(true);
    setTriageFeedback(textFeedback);

    // credit points to global progress state
    onUpdateProgress({
      ...progress,
      xp: progress.xp + pointsEarned
    });
  };

  const handleNextTriageScenario = () => {
    setUserSeverity("");
    setUserPriority("");
    setTriageEvaluated(false);
    setTriageFeedback("Awaiting Your Triaging Selection");

    if (triageIndex < triageIssues.length - 1) {
      setTriageIndex(prev => prev + 1);
    } else {
      setTriageIsComplete(true);
      // mark triage lab complete in UserProgress
      onUpdateProgress({
        ...progress,
        labsCompleted: progress.labsCompleted.includes("triage") ? progress.labsCompleted : [...progress.labsCompleted, "triage"]
      });
    }
  };

  const handleRestartTriageLab = () => {
    setTriageIndex(0);
    setUserSeverity("");
    setUserPriority("");
    setTriageEvaluated(false);
    setTriageScore(0);
    setTriageSubmittedCount(0);
    setTriageFeedback("Awaiting Your Triaging Selection");
    setTriageIsComplete(false);
  };

  const handleAddTestCaseRow = () => {
    setDraftedCases([...draftedCases, { title: "", steps: "", expected: "" }]);
  };

  const handleUpdateCaseRow = (idx: number, field: keyof TestCaseDraft, value: string) => {
    const updated = [...draftedCases];
    updated[idx][field] = value;
    setDraftedCases(updated);
  };

  const handleRemoveCaseRow = (idx: number) => {
    const updated = draftedCases.filter((_, i) => i !== idx);
    setDraftedCases(updated);
  };

  const handleSponsorTestCaseReview = async () => {
    setAiIsLoading(true);
    setAiReviewScore(null);

    try {
      const response = await fetch("/api/evaluate-test-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: requirementStatement,
          testCases: draftedCases
        })
      });

      const data = await response.json();
      setAiIsLoading(false);
      setAiReviewScore(data.score || 85);
      setAiReviewGrade(data.grade || "Accepted Strategy");
      setAiReviewFeedback(data.feedback || "Your configuration covers standard positive parameters. Let's incorporate negative values.");
      setAiReviewMissing(data.missingEdgeCases || ["Boundary limit checks at $19", "Boundary limit checks at $501"]);

      // Reward XP for completed engineering review
      onUpdateProgress({
        ...progress,
        xp: progress.xp + 100,
        labsCompleted: progress.labsCompleted.includes("manual-draft") ? progress.labsCompleted : [...progress.labsCompleted, "manual-draft"]
      });

    } catch (err) {
      console.error(err);
      setAiIsLoading(false);
      // fallback
      setAiReviewScore(80);
      setAiReviewGrade("Review Approved");
      setAiReviewFeedback("The team lead reviewed your ATM testing suite. Your median tests have clearExpected Results. Be sure to add off-by-one calculations.");
      setAiReviewMissing(["ATM withdrawals exactly at $20 and $500", "Simulating cartridge empty hardware disruptions"]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="labs-workspace-container">
      
      {/* Labs Header */}
      <div className="rounded-xl bg-white border border-slate-100 p-6 shadow-sm">
        <h1 className="font-sans font-medium text-2xl text-slate-900 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-indigo-600" />
          Interactive Hands-on Labs
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Apply theoretical testing concepts within live runtime mockups, terminals, and AI-enabled peer assessment canvases.
        </p>

        {/* Labs Nav Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-150 pt-5" id="labs-navigation-tabs">
          {[
            { id: "sandbox", label: "Lab 1: Bug Hunting Sandbox", icon: Bug },
            { id: "automation", label: "Lab 2: Automated Script Player", icon: Cpu },
            { id: "manual-draft", label: "Lab 3: Test Design Station (AI Reviewed)", icon: Layers },
            { id: "triage", label: "Lab 4: Bug Triaging Simulator", icon: BookmarkCheck },
            { id: "ai-generator", label: "Lab 5: AI Case Generator", icon: Sparkles },
            { id: "ai-bug-form", label: "Lab 6: Smart Bug Formatter", icon: Bot }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLab === tab.id;
            const isCompleted = progress.labsCompleted.includes(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveLab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {isCompleted && (
                  <span className="shrink-0 rounded-full bg-emerald-500 h-2 w-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* active lab viewer */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* ==========================================
            LAB 1 VIEW: BUG HUNTING FORM SANDBOX
            ========================================== */}
        {activeLab === "sandbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="lab-bug-hunting">
            {/* The Buggy E-Commerce checkout component */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100 uppercase">Interactive Form View</span>
                  <h3 className="font-sans font-semibold text-slate-900 text-md">Mock E-Commerce Checkout Form</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                  Status: {isFormPatched ? "Patched (Robust)" : "Vulnerable (Buggy)"}
                </div>
              </div>

              {/* simulated viewport window */}
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Browser top-bar */}
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span className="h-2 w-2 bg-red-400 rounded-full" />
                  <span className="h-2 w-2 bg-amber-400 rounded-full" />
                  <span className="h-2 w-2 bg-emerald-400 rounded-full" />
                  <span className="ml-2 bg-white rounded px-3 py-0.5 border border-slate-200/60 w-80 truncate">https://storeandcheckout.qa/purchase</span>
                </div>

                {/* Form canvas body */}
                <div className={`p-8 font-sans ${sandboxCrash ? "bg-slate-950 text-red-400 font-mono p-12 transition-all" : "bg-white text-slate-800"}`}>
                  {sandboxCrash ? (
                    <div className="space-y-4">
                      <div className="text-sm font-bold text-red-500">!!! SYSTEM CRASH EXCEPTION !!!</div>
                      <p className="text-xs text-red-300 leading-relaxed font-mono">
                        Fatal Exception inside transaction executor database connection buffer scope.<br />
                        `promoCode` input: '{promoCode}' caused invalid dynamic SQL cast query parameter index out-of-bounds.<br />
                        Dump trace: code-path /src/core/pricing_engine.ts near line 302.
                      </p>
                      <button 
                        onClick={() => { setSandboxCrash(false); setSandboxReport("Checkout success."); }} 
                        className="rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs px-3 py-1.5 transition-colors cursor-pointer font-bold"
                      >
                        Reset Application Thread
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCheckoutSandbox} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Email Address</label>
                        <input 
                          type="text" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="try typing standard emails, or SQL injections e.g. ' OR '1'='1" 
                          className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Item Quantity</label>
                          <input 
                            type="text" 
                            value={itemCount}
                            onChange={(e) => setItemCount(e.target.value)}
                            placeholder="Negative values valid?" 
                            className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Promo Code</label>
                          <input 
                            type="text" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="'FATAL_ERROR' ?" 
                            className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Credit Card Number</label>
                        <input 
                          type="text" 
                          value={cardNo}
                          onChange={(e) => setCardNo(e.target.value)}
                          placeholder="e.g. short inputs valid?" 
                          className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full rounded bg-indigo-600 hover:bg-indigo-505 bg-indigo-700 text-white font-semibold text-xs py-2.5 transition-all cursor-pointer shadow-sm"
                      >
                        Secure Order Checkout ($49.00 / Item)
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Output feedback report message */}
              <div className="p-4 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl space-y-2">
                <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Browser Output Log</div>
                <p className="text-xs font-mono">{sandboxReport}</p>
              </div>

              {/* Developer Patch triggers */}
              <div className="rounded-xl bg-indigo-50/40 border border-indigo-100 p-5 space-y-3.5">
                <div className="flex gap-2.5 items-start">
                  <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-600 shrink-0">
                    <Sparkles className="h-4.5 w-4.5" />
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-900">Developer hot-patch simulator</h4>
                    <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                      Once you completed bug investigations, click deploy below to fix the frontend boundary checks (enforcing limits, escaping emails, intercepting error promo inputs).
                    </p>
                  </div>
                </div>
                <button
                  disabled={isFormPatched}
                  onClick={handleApplyFormPatch}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-500 disabled:border-emerald-500 disabled:cursor-not-allowed text-white font-semibold text-xs px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer border border-indigo-600"
                >
                  {isFormPatched ? "Bug Fix Deployed ✓ Form Secure" : "Deploy Hot-Patch & Hotfixes"}
                </button>
              </div>
            </div>

            {/* QA Bug Reporter Station */}
            <div className="lg:col-span-5 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <h3 className="font-sans font-semibold text-slate-900 text-md flex items-center gap-1.5">
                  <Bug className="h-5 w-5 text-indigo-600" />
                  QA Defect Reporter Desk
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Flick variables, trigger bugs, then file reports from options below to claim points and progress.
                </p>
              </div>

              <div className="space-y-4" id="bug-reporter-form">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Documented Defect Type</label>
                  <select 
                    value={selectedBugTitle}
                    onChange={(e) => setSelectedBugTitle(e.target.value)}
                    className="w-full rounded border border-slate-350 bg-white p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="">-- Choose Discovered Bug --</option>
                    {hiddenBugsCatalog.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Expected Functional Result</label>
                  <textarea 
                    value={bugExp}
                    onChange={(e) => setBugExp(e.target.value)}
                    placeholder="Describe how a robust system design should block or validate this." 
                    className="w-full rounded border border-slate-350 bg-white p-2.5 text-xs h-16 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Actual Abnormal Failure Output</label>
                  <textarea 
                    value={bugAct}
                    onChange={(e) => setBugAct(e.target.value)}
                    placeholder="Describe the bug failure you observed when clicking checkouts." 
                    className="w-full rounded border border-slate-350 bg-white p-2.5 text-xs h-16 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-sans"
                  />
                </div>

                <button
                  onClick={handleReportBug}
                  disabled={!selectedBugTitle || !bugExp || !bugAct}
                  className="w-full rounded bg-indigo-600 font-semibold text-xs py-2.5 hover:bg-slate-800 hover:text-white hover:scale-[1.01] transition-all cursor-pointer text-white disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  File Defect to Lead QA
                </button>
              </div>

              {huntFeedback && (
                <div className={`p-3 text-xs font-semibold rounded-lg text-center ${
                  huntFeedback.includes("Correct") || huntFeedback.includes("STUNNING") ? "bg-emerald-50 text-emerald-800" : "bg-indigo-50 text-indigo-800"
                }`}>
                  {huntFeedback}
                </div>
              )}

              {/* Bug hunting tracking */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-850">Bugs Uncovered Checklist:</span>
                  <span className="font-mono font-bold text-indigo-600">{foundBugs.length} / 4 found</span>
                </div>
                <div className="space-y-1.5">
                  {hiddenBugsCatalog.map((bug) => {
                    const isFound = foundBugs.includes(bug.id);
                    return (
                      <div key={bug.id} className="flex gap-2 items-center text-[11px] leading-relaxed">
                        <span className={`h-3.5 w-3.5 border rounded-full flex items-center justify-center shrink-0 ${
                          isFound ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                        }`}>
                          {isFound ? "✓" : ""}
                        </span>
                        <span className={isFound ? "text-emerald-700 font-medium" : "text-slate-400 font-normal"}>{bug.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            LAB 2 VIEW: AUTOMATED SCRIPT RUNNER
            ========================================== */}
        {activeLab === "automation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="lab-automated-scripts">
            {/* Terminal Workspace editor */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-850 rounded-2xl p-6 text-indigo-300 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-indigo-400" />
                  <span className="font-mono text-sm text-white">automation_regress_test.spec.js</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Cypress Framework</span>
              </div>

              {/* Code lines */}
              <div className="font-mono text-xs space-y-2.5 py-2">
                {cypressScript.map((step, idx) => {
                  const isActive = activeScriptLine === idx;
                  const isCompleted = activeScriptLine > idx;
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-4 p-2 rounded transition-all leading-normal ${
                        isActive 
                          ? "bg-indigo-900/40 border-l-2 border-indigo-400 text-white scale-[1.01]" 
                          : isCompleted 
                            ? "text-emerald-400 opacity-80" 
                            : "text-slate-400"
                      }`}
                    >
                      <span className="w-4 text-slate-600 text-right select-none">{idx + 1}</span>
                      <span className="flex-1">{step.code}</span>
                      {isActive && <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400 animate-pulse">active</span>}
                      {isCompleted && <span className="text-[10px] text-emerald-400 font-bold">Passed</span>}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-850">
                <button
                  disabled={isRunningScript}
                  onClick={handlePlayAutomation}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold px-4 py-2.5 transition-all text-white cursor-pointer"
                >
                  <Play className="h-4.5 w-4.5" />
                  <span>Run Automation Suite (+50 XP)</span>
                </button>

                <button
                  onClick={handleResetBrowserSim}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-xs font-semibold px-4 py-2.5 transition-all border border-slate-800 text-slate-300 cursor-pointer"
                >
                  <RotateCcw className="h-4.5 w-4.5" />
                  <span>Reset Viewbox</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Viewport browser mockup */}
            <div className="lg:col-span-6 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] text-slate-600 font-bold uppercase tracking-wide">Target Browser Viewport Mockup</span>
              
              <div className="rounded-xl border border-slate-205 overflow-hidden border-slate-200 shadow-xs">
                {/* Simulated address bar */}
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-150 flex items-center gap-2 text-[10.5px] text-slate-500 font-mono">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-red-400 rounded-full" />
                    <span className="h-2 w-2 bg-amber-400 rounded-full" />
                    <span className="h-2 w-2 bg-emerald-400 rounded-full" />
                  </div>
                  <input 
                    type="text" 
                    readOnly 
                    value={simulatedBrowserUrl}
                    className="ml-4 bg-white rounded border border-slate-200 px-2.5 py-0.5 w-full text-slate-600 text-[10px] focus:outline-hidden font-mono"
                  />
                </div>

                {/* Simulated web app */}
                <div className="h-72 bg-slate-50 flex items-center justify-center p-8 text-center font-sans">
                  {simulatedBrowserUrl === "chrome://newtab" ? (
                    <div className="space-y-2 text-slate-400">
                      <Terminal className="h-10 w-10 mx-auto opacity-50" />
                      <div className="text-xs font-semibold">Ready. Standing by for script payload execution.</div>
                    </div>
                  ) : (
                    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-left">
                      <div className="border-b border-slate-100 pb-2">
                        <div className="text-xs font-bold text-slate-900 uppercase">QA Academy Member Hub</div>
                        <p className="text-[10px] text-slate-500">Sign in registration sandbox</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Username Input</label>
                          <input 
                            type="text" 
                            readOnly 
                            value={simViewportHtml.username}
                            placeholder="Awaiting programmatic script keystrokes..." 
                            className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-slate-10/10 font-mono text-indigo-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Authorization State</label>
                          <div className={`p-3 rounded-lg text-xs font-semibold leading-relaxed ${
                            simViewportHtml.status.includes("Granted") 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                              : simViewportHtml.status.includes("Verifying") 
                                ? "bg-indigo-50 text-indigo-800 border border-indigo-200 animate-pulse" 
                                : "bg-slate-50 text-slate-500 border border-slate-200"
                          }`}>
                            {simViewportHtml.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lab 2 success indicator */}
              {activeScriptLine === cypressScript.length - 1 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3 text-emerald-800 text-xs animate-bounce" id="automation-success-log">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <strong>✓ System Regression Verification Succeeded!</strong>
                    <p className="text-[11px] text-emerald-700 mt-1 leading-normal">
                      Cypress test assertion passed dynamically within 3300ms. Scripting Apprentice badge unlocked!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            LAB 3 VIEW: DESIGN SUBMISSION WORKSTATION
            ========================================== */}
        {activeLab === "manual-draft" && (
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6" id="lab-manual-traceability">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100 uppercase font-mono">Traceability Module Workspace</span>
              <h3 className="font-sans font-semibold text-slate-905 text-md text-slate-900">Task: Write ATM Boundary Case Scenarios</h3>
              <p className="text-slate-500 text-xs sm:text-xs leading-normal font-sans">
                Below are the official target project specifications. Write structural manual testing cases covering valid median values, boundary values below threshold, and error boundaries above threshold.
              </p>
            </div>

            {/* Requirement statement callout */}
            <div className="p-4 bg-slate-900 text-slate-200 border border-slate-850 rounded-xl flex gap-3">
              <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1 select-all font-mono text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Target Feature Requirements Spec</div>
                <p className="leading-relaxed">{requirementStatement}</p>
              </div>
            </div>

            {/* Active Test Case drafting list */}
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                <div className="col-span-3">Scenario Title</div>
                <div className="col-span-5">Subsequent Test Steps</div>
                <div className="col-span-3">Expected Technical Response</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              <div className="space-y-3" id="atm-testcase-container">
                {draftedCases.map((tc, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 items-start">
                    {/* Title */}
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={tc.title}
                        onChange={(e) => handleUpdateCaseRow(idx, "title", e.target.value)}
                        placeholder="e.g. Test boundary exactly at $20"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-medium"
                      />
                    </div>

                    {/* Steps */}
                    <div className="col-span-5">
                      <textarea 
                        value={tc.steps}
                        onChange={(e) => handleUpdateCaseRow(idx, "steps", e.target.value)}
                        placeholder="1. Enter debit card&#10;2. Input value $20&#10;3. Verify warning matches."
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs h-16 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-sans"
                      />
                    </div>

                    {/* Expected */}
                    <div className="col-span-3">
                      <textarea 
                        value={tc.expected}
                        onChange={(e) => handleUpdateCaseRow(idx, "expected", e.target.value)}
                        placeholder="ATM error warns of insufficient sum."
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs h-16 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-sans"
                      />
                    </div>

                    {/* Remove Action */}
                    <div className="col-span-1 h-full flex items-center justify-center">
                      <button 
                        onClick={() => handleRemoveCaseRow(idx)}
                        disabled={draftedCases.length === 1}
                        className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add row tracker */}
              <button
                onClick={handleAddTestCaseRow}
                className="rounded-lg border border-dashed border-slate-300 hover:border-indigo-500 text-slate-600 hover:text-indigo-600 text-xs font-semibold py-2 w-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Append Test Case scenario Row</span>
              </button>
            </div>

            {/* Submit Action and AI loader */}
            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <p className="text-[11px] text-slate-500 italic max-w-md">
                *Submitting drafts triggers our real-time Gemini proxy evaluator endpoint to assess boundary sufficiency and issue custom team-lead scores.
              </p>
              
              <button
                onClick={handleSponsorTestCaseReview}
                disabled={aiIsLoading || draftedCases.some(t => !t.title || !t.steps || !t.expected)}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-505 bg-indigo-700 disabled:opacity-40 text-xs font-semibold px-6 py-3 transition-all text-white flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Send className="h-4 w-4" />
                <span>{aiIsLoading ? "Evaluating Suite with AI..." : "Submit for AI Peer-Review (+100 XP)"}</span>
              </button>
            </div>

            {/* AI Review Output container panel */}
            {aiReviewScore !== null && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-6 space-y-6 animate-fade-in" id="ai-testcase-feedback-board">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100/50 pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex rounded-md bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wide">Evaluation Results</span>
                    <h4 className="font-semibold text-slate-900 text-md">ATM Script Review scorecard</h4>
                  </div>
                  
                  {/* Score badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">{aiReviewScore} / 100</div>
                      <div className="text-[10px] font-semibold text-slate-500">Subject Grade: {aiReviewGrade}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Critique message */}
                  <div className="md:col-span-7 space-y-2.5">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <BookmarkCheck className="h-4.5 w-4.5 text-emerald-600" />
                      Critique Feedback
                    </h5>
                    <p className="text-slate-650 text-xs sm:text-xs leading-relaxed font-sans bg-white p-4 border border-slate-150 rounded-xl shadow-xs">
                      {aiReviewFeedback}
                    </p>
                  </div>

                  {/* Missing boundary targets */}
                  <div className="md:col-span-5 space-y-2.5">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1 text-slate-700">
                      <Info className="h-4.5 w-4.5 text-amber-500" />
                      Missing edge cases you missed targeting:
                    </h5>
                    <div className="space-y-1.5 bg-white p-4 border border-slate-150 rounded-xl shadow-xs">
                      {aiReviewMissing.map((miss, mIdx) => (
                        <div key={mIdx} className="flex gap-2 items-start text-[11px] leading-relaxed text-slate-650">
                          <span className="h-4.5 w-4.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">!</span>
                          <span>{miss}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            LAB 4 VIEW: CORPORATE BUG TRIAGING GAME
            ========================================== */}
        {activeLab === "triage" && (
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6" id="lab-bug-triage">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100 uppercase">Lab 4: Corporate Bug Triaging Simulator Game</span>
                <h3 className="font-sans font-semibold text-slate-900 text-md">Assert Defect Severity vs. Commercial Priority</h3>
                <p className="text-slate-500 text-xs">Verify your technical scoping and business triage alignment on realistic defects.</p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                Score: {triageScore} / {triageSubmittedCount} Evaluated
              </div>
            </div>

            {!triageIsComplete ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Active Scenario Card */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/10 space-y-3 font-sans shadow-3xs">
                    <div className="flex justify-between items-center text-[10px] text-indigo-700 font-bold tracking-wider font-mono">
                      <span>SCENARIO TICKET {triageIndex + 1} OF {triageIssues.length}</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-indigo-150 shrink-0">QA ANALYTICS DECK</span>
                    </div>

                    <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                      {triageIssues[triageIndex].title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal bg-white p-4 border border-slate-150 rounded-xl leading-relaxed">
                      {triageIssues[triageIndex].description}
                    </p>
                  </div>

                  {/* Form selections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    {/* Severity selection */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Technical Severity</label>
                      <div className="space-y-1.5 animate-fade-in">
                        {["Blocker", "Critical", "Major", "Minor"].map((sev) => (
                          <button
                            key={sev}
                            type="button"
                            disabled={triageEvaluated}
                            onClick={() => setUserSeverity(sev)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                              userSeverity === sev 
                                ? "bg-red-650 border-red-600 bg-red-600 text-white font-semibold" 
                                : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority selection */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Business Priority</label>
                      <div className="space-y-1.5 animate-fade-in">
                        {["High", "Medium", "Low"].map((pri) => (
                          <button
                            key={pri}
                            type="button"
                            disabled={triageEvaluated}
                            onClick={() => setUserPriority(pri)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                              userPriority === pri 
                                ? "bg-amber-650 border-amber-600 bg-amber-600 text-white font-semibold" 
                                : "bg-white border-slate-205 text-slate-650 hover:bg-slate-50"
                            }`}
                          >
                            {pri}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit decision */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={!userSeverity || !userPriority || triageEvaluated}
                      onClick={handleEvaluateTriageDecision}
                      className="flex-1 bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 disabled:opacity-45 disabled:cursor-not-allowed py-3.5 rounded-lg text-xs font-semibold cursor-pointer uppercase transition-all"
                    >
                      Evaluate Triage Decision (+30 XP)
                    </button>
                    {triageEvaluated && (
                      <button
                        type="button"
                        onClick={handleNextTriageScenario}
                        className="px-6 border border-indigo-600 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer py-3.5 transition-all text-center uppercase"
                      >
                        Next Scenario &rarr;
                      </button>
                    )}
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-150 p-5 space-y-4 min-h-64 flex flex-col justify-between">
                  <div className="space-y-4 w-full">
                    <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Triage Feedback Box</div>
                    {triageEvaluated ? (
                      <div className="space-y-4 animate-fade-in font-sans">
                        <div className="p-3.5 rounded-xl border flex gap-2 w-full text-xs bg-white border-slate-200">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white ${
                            triageFeedback.includes("PERFECT") ? "bg-emerald-500" : "bg-amber-500"
                          }`}>
                            {triageFeedback.includes("PERFECT") ? "✓" : "!"}
                          </span>
                          <div className="space-y-1">
                            <strong className="block text-slate-800 leading-normal">{triageFeedback}</strong>
                          </div>
                        </div>

                        <div className="space-y-3 font-sans">
                          <div className="space-y-1">
                            <h5 className="text-[10px] uppercase font-bold text-indigo-600 font-mono">Correct Severity: {triageIssues[triageIndex].correctSeverity}</h5>
                            <p className="text-[11.5px] text-slate-650 leading-relaxed bg-white p-3 border border-slate-200 rounded-lg">{triageIssues[triageIndex].severityExplanation}</p>
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-[10px] uppercase font-bold text-amber-600 font-mono">Correct Priority: {triageIssues[triageIndex].correctPriority}</h5>
                            <p className="text-[11.5px] text-slate-655 leading-relaxed bg-white p-3 border border-slate-200 rounded-lg">{triageIssues[triageIndex].priorityExplanation}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-400 space-y-2.5">
                        <Bug className="h-10 w-10 mx-auto opacity-30 text-slate-550" />
                        <div className="text-xs font-semibold text-slate-700">Awaiting Your Triaging Selection</div>
                        <p className="text-[11px] text-slate-450 max-w-xs mx-auto leading-normal font-sans">
                          Read the scenario parameters on the left. Toggle the Technical Severity and Business Priority levels, then click evaluate.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Completion page */
              <div className="max-w-md mx-auto text-center p-8 bg-indigo-50/25 border border-indigo-150 rounded-2xl space-y-5 animate-fade-in font-sans shadow-3xs">
                <BookmarkCheck className="h-12 w-12 mx-auto text-indigo-600 animate-bounce" />
                <div className="space-y-1.5">
                  <h4 className="text-md font-bold text-slate-850">Triage Laboratory Completed Successfully!</h4>
                  <p className="text-xs text-slate-500">You have completed all triaging challenges. Here is your final diagnostic scorecard:</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-3xs">
                    <div className="text-[9.5px] font-bold text-slate-400 tracking-wide font-mono uppercase">ACCURACY GRADING</div>
                    <div className="text-[18px] font-black text-slate-800 mt-1">{triageScore} / {triageIssues.length} correct</div>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-3xs">
                    <div className="text-[9.5px] font-bold text-slate-400 tracking-wide font-mono uppercase font-sans">XP ACCRUEMENT</div>
                    <div className="text-[18px] font-black text-indigo-700 mt-1">+{triageScore * 30} XP</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-205 rounded-xl text-xs leading-relaxed text-slate-650 shadow-3xs text-left">
                  <strong>Manager Feedback Assessment:</strong> You demonstrated excellent analytical alignment on corporate quality and project severity parameters! These triage skills are highly critical in live corporate sprint ceremonies.
                </div>

                <button
                  type="button"
                  onClick={handleRestartTriageLab}
                  className="rounded-lg bg-slate-900 text-white hover:bg-slate-850 text-xs py-2 px-4 shadow-sm font-semibold select-none cursor-pointer"
                >
                  Restart Triage Sandroom Run
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            LAB 5 VIEW: AI TEST CASE GENERATOR
            ========================================== */}
        {activeLab === "ai-generator" && (
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6 animate-fade-in" id="lab-ai-generator">
            <div className="space-y-1">
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100 uppercase">Lab 5: AI-Powered Test Generator Suite</span>
              <h3 className="font-sans font-semibold text-slate-900 text-md">Auto-Generate Test Specifications & Playwright Scripts</h3>
              <p className="text-slate-500 text-xs">Type raw software requirements specifications and watch the server-side Gemini construct complete automated tests instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-100">
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Requirement description</label>
                  <textarea
                    rows={4}
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Describe your feature requirements or user story..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Output Methodology</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGenerationFormat("manual")}
                      className={`p-2.5 rounded-lg border text-xs font-semibold select-none cursor-pointer text-center ${
                        generationFormat === "manual"
                          ? "bg-indigo-600 text-white border-indigo-505 bg-indigo-600 border-indigo-505"
                          : "bg-white border-slate-205 text-slate-650 hover:bg-slate-50"
                      }`}
                    >
                      Manual Scenarios
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenerationFormat("automated")}
                      className={`p-2.5 rounded-lg border text-xs font-semibold select-none cursor-pointer text-center ${
                        generationFormat === "automated"
                          ? "bg-indigo-600 text-white border-indigo-505 bg-indigo-600 border-indigo-505"
                          : "bg-white border-slate-205 text-slate-650 hover:bg-slate-50"
                      }`}
                    >
                      Playwright (2026 Script)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={genLoading || !requirementInput.trim()}
                  onClick={handleGenerateCases}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {genLoading ? "Engaging Neural Matrix..." : "Synthesize Testing Asset"}
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>

              <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono tracking-wider pb-3 border-b border-slate-800 mb-4 uppercase">
                    <span>Target Sandbox Visualisation Code</span>
                    <span className="bg-slate-950 border border-slate-850 text-emerald-400 px-2 py-0.5 rounded">Asset generated</span>
                  </div>

                  {generatedCases ? (
                    <pre className="font-mono text-[10.5px] text-emerald-400 overflow-x-auto select-all whitespace-pre leading-relaxed max-h-[380px] scrollbar-thin">
                      {generatedCases}
                    </pre>
                  ) : (
                    <div className="text-center py-16 text-slate-500 space-y-2 font-mono text-xs">
                      <Sparkles className="h-8 w-8 mx-auto text-slate-705 animate-pulse" />
                      <div>Awaiting Requirements Matrix Synthesis</div>
                      <p className="text-[10px] text-slate-600 max-w-xs mx-auto leading-normal">
                        Type specifications on the left, select format, and hit compile.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            LAB 6 VIEW: SMART BUG TICKET FORMATTER
            ========================================== */}
        {activeLab === "ai-bug-form" && (
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6 animate-fade-in" id="lab-ai-bug-form">
            <div className="space-y-1">
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100 uppercase">Lab 6: Smart Defect Report Formatter</span>
              <h3 className="font-sans font-semibold text-slate-905 text-md text-slate-900 font-medium">Translate Messy Client Feedback into Structured Jira QA Tickets</h3>
              <p className="text-slate-500 text-xs">Input chaotic chat summaries or basic diagnostic descriptions and have the AI generate highly rigorous enterprise tickets complete with severity allocations and testing analysis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-100">
              <div className="lg:col-span-5 space-y-4 font-sans">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Raw Defect description</label>
                  <textarea
                    rows={5}
                    value={bugRawInput}
                    onChange={(e) => setBugRawInput(e.target.value)}
                    placeholder="e.g. login failed with error 500 when i typed too many characters in the password field..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed font-sans"
                  />
                </div>

                <button
                  type="button"
                  disabled={formattingLoading || !bugRawInput.trim()}
                  onClick={handleFormatBugTicket}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {formattingLoading ? "Formatting Defect Spectrum..." : "Convert with AI formatter"}
                  <Bot className="h-4 w-4" />
                </button>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono tracking-wider pb-3 border-b border-slate-100 mb-4 uppercase">
                    <span>Generated Defect JIRA Ticket</span>
                    <span className="bg-indigo-50 border border-indigo-100/50 text-indigo-600 px-2 py-0.5 rounded text-[9.5px]">Parsed successfully</span>
                  </div>

                  {formattedBugTicket ? (
                    <div className="prose prose-sm max-h-[380px] overflow-y-auto pr-1 text-slate-700 leading-relaxed space-y-3 whitespace-pre-wrap text-xs select-all bg-slate-50 p-4 border border-slate-200 rounded-xl max-w-none">
                      {formattedBugTicket}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 space-y-2 font-mono text-xs">
                      <Bot className="h-8 w-8 mx-auto text-slate-350 animate-bounce" />
                      <div>Awaiting Defect Parsing Conversion</div>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal font-sans">
                        Provide clean or chaotic error summaries on the left, then trigger parsing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
