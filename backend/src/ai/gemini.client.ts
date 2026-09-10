import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

export const geminiClient = new GoogleGenAI({
  apiKey: config.geminiApiKey,
});