import { GoogleGenAI, Type, Part } from "@google/genai";
import { Flashcard } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const MOCK_FLASHCARDS: Flashcard[] = [
    { id: 'mock-1', question: 'What is the powerhouse of the cell?', answer: 'The Mitochondria' },
    { id: 'mock-2', question: 'What is React?', answer: 'A JavaScript library for building user interfaces' },
    { id: 'mock-3', question: 'What is Photosynthesis?', answer: 'The process by which green plants use sunlight to synthesize foods with the help of chlorophyll pigment.' },
    { id: 'mock-4', question: 'Capital of Japan?', answer: 'Tokyo' },
];

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const callGemini = async (contents: any): Promise<Flashcard[]> => {
    if (!ai) {
      throw new Error("Gemini AI client not initialized.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The question or term for the flashcard.',
              },
              answer: {
                type: Type.STRING,
                description: 'The answer or definition for the flashcard.',
              },
            },
            required: ["question", "answer"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const generatedCards = JSON.parse(jsonString);

    return generatedCards.map((card: { question: string, answer: string }, index: number) => ({
      ...card,
      id: `gemini-${Date.now()}-${index}`,
    }));
}

const generateMockCards = async (): Promise<Flashcard[]> => {
    console.log("Using mock flashcard generation service.");
    await new Promise(res => setTimeout(res, 1500)); // Simulate API delay
    return MOCK_FLASHCARDS.map(card => ({...card, id: `mock-${Date.now()}-${Math.random()}`}));
}

export const generateFlashcardsFromText = async (text: string): Promise<Flashcard[]> => {
  if (!ai) return generateMockCards();
  
  try {
    const contents = {
        parts: [{ text: `From the following text, generate a set of flashcards. Each flashcard should have a 'question' (a term or concept) and an 'answer' (its definition or explanation). Ensure the questions are concise and the answers are informative. Text: "${text}"` }]
    };
    return await callGemini(contents);
  } catch (error) {
    console.error("Error generating flashcards from text:", error);
    return MOCK_FLASHCARDS.map(card => ({...card, id: `mock-error-text-${Date.now()}`}));
  }
};

export const generateFlashcardsFromFile = async (file: File): Promise<Flashcard[]> => {
    if (!ai) return generateMockCards();

    try {
        const imagePart = await fileToGenerativePart(file);
        const textPart = { text: "You are an expert at creating study materials. Analyze this image of study notes (which could also be a document) and generate a set of concise flashcards. Each flashcard should have a 'question' and an 'answer'." };
        
        const contents = { parts: [imagePart, textPart] };
        return await callGemini(contents);
    } catch (error) {
        console.error("Error generating flashcards from file:", error);
        return MOCK_FLASHCARDS.map(card => ({...card, id: `mock-error-file-${Date.now()}`}));
    }
};