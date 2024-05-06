import { z } from "zod";

export enum AnjinatorVariant {
  Style1 = "style-1",
  Style2 = "style-2",
}

export const AnjinatedSchema = z.object({
  mariko: z.string(),
  anjin: z.string(),
  variant: z.enum([AnjinatorVariant.Style1, AnjinatorVariant.Style2])
});