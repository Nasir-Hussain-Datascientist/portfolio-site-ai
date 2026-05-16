import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    
    // Read the secret from Cloudflare environment variables
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "GEMINI_API_KEY is not configured.",
        fallback: true
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { message } = await request.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI assistant for a portfolio website. Be helpful, concise, and professional. User message: ${message}`
    });

    return new Response(JSON.stringify({ reply: response.text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate AI response.",
      details: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
