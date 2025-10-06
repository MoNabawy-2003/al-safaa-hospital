import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Chatbot functionality will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are a friendly and helpful AI assistant for Al Safaa Hospital. 
Do not provide medical advice under any circumstances. 
You can answer general questions about hospital services, visiting hours, and provide encouragement. 
If asked for medical advice, gently decline and advise the user to consult their assigned doctor.
Keep your answers concise and easy to understand.`;

export const getChatbotResponse = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("I am currently offline. Please try again later.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};