import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with server-side secret API Key and telemetry agent
const getGenAI = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI-feedback endpoints will return simulated responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint to evaluate mock software testing interviews
app.post("/api/evaluate-interview", async (req: Request, res: Response) => {
  const { role, question, answer } = req.body;

  if (!role || !question || !answer) {
    res.status(400).json({ error: "Missing required fields: role, question, answer" });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    // Graceful fallback with standard educational mock feedback if API key is not ready
    setTimeout(() => {
      res.json({
        score: 85,
        rating: "Great Effort",
        feedback: "Your response is highly structured and highlights critical thinking! To advance your answer, mention how you incorporate 'shift-left' verification to catch bugs during analysis. (Note: Running in sandbox mode with mock evaluator.)",
        tips: [
          "Explain how you would write automated regression suites to automate stable paths.",
          "Describe your database verification steps (e.g., checking constraints)."
        ]
      });
    }, 1200);
    return;
  }

  try {
    const prompt = `
      You are a premium corporate software testing manager, interviewer, and testing methodologies expert.
      Evaluate the candidate's answer to the following technical software testing question. 
      Deliver your feedback strictly structured in JSON format. Do not write any markdown blocks outside the JSON itself.
      
      Candidate Role: ${role}
      Interviewer Question: ${question}
      Candidate Answer: ${answer}

      Respond with a JSON object. The JSON layout must strictly conform to this TypeScript interface:
      {
        "score": number, // out of 100
        "rating": string, // e.g. "Excellent", "Competent", "Needs Development"
        "feedback": string, // detailed objective assessment of what was stated correctly, missing concepts, and alignment with industry standards
        "tips": string[] // list of 2-3 specific testing tips to perfect this answer
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an objective, encouraging Senior QA Architect conducting interactive testing interviews. Support the candidate's growth with positive but technically deep guidance."
      }
    });

    const responseText = response.text || "{}";
    const resultObj = JSON.parse(responseText.trim());
    res.json(resultObj);
  } catch (error: any) {
    console.error("Gemini API Error in evaluation:", error);
    res.status(500).json({
      error: "Failed to evaluate answer.",
      details: error.message,
      // Fallback response inside error gracefully
      score: 75,
      rating: "Satisfactory",
      feedback: "Review completed successfully. Try to outline technical steps explicitly (Expected Results, Environment metrics).",
      tips: ["Adopt dynamic fluent waits", "Structure test bounds using BVA"]
    });
  }
});

// API Endpoint to evaluate drafted manual test cases in Module 4 Practical Skills
app.post("/api/evaluate-test-case", async (req: Request, res: Response) => {
  const { requirement, testCases } = req.body;

  if (!requirement || !testCases) {
    res.status(400).json({ error: "Missing required fields: requirement, testCases" });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    // Graceful fallback with standard manual test-case validation
    setTimeout(() => {
      res.json({
        score: 90,
        grade: "Strong Test Coverage",
        feedback: "Your test suite includes solid positive paths! You correctly mapped variables like user credentials and credit numbers. To improve, add boundary value checks (e.g. verifying minimum character lengths). (Note: Running in sandbox mode with mock reviewer.)",
        missingEdgeCases: [
          "Validation of special alphanumeric characters in username inputs.",
          "Network timeout simulations on checkout button taps."
        ]
      });
    }, 1200);
    return;
  }

  try {
    const prompt = `
      You are an expert QA Team Lead and software testing specialist.
      Review the candidate's drafted test cases designed to test the following technical feature requirement.
      Identify if they followed industry best practices (Title, clear multi-step procedures, concrete expected outputs, and negative test coverage).
      Deliver your code-review review strictly structured in JSON format. Do not write any markdown blocks outside the JSON itself.
      
      Feature Requirement: ${requirement}
      Candidate Test Cases: ${JSON.stringify(testCases)}

      Respond with a JSON object. The JSON layout must strictly conform to this TypeScript interface:
      {
        "score": number, // out of 100
        "grade": string, // e.g. "Outstanding Coverage", "Basic Flow", "Deficient Strategy"
        "feedback": string, // comprehensive professional team-lead critique on formatting, accuracy, and thoroughness
        "missingEdgeCases": string[] // list of 2-3 extra edge test scenarios they missed focusing on
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a professional software testing lead. Provide highly educational, precise code-review style test suite assessments."
      }
    });

    const responseText = response.text || "{}";
    const resultObj = JSON.parse(responseText.trim());
    res.json(resultObj);
  } catch (error: any) {
    console.error("Gemini API Error in test case evaluation:", error);
    res.status(500).json({
      error: "Failed to evaluate test cases.",
      details: error.message,
      score: 80,
      grade: "Validation Accepted",
      feedback: "Your layout adheres on structured steps. Remember to specify exact boundaries for edge scenarios.",
      missingEdgeCases: ["Double-click button stress checks", "Timeout exceptions"]
    });
  }
});

