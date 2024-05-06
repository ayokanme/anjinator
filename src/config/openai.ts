import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

export function getOpenAiClient() {
  return new OpenAI({apiKey: process.env.OPENAI_API_KEY,});
}
