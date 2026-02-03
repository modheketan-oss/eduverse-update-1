import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    // In a real scenario, handle this error more gracefully or mock it
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  const client = getClient();
  if (!client) return null;

  chatSession = client.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the 'EduVerse AI Study Buddy'. 
      Your goal is to help students, professionals, and learners with their educational queries.
      - Be encouraging, concise, and accurate.
      - If asked about the platform, explain that EduVerse offers Academic content, Skills, and Internships.
      - Use emojis occasionally to be friendly.
      - Keep answers under 100 words unless asked for detail.
      - You have access to Google Search. Use it to provide up-to-date and accurate information when relevant.`,
      tools: [{ googleSearch: {} }],
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
    // Fallback if API key is missing
    return { text: "I'm having trouble connecting to the network right now. Please check your API configuration." };
  }

  try {
    const response = await chatSession.sendMessage({ message });
    const text = response.text || "I didn't catch that. Could you rephrase?";
    
    // Extract grounding chunks
    const sources: { title: string; uri: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I encountered an error processing your request." };
  }
};