// API Endpoint to chat with the 2026 AI QA Tutor
app.post("/api/chat-tutor", async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    res.status(400).json({ error: "Missing required 'message' field." });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    // Simulator fallback
    setTimeout(() => {
      res.json({
        response: `[DEMO MODE: AI Tutor Inline] You asked: "${message}". In 2026, software testing has shifted left (evaluating AI biases and requirements early) and shifted right (using Datadog, Prometheus, in-production synthetic loops, and Chaos engineering). Feel free to ask more. (Note: Run with a valid GEMINI_API_KEY for dynamic real-time AI conversation.)`
      });
    }, 800);
    return;
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.map((chat: any) => ({
          role: chat.role === "user" ? "user" : "model",
          parts: [{ text: chat.content }],
        }))
      : [];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are an expert AI Tutor and Software Testing Architect in the year 2026. Explain advanced testing concepts, 2026 industry trends (such as AI-augmented testing, shift-left/right, low-code QA suites, Solidity/blockchain validation, ethical AI model auditing, and quantum valuations), test design mechanics, or career paths. Keep responses engaging, highly structured, accurate, and easy to understand with clear markdown formatting. Support the user with micro-explanations or analogies like 'Explain BVA like I'm 5' when asked."
      }
    });

    res.json({ response: response.text || "No response received." });
  } catch (error: any) {
    console.error("Gemini API Error in chat-tutor:", error);
    res.status(500).json({ error: "Failed to query AI Tutor.", details: error.message });
  }
});

