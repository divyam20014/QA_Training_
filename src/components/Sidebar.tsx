import React from "react";
import { 
  Home, 
  BookOpen, 
  Terminal, 
  Award, 
  ChevronRight, 
  Menu, 
  X, 
  Flame, 
  Sparkles,
  Trophy
} from "lucide-react";
import { UserProgress } from "../types";
import { modulesData } from "../data/modulesData";

interface SidebarProps {
  currentView: string;
  selectedModuleId?: number;
  progress: UserProgress;
  onNavigate: (view: string, moduleId?: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ 
  currentView, 
  selectedModuleId, 
  progress, 
  onNavigate, 
  isOpen, 
  onToggle 
}: SidebarProps) {
  
  // High-level navigation configurations
  const menuItems = [
    { id: "dashboard", label: "Dashboard Hub", icon: Home },
    { id: "labs", label: "Practical Lab Rooms", icon: Terminal },
    { id: "career", label: "Career & Interview Center", icon: Award }
  ];

  const totalSections = modulesData.reduce((acc, current) => acc + current.sections.length, 0);
  const completedCount = progress.completedSections.length;
  const progressPercent = Math.min(Math.round((completedCount / totalSections) * 100), 100);

  const handleNavClick = (view: string, moduleId?: number) => {
    onNavigate(view, moduleId);
    if (window.innerWidth < 1024) {
      onToggle(); // Close sidebar on mobile after navigating
    }
  };

  return (
    <>
      {/* Mobile Sidebar Hamburger Toggle bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40 text-white">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-indigo-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-100">Testing Mastery 2026</span>
        </div>
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          id="mobile-sidebar-toggle-btn"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop overlay for Mobile UI drawer */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="lg:hidden fixed inset-0 bg-slate-950/60 z-30 transition-all backdrop-blur-xs" 
        />
      )}

      {/* Main Structural Nav Sidebar Panel */}
      <aside 
        className={`fixed top-16 lg:top-0 bottom-0 left-0 w-72 bg-slate-950 border-r border-slate-900 flex flex-col justify-between transition-transform duration-300 z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="applet-sidebar"
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 space-y-8">
          
          {/* Logo Brand Header */}
          <div className="hidden lg:flex items-center gap-2.5 px-2">
            <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-md shadow-indigo-900/30">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="font-sans font-bold text-[14px] text-white tracking-tight block">Testing Mastery 2026</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Corporate Syllabus</span>
            </div>
          </div>

          {/* Gamification User Status Badge */}
          <div className="rounded-xl bg-slate-900 p-4 border border-slate-850 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-300">Your XP Rank</span>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono tracking-wide">{progress.xp} pts</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Core Progression</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Primary Top-level navigation items */}
          <nav className="space-y-1.5" id="primary-nav-menu">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-2 mb-2">Workspace Hub</div>
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/10" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 opacity-40 ${isActive ? "" : "group-hover:opacity-80"}`} />
                </button>
              );
            })}
          </nav>

          {/* Course Modules Dropdown selector */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-2 flex justify-between items-center">
              <span>Syllabus Modules</span>
              <span className="text-[9px] bg-indigo-900/50 text-indigo-300 px-1.5 py-0.5 rounded-md border border-indigo-800/40 font-mono">{modulesData.length} Steps</span>
            </div>
            
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800" id="syllabus-module-scroller">
              {modulesData.map((mod) => {
                const isActive = currentView === "learning" && selectedModuleId === mod.id;
                // Check if any sections inside this module are complete
                const completedSectionsCount = mod.sections.filter(s => progress.completedSections.includes(s.id)).length;
                const isPartiallyComplete = completedSectionsCount > 0;
                const isFullyComplete = completedSectionsCount === mod.sections.length;

                return (
                  <button
                    key={mod.id}
                    onClick={() => handleNavClick("learning", mod.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all duration-150 flex items-start gap-2.5 cursor-pointer border ${
                      isActive 
                        ? "bg-slate-900 border-indigo-900 text-white" 
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className={`rounded-md p-1.5 shrink-0 mt-0.5 ${
                      isActive ? "bg-indigo-600 text-white" : isFullyComplete ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-slate-900 text-slate-500"
                    }`}>
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate tracking-tight">{mod.id}. {mod.title}</div>
                      <div className="flex gap-2 items-center mt-0.5 text-[9px] text-slate-500">
                        <span>{mod.sections.length} lectures</span>
                        {isFullyComplete && (
                          <span className="text-emerald-400 font-bold">100% Done</span>
                        )}
                        {isPartiallyComplete && !isFullyComplete && (
                          <span className="text-amber-500 font-medium">In Progress</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brand System Footer Badge */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/85">
          <div className="rounded-lg bg-indigo-950/20 border border-indigo-900/30 p-3 text-center text-[10px] space-y-1">
            <div className="flex items-center gap-1 justify-center text-indigo-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Full Stack Active</span>
            </div>
            <p className="text-slate-500 leading-normal">
              Equipped with server-side AI evaluation engines.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
