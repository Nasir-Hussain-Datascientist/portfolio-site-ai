import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat proxy endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured.", 
          fallback: true
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI assistant for a portfolio website. Be helpful, concise, and professional. User message: ${message}`
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({ 
        error: "Failed to generate AI response.", 
        details: error.message,
        fallback: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
