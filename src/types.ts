export interface SectionContent {
  id: string; // e.g. "1.1"
  title: string;
  what: string;
  whenToUse: string;
  whyToUse: string;
  howToUse: string;
  examples: string[];
  role?: string;
  analogy?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index in options
  explanation: string;
}

export interface MatchOption {
  id: string;
  concept: string;
  description: string;
}

export interface DragDropOption {
  id: string;
  label: string;
  category: "functional" | "non-functional" | "structural" | "manual" | "automated";
  description: string;
}

export interface CaseStudyData {
  id: string;
  title: string;
  scenario: string;
  questions: {
    id: string;
    question: string;
    choices: string[];
    correct: number;
    explanation: string;
  }[];
}

export interface Section {
  id: string;
  title: string;
  content: SectionContent;
  quiz?: QuizQuestion[];
  matchPairs?: MatchOption[];
  sortOptions?: DragDropOption[];
  caseStudy?: CaseStudyData;
}

export interface Module {
  id: number;
  title: string;
  icon: string;
  description: string;
  sections: Section[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  completedSections: string[]; // array of section IDs
  unlockedBadges: string[]; // array of badge IDs
  labsCompleted: string[]; // array of lab IDs
  reportedBugs: { [labId: string]: string[] }; // map of labId to list of bug IDs found
  careerAnswers?: { [key: string]: number };
  completedModuleQuizzes?: number[]; // list of module IDs where the final exam is completed
  quizScores?: { [moduleId: number]: number }; // tracks best scores for module quizzes
}

export interface MockInterviewQuestion {
  id: string;
  role: string;
  question: string;
  hint: string;
}
