/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ModuleViewer from "./components/ModuleViewer";
import LabsWorkspace from "./components/LabsWorkspace";
import CareerCenter from "./components/CareerCenter";
import AITutorFloating from "./components/AITutorFloating";
import { UserProgress } from "./types";
import { modulesData } from "./data/modulesData";

export default function App() {
  // Mobile sidebar open/close visibility state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Layout routing state: "dashboard", "learning", "labs", "career"
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);

  // Initialize unified progress structures directly from localStorage if exists
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("qa_mastery_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn("Failed to decode previous study logs:", err);
      }
    }
    return {
      xp: 0,
      completedSections: [],
      unlockedBadges: [],
      labsCompleted: [],
      reportedBugs: {}
    };
  });

  // Track state syncing
  useEffect(() => {
    localStorage.setItem("qa_mastery_progress", JSON.stringify(progress));
  }, [progress]);

  const handleNavigate = (view: string, moduleId?: number) => {
    setCurrentView(view);
    if (moduleId) {
      setSelectedModuleId(moduleId);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const activeModule = modulesData.find((m) => m.id === selectedModuleId) || modulesData[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="application-layout-frame">
      
      {/* Structural Sidebar wrapper */}
      <Sidebar 
        currentView={currentView}
        selectedModuleId={selectedModuleId}
        progress={progress}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      {/* Main workspace container scroll block */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Workspace Top bar (holds XP rank and branding stats on desktop) */}
        <header className="h-16 border-b border-slate-100 bg-white/80 sticky top-0 backdrop-blur-md z-20 px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider hidden sm:inline">Active Course track:</span>
            <span className="text-xs font-semibold text-slate-800">
              {currentView === "dashboard" && "Syllabus Progress Dashboard"}
              {currentView === "labs" && "QA Labs Workspace"}
              {currentView === "career" && "Career Readiness Hub"}
              {currentView === "learning" && `Module ${activeModule.id}: ${activeModule.title}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* XP Status bar */}
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
              <span className="animate-pulse h-2 w-2 rounded-full bg-indigo-500" />
              <span>{progress.xp} pts XP</span>
            </div>
          </div>
        </header>

        {/* Primary View Router viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 pb-16">
          
          {currentView === "dashboard" && (
            <Dashboard 
              progress={progress} 
              onNavigate={handleNavigate} 
            />
          )}

          {currentView === "learning" && (
            <ModuleViewer 
              module={activeModule}
              progress={progress}
              onUpdateProgress={setProgress}
            />
          )}

          {currentView === "labs" && (
            <LabsWorkspace 
              progress={progress}
              onUpdateProgress={setProgress}
            />
          )}

          {currentView === "career" && (
            <CareerCenter 
              progress={progress}
              onUpdateProgress={setProgress}
            />
          )}

        </main>
      </div>
      <AITutorFloating />
    </div>
  );
}

