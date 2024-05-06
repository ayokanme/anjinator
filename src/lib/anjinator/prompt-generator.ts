import { z } from "zod";
import { AnjinatedSchema } from "./types";

export function promptGenerator(inputs: z.infer<typeof AnjinatedSchema>) {
  const { mariko, anjin, variant } = inputs;

  return `Generate a ${variant} meme. Here are the inputs:
  Blackthorne: ${anjin}
  Mariko Sama: ${mariko}`
}