import { openAiClient } from "@config/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    const inputs = await req.json();
    // // todo: inputs(blackthorne, mariko sama)
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "SYSTEM_MESSAGE",
      },
      {
        role: "user",
        content: "inputs(blackthorne, mariko sama)",
      }
    ];

    const response = await openAiClient.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return error;
  }
}