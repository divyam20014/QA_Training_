import React, { useState, useRef, useEffect } from "react";
import { MessageSquareCode, Send, X, Bot, Sparkles, ChevronDown, RefreshCw } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export default function AITutorFloating() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Suggested fast chips
  const suggestions = [
    "Explain BVA like I am 5 🍰",
    "How does Shift-Right chaos QA work?",
    "How do I test Solidity smart contracts?",
    "What are self-healing selectors in 2026?",
    "Accessibility Audits in WCAG 3.0"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [history, isLoading, isOpen]);

  const handleSendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}-u`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => [...prev, userMsg]);
    if (rawText === message) setMessage("");
    setIsLoading(true);

    try {
      // Build previous messages payload for server context tracking
      const previousPayload = history.slice(-6).map(chat => ({
        role: chat.role === "user" ? "user" : "model",
        content: chat.content
      }));

      const response = await fetch("/api/chat-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: previousPayload
        })
      });

      if (!response.ok) {
        throw new Error("Tutor gateway communication failure.");
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        role: "ai",
        content: data.response || "I prepared a calculation sheet, but could not formulate a response. Ask again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        role: "ai",
        content: `Error: ${err.message}. Ensure your GEMINI_API_KEY environment variable is configured correctly. Returning simulated offline analysis.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatLogs = () => {
    setHistory([]);
  };

  // Helper utility function to parse markdown code snippets/bold styling in a simple but elegant way
  const renderMessageContent = (text: string) => {
    if (!text) return null;
    const blocks = text.split(/(```[\s\S]*?```)/g);

    return blocks.map((block, idx) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const rawCode = block.slice(3, -3);
        const lines = rawCode.split("\n");
        const language = lines[0]?.trim() || "typescript";
        const codeText = lines.slice(1).join("\n");

        return (
          <div key={idx} className="my-2.5 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold select-none">
              <span>{language}</span>
              <span>2026 SDK</span>
            </div>
            <pre className="p-3 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">{codeText}</pre>
          </div>
        );
      }

      // Format bullet lines or bold marks simply
      const items = block.split("\n").map((line, lIdx) => {
        let cleanLine = line.trim();
        if (cleanLine.startsWith("* ") || cleanLine.startsWith("- ")) {
          const bulletContent = cleanLine.slice(2);
          return (
            <li key={lIdx} className="ml-4 list-disc text-slate-700 text-xs py-0.5 leading-relaxed font-sans">
              {formatBoldWords(bulletContent)}
            </li>
          );
        }
        return (
          <p key={lIdx} className="text-xs text-slate-705 leading-relaxed font-sans font-normal py-0.5">
            {formatBoldWords(cleanLine)}
          </p>
        );
      });

      return <div key={idx}>{items}</div>;
    });
  };

  const formatBoldWords = (str: string) => {
    if (!str) return "";
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-505 bg-indigo-600 border border-indigo-500 shadow-xl flex items-center justify-center text-white hover:scale-105 transition-all duration-300 z-50 cursor-pointer animate-fade-in group"
        id="tutor-floating-activate-btn"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
        <MessageSquareCode className="h-6 w-6 group-hover:rotate-6 transition-transform" />
      </button>

      {/* Floating Sidebar Chat Dialog */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between z-50 animate-fade-in font-sans">
          
          {/* Header Panel */}
          <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-600 p-2 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">2026 Chat Tutor</span>
                  <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded border border-indigo-400/20 uppercase font-mono font-bold font-sans tracking-wide">GEMINI 3.5</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-sans">Adaptive Architectural Mentorship Code</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearChatLogs}
                title="Clear current convo logs"
                className="p-1 px-2 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="text-[10px] font-mono">Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                id="tutor-close-drawer-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Interactive Chat Scroll Field */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={chatScrollRef} id="chat-messages-scroll">
            
            {/* Tutor Welcome Anchor */}
            <div className="flex gap-2.5 items-start max-w-[85%]">
              <div className="rounded-lg bg-indigo-100 p-1.5 text-indigo-700 mt-1 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-none space-y-1.5 shadow-3xs font-sans">
                <p className="text-xs text-slate-800 leading-normal font-medium">
                  Salutations, Tester! I am your <strong>2026 Quality Assurance Mentor</strong>.
                </p>
                <p className="text-xs text-slate-650 leading-relaxed font-normal">
                  I specialize in <strong>Self-Healing Selectors</strong>, <strong>Shift-Right Chaos & Observability</strong>, <strong>Ethical AI Bias Audits</strong>, <strong>Solidity Smart Contracts</strong>, and classical <strong>ISTQB Test Planning/Boundary Values</strong>.
                </p>
                <p className="text-xs text-indigo-600 font-medium">
                  Ask me any conceptual testing question! Pick a fast suggestion below to play:
                </p>
              </div>
            </div>

            {/* Simulated and Active convo messages */}
            {history.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-2.5 items-start max-w-[85%] ${
                  chat.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div className={`rounded-lg p-1.5 mt-1 shrink-0 ${
                  chat.role === "user" ? "bg-slate-200 text-slate-700 animate-fade-in" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {chat.role === "user" ? <Sparkles className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl shadow-3xs text-left ${
                  chat.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none text-xs leading-relaxed font-sans" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none flex flex-col font-sans"
                }`}>
                  {chat.role === "user" ? (
                    <span className="font-sans text-xs">{chat.content}</span>
                  ) : (
                    renderMessageContent(chat.content)
                  )}
                  <span className="text-[8px] font-mono select-none self-end text-slate-400 mt-1">{chat.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Spinning AI Thinker Loader */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="rounded-lg bg-indigo-100 p-1.5 text-indigo-700 mt-1 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-none shadow-3xs flex items-center gap-2 text-xs text-slate-400 font-mono tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Sensing Telemetry Heuristics...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick-Prompt Recommendation chips */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 font-sans">Quick-Prompt Recommendations</div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {suggestions.map((sug, sidx) => (
                <button
                  key={sidx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200/80 text-[10.5px] text-slate-600 border border-slate-200/50 hover:text-slate-800 transition-colors shrink-0 text-left cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* User Chat Input area */}
          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Query testing architectural designs..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(message);
                }
              }}
              disabled={isLoading}
              className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-50"
              id="chat-tutor-user-input"
            />
            <button
              type="button"
              onClick={() => handleSendMessage(message)}
              disabled={isLoading || !message.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-45 text-white rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              id="chat-tutor-submit-btn"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
