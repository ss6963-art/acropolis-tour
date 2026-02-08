
import { GoogleGenAI } from "@google/genai";
import { AIResponse } from "../types";

export async function getGuideInsights(prompt: string, location?: { latitude: number; longitude: number }): Promise<AIResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Acropolis coordinates if geolocation isn't provided/relevant
  const targetLat = location?.latitude || 37.9715;
  const targetLng = location?.longitude || 23.7257;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: targetLat,
              longitude: targetLng
            }
          }
        },
        systemInstruction: `You are a world-class archaeologist and historian guiding a 2-hour tour of the Acropolis in Athens on February 16th at 10 AM. 
        Be concise, engaging, and provide practical tips (like where to stand for the best photo or historical tidbits others miss).
        Always check Google Maps for current accessibility or specific location details if asked. 
        If you find relevant places on Google Maps, the user will see the links automatically.`
      },
    });

    return {
      text: response.text || "I'm sorry, I couldn't find information on that right now.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I encountered an error connecting to my historical databases. Please try again.",
      groundingChunks: []
    };
  }
}
