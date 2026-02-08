
import { GoogleGenAI } from "@google/genai";
import { AIResponse, GroundingChunk } from "../types";

export async function getGuideInsights(prompt: string, location?: { latitude: number; longitude: number }): Promise<AIResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
        systemInstruction: `You are a world-class archaeologist and historian guiding a 2-hour tour of the Acropolis in Athens. 
        VISIT DATE: February 16th, 2025. 
        TOUR WINDOW: 10:00 AM - 12:00 PM.
        
        Style Guidelines:
        - Concise, engaging, and authoritative.
        - Use "we" as you are the guide walking with them.
        - Provide photography tips specific to the morning winter sun (lower in the sky, dramatic shadows).
        - If they ask about nearby amenities (toilets, cafe, water), use Google Maps tools to provide links.
        - Treat the user as if they are standing at the coordinates provided: (${targetLat}, ${targetLng}).`
      },
    });

    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[]) || [];

    return {
      text: response.text || "I'm sorry, I'm having trouble retrieving historical data right now.",
      groundingChunks: groundingChunks.map(chunk => ({
        maps: chunk.maps ? { uri: chunk.maps.uri, title: chunk.maps.title } : undefined
      }))
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I encountered an error connecting to my databases. Please check your connection.",
      groundingChunks: []
    };
  }
}
