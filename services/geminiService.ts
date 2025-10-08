// services/geminiService.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


// سنقوم بتهيئة النموذج داخل الدالة لتجنب الأخطاء عند بدء التشغيل
let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env.local file and restart the server.");
}

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export const getChatbotResponse = async (message: string): Promise<string> => {
  // تحقق مرة أخرى هنا
  if (!genAI) {
    return "I am currently offline. The API key is missing or invalid.";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `You are a friendly and helpful AI assistant for Al Safaa Hospital.
      You can answer general questions about hospital services, visiting hours, and provide encouragement.
      If asked for medical advice, gently decline and advise the user to consult their assigned doctor.
      Keep your answers concise and easy to understand.`,
    });

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I'm having trouble connecting right now. Please check the API key and server console for errors.";
  }
};