// API Endpoint to generate custom AI Test Cases (manual or Playwright automated script)
app.post("/api/generate-test-cases", async (req: Request, res: Response) => {
  const { requirement, format } = req.body;

  if (!requirement) {
    res.status(400).json({ error: "Missing required 'requirement' field." });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    const mockCases = format === "automated" 
      ? `// Auto-generated using Playwright AI (2026 Client Suite)
import { test, expect } from '@playwright/test';

test.describe('Automated AI Suite: ${requirement.replace(/'/g, "\\'")}', () => {
  test('A11y Check: WCAG 3.0 standard evaluation', async ({ page }) => {
    await page.goto('/sandbox');
    // Verify cognitive responsive elements are accessible
    const headings = await page.locator('h1, h2');
    await expect(headings.first()).toBeVisible();
  });

  test('Boundary and Self-Healing Edge Verifications', async ({ page }) => {
    await page.goto('/sandbox');
    // Fill required details with automated smart elements
    await page.fill('input[name="paymentAmount"]', "1000000"); 
    await page.click('button:has-text("Submit Transaction")');
    // Target element should recover gracefully from visual layout alterations
    await expect(page.locator('.alert-validation')).toBeVisible();
  });
});`
      : `### [TEST SHEET] Auto-Generated Scenarios for "${requirement}"
**Requirement Reference:** ${requirement}

| Test ID | Title | Test Steps | Expected Result | Type |
|---|---|---|---|---|
| TC-AI-01 | Positive validation of input pathways | 1. Navigate to sandbox environment.<br>2. Provide valid 2026 format parameters.<br>3. Submit the transaction payload. | System records action successfully with 200 OK telemetry code. | Positive |
| TC-AI-02 | Conversational boundary check | 1. Input empty or overflow datasets.<br>2. Submit details. | Input is rejected with precise modal safety instructions. | Negative |
| TC-AI-03 | AI-Bias Audit Check | 1. Inject diverse sample demographic data inputs.<br>2. Verify if AI system behaves identical. | Score parameters remain distributed uniformly, proving zero demographic bias. | Non-Functional |`;

    setTimeout(() => {
      res.json({ testCases: mockCases });
    }, 1000);
    return;
  }

  try {
    const isAutomated = format === "automated";
    const prompt = isAutomated
      ? `Generate a fully functional modern automated test script in Playwright/TypeScript for this feature requirement: "${requirement}".
      Structure it using the best practices for 2026, incorporating self-healing selection hooks, clear browser context variables, visual testing expectations, and boundary assessments. 
      Return ONLY the code block. Do not write any outer markdown conversational wrappers. Just return the code itself.`
      : `Generate a structured, professional set of manual test cases (including ID, Title, Steps, Expected Result, and testing classification type) for this feature requirement: "${requirement}". Include both positive paths and 2026-relevant edge situations (e.g. cloud bottlenecks, network drops, Accessibility, or input fairness checks).
      Return ONLY the table or markdown list directly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an AI Test Automation Engineer who outputs extremely clean, high-coverage testing plans and scripts without any extra conversation or chat preamble."
      }
    });

    res.json({ testCases: response.text || "Failed to generate." });
  } catch (error: any) {
    console.error("Gemini API Error in generate-test-cases:", error);
    res.status(500).json({ error: "Failed to generate test cases." });
  }
});

// API Endpoint to translate chaotic user feedback into structured smart bug reports
app.post("/api/format-bug-report", async (req: Request, res: Response) => {
  const { rawText } = req.body;

  if (!rawText) {
    res.status(400).json({ error: "Missing required 'rawText' field." });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    setTimeout(() => {
      res.json({
        formattedReport: `### 🐛 [BUG] Defect reported in Sandbox
**Report Summary:** ${rawText}

---

#### 📌 Technical Severity & Business Priority:
- **Technical Severity:** **Major** *(The system fails to complete correct operations under specific boundary states.)*
- **Business Priority:** **High** *(Causes immediate visual drop-offs and interrupts conversion funnels.)*

---

#### 🧪 Steps to Reproduce:
1. Load up the Cloud-Native Sandroom.
2. Formulate actions: "${rawText}".
3. Open browser Console to monitor active telemetry responses.

#### 🎯 Expected Result:
The action flows cleanly, maintains standard bounds, and registers complete tracking metrics in Datadog/Prometheus traces.

#### ⚠️ 2026 Shift-Right Quality Impact:
* Trace latency is preserved within standard thresholds.
* Container limits are guarded against high memory peaks.`
      });
    }, 1000);
    return;
  }

  try {
    const prompt = `Convert the following raw description of a software defect into a professional, highly structured 2026 Jira/GitHub-ready bug report:
    "${rawText}"
    
    Structure the output with:
    - Bug Title (Clear, concise naming conventions)
    - Defect Technical Severity & Business Priority (Justified based on 2026 standards)
    - Detailed Steps to Reproduce
    - Expected vs. Actual Result
    - 2026 Quality Impact Analysis (discussing telemetry logs, Kubernetes logs, or accessibility issues)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI Lead Auditor. Convert informal bug observations into pristine and highly actionable developer defect tickets."
      }
    });

    res.json({ formattedReport: response.text || "Failed to format report." });
  } catch (error: any) {
    console.error("Gemini Error in format-bug-report:", error);
    res.status(500).json({ error: "Failed to format bug report." });
  }
});

// Boot the core web app
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting securely on http://localhost:${PORT}`);
  });
}

startServer();
