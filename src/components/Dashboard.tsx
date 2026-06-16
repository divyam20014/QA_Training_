import React, { useState } from "react";
import { Award, BookOpen, Star, CheckCircle2, TrendingUp, ShieldCheck, Heart, AlertTriangle } from "lucide-react";
import { UserProgress, Badge } from "../types";
import { modulesData } from "../data/modulesData";

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (view: string, moduleId?: number) => void;
}

export default function Dashboard({ progress, onNavigate }: DashboardProps) {
  // Mock constant list of badges
  const badges: Badge[] = [
    { id: "intro", title: "Testing Initiate", description: "Completed Module 1: Introduction to Testing", icon: "Flag" },
    { id: "fundamentals", title: "Fundamentals Explorer", description: "Successfully passed basics of testing fundamentals quizzes", icon: "Layers" },
    { id: "design", title: "Methodology Architect", description: "Completed Equivalence Partitioning & Boundary Value Labs", icon: "Sliders" },
    { id: "sandbox", title: "Elite Bug Hunter", description: "Discovered and documented 4 hidden defects in the sandbox lab", icon: "Bug" },
    { id: "automation", title: "Scripting Apprentice", description: "Formulated and ran your first automated cypress script code", icon: "Cpu" },
    { id: "career", title: "Interview Gladiator", description: "Received a grade of 85+ on a career mock interview simulation", icon: "Award" },
    { id: "trends", title: "2026 Trends Guru", description: "Mastered advanced AI-augmented scripts, self-healing tests, and chaotic shift-right designs", icon: "Sparkles" }
  ];

  // Internal visual state for metric details
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Dynamic calculations based on user progress
  const completedCount = progress.completedSections.length;
  const totalSections = modulesData.reduce((acc, curr) => acc + curr.sections.length, 0);
  const progressPercent = Math.min(Math.round((completedCount / totalSections) * 100), 100);

  // Custom data visualizer for severity levels using responsive SVG layout
  const severityData = [
    { name: "Blocker", value: 3, color: "var(--color-red-500, #ef4444)", desc: "Halts critical builds instantly (Immediate patch required)" },
    { name: "Critical", value: 8, color: "var(--color-amber-500, #f59e0b)", desc: "Major functional block with no accessible workarounds" },
    { name: "Major", value: 15, color: "var(--color-blue-500, #3b82f6)", desc: "Standard feature deviation; clean workarounds exist" },
    { name: "Minor", value: 24, color: "var(--color-slate-400, #94a3b8)", desc: "Trivial cosmetic layouts, typo corrections, or small glitches" }
  ];

  const totalBugsRecorded = severityData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-workspace">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase border border-indigo-500/30">
            Welcome to Quality Assurance Academics
          </div>
          <h1 className="font-sans font-medium text-3xl sm:text-4xl tracking-tight text-white">
            Software Testing Mastery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your interactive playground, lab room, and theoretical repository. Master static requirements reviews, dynamic edge assessments, code automation regressions, and land high-caliber SDET careers.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="dashboard-start-learning-btn"
              onClick={() => onNavigate("learning", 1)}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-900/30 hover:scale-[1.02]"
            >
              Start Core Syllabus
            </button>
            <button
              id="dashboard-explore-labs-btn"
              onClick={() => onNavigate("labs")}
              className="rounded-lg bg-slate-850 px-5 py-2.5 text-sm font-medium border border-slate-700 hover:bg-slate-850 hover:border-slate-500 transition-all cursor-pointer"
            >
              Enter Practical Labs
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Standard KPI Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-kpis">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">{progress.xp}</div>
            <div className="text-xs text-slate-500 font-medium">Acquired XP Score</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-slate-900">{progressPercent}%</span>
              <span className="text-xs text-emerald-600 font-medium">{completedCount} / {totalSections}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mb-1.5">Syllabus Complete</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">
              {progress.unlockedBadges.length} / {badges.length}
            </div>
            <div className="text-xs text-slate-500 font-medium font-sans">Unlocked Badges Shelf</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">
              {progress.labsCompleted.length} / 4
            </div>
            <div className="text-xs text-slate-500 font-medium">Completed Lab Rooms</div>
          </div>
        </div>
      </div>

      {/* Main Column Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Metrics Visualizer */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-md flex flex-col justify-between">
          <div className="space-y-1.5 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <h2 className="font-sans font-medium text-lg text-white">QA Metrics & Analytics Simulator</h2>
            </div>
            <p className="text-xs text-slate-400">
              Real-time measurement dashboard of static product errors cataloged across active project iterations. Select or hover modules below to detail key diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Visual Graphic */}
            <div className="md:col-span-6 flex flex-col items-center justify-center relative">
              <svg width="220" height="220" viewBox="0 0 200 200" className="mx-auto select-none">
                {/* SVG Radial Gauge for total coverage */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#252c41" strokeWidth="12" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="url(#indigoGrad)" 
                  strokeWidth="12" 
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - (0.65 + (progressPercent * 0.0035)))}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                <text x="100" y="93" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">REQUIREMENT</text>
                <text x="100" y="118" textAnchor="middle" fill="#ffffff" fontSize="26" fontWeight="bold">
                  {Math.round(65 + (progressPercent * 0.35))}%
                </text>
                <text x="100" y="136" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold">COVERAGE</text>
              </svg>
              <div className="text-center mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-900/50 px-2 py-0.5 text-xs text-indigo-300 border border-indigo-800">
                  Target Release SLA: 90%
                </span>
              </div>
            </div>

            {/* Severity KPI Bars list */}
            <div className="md:col-span-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Defect Severity Inventory ({totalBugsRecorded} Active Bugs)
              </h3>
              <div className="space-y-3">
                {severityData.map((item) => (
                  <div 
                    key={item.name}
                    className="space-y-1 cursor-help group transition-all duration-250 p-2 rounded-lg hover:bg-slate-800"
                    onMouseEnter={() => setHoveredMetric(item.name)}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300 font-medium">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-mono text-white font-semibold">
                        {item.value} <span className="text-slate-500 font-normal">({Math.round((item.value / totalBugsRecorded) * 100)}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: item.color, 
                          width: `${(item.value / 30) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hover Metric Detail Drawer Panel */}
          <div className="mt-6 p-3 rounded-lg bg-slate-850/60 border border-slate-800 transition-all text-xs flex gap-2 items-center min-h-[48px]">
            {hoveredMetric ? (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-slate-350">
                  <strong>{hoveredMetric}:</strong> {severityData.find(d => d.name === hoveredMetric)?.desc}
                </span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-slate-400">
                  Hover or hold individual severity bars above to understand how QAs categorise corporate bug priorities.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Badges Shelf Layout */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-1.5 mb-4">
            <h2 className="font-sans font-medium text-lg text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Progress Badges Shelf
            </h2>
            <p className="text-xs text-slate-500">
              Complete lessons, exercises, custom code runs, and quizzes to claim exclusive career credentials.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4" id="badges-grid">
            {badges.map((badge) => {
              const isUnlocked = progress.unlockedBadges.includes(badge.id);
              return (
                <div 
                  key={badge.id}
                  className={`group relative flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                    isUnlocked 
                      ? "bg-slate-50 border-indigo-200 shadow-sm" 
                      : "bg-white border-slate-100 opacity-40 select-none grayscale"
                  }`}
                >
                  <div className={`rounded-xl p-2.5 mb-1.5 ${
                    isUnlocked ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 tracking-tight leading-tight line-clamp-1">
                    {badge.title}
                  </span>

                  {/* Tooltip hovering */}
                  <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-950 text-white rounded-lg p-2.5 shadow-xl text-left scale-0 group-hover:scale-100 transition-all origin-bottom duration-150 z-25 text-[10px] space-y-1">
                    <div className="font-semibold text-amber-400">{badge.title}</div>
                    <div className="text-slate-300">{badge.description}</div>
                    <div className="text-[9px] font-bold mt-1 tracking-wider uppercase text-slate-500">
                      {isUnlocked ? "Status: Unlocked" : "Status: Locked"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>Unlocked Badge Credentials:</span>
            <span>{progress.unlockedBadges.length} / {badges.length}</span>
          </div>
        </div>
      </div>

      {/* Gamification Streak & Advice Corner */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-4 items-start">
          <div className="rounded-xl bg-indigo-600 text-white p-3 shadow-md shrink-0">
            <Heart className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-slate-900">Your Study Recommendation Strategy</h3>
            <p className="text-xs text-slate-600 max-w-xl">
              <strong>Tip of the Week:</strong> To become a high-tier QA engineer, balance manual exploration with test automation. Begin in <strong>Module 1 & 2</strong>, write clear manual scenarios in <strong>Module 4 Lab Workspace</strong>, and then script Cypress playbacks in the <strong>Automation sandbox</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("career")}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
        >
          Check Job Readiness Profile
        </button>
      </div>
    </div>
  );
}
