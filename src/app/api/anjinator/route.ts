import { getOpenAiClient } from "@config/openai";
import { promptGenerator } from "@lib/anjinator/prompt-generator";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AnjinatedSchema, AnjinatorVariant } from "@lib/anjinator/types";
import { AnjinatorStyle1Schema, AnjinatorStyle2Schema, SYSTEM_PROMPT } from "@lib/anjinator/system-prompt";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const inputs = AnjinatedSchema.parse(data);

    const prompt = promptGenerator(inputs)

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      }
    ];

    const client = getOpenAiClient();
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      temperature: 0.8
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    const content = JSON.parse(response.choices[0].message.content);
    console.log("content [POST api/anjinator] ", content);

    const meme = inputs.variant === AnjinatorVariant.Style1 ? AnjinatorStyle1Schema.parse(content) : AnjinatorStyle2Schema.parse(content);

    return new Response(JSON.stringify(meme), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.warn("error [POST api/anjinator] ", error);
    return new Response("server error", { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}