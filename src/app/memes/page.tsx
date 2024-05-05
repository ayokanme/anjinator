"use client";

import { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { capitalize } from "lodash";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { ReloadIcon } from "@radix-ui/react-icons";

const anjinTones = ["curious", "livid", "pleading", "petulant"] as const;

const AnjinatedSchema = z.object({
  mariko: z.string(),
  anjin: z.string(),
});

const AnjinatorMemeSchema = z
  .object({
    mariko: z
      .string({ required_error: "Mariko Sama has to say something!" })
      .min(4),
  })
  .and(
    z
      .object({
        blackthorne: z
          .string({
            required_error: "C'mon... Blackthorne always has something to say!",
          })
          .min(20),
      })
      .or(
        z.object({
          tone: z.enum(anjinTones, {
            required_error: "You have to pick a tone for Blackthorne!",
          }),
        })
      )
  );

type AnjinatedReturn = z.infer<typeof AnjinatedSchema>;
type AnjinatorMemeForm = z.infer<typeof AnjinatorMemeSchema>;

export function ButtonRender({ isSubmitting }: { isSubmitting: boolean }) {
  return isSubmitting ? (
    <Button disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Generating...
    </Button>
  ) : (
    <Button type="submit">Submit</Button>
  );
}

export default function AnjinatorMemePage() {
  const [activeTab, setActiveTab] = useState("full");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedMeme, setGeneratedMeme] = useState<AnjinatedReturn | null>(
    null
  );

  const form = useForm<AnjinatorMemeForm>({
    resolver: zodResolver(AnjinatorMemeSchema),
    defaultValues: {
      blackthorne: "",
      mariko: "",
    },
  });

  async function onSubmit(data: AnjinatorMemeForm) {
    setIsSubmitting(true);

    const anjin = {
      key: activeTab === "full" ? "blackthorne" : "tone",
      value:
        activeTab === "full" && "blackthorne" in data
          ? data.blackthorne
          : activeTab === "full" && "tone" in data
          ? data.tone
          : undefined,
    };

    const response = await fetch("/api/anjinator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [anjin.key]: anjin.value,
        mariko: data.mariko,
      }),
    });

    const result = await response.json();

    const parsed = AnjinatedSchema.parse(result);

    setGeneratedMeme(parsed);
    setIsSubmitting(false);
  }

  return (
    <Tabs value={activeTab} className="w-[600px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="full" onClick={() => setActiveTab("full")}>
          Full
        </TabsTrigger>
        <TabsTrigger
          value="anjin-speak"
          onClick={() => setActiveTab("anjin-speak")}
        >
          Anjin Speak
        </TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="full">
            <Card>
              <CardHeader>
                <CardTitle>Full Option</CardTitle>
                <CardDescription>
                  {"Put in all the details you want and I'll make it perfect."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="blackthorne"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Blackthorne (Anjin)"}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="The Anjin's ramblings..."
                        />
                      </FormControl>
                      <FormDescription>
                        {"Blackthorne always has something to say!"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mariko"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Mariko Sama"}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="In Mariko Sama's words..."
                        />
                      </FormControl>
                      <FormDescription>
                        {"The understated reply..."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <ButtonRender isSubmitting={isSubmitting} />
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="anjin-speak">
            <Card>
              <CardHeader>
                <CardTitle>{"Surprise me with some anjin-speak!"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 text-black">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Blackthorne's Tone..."}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-[0.5]"
                        >
                          {anjinTones.map((tone, idx) => {
                            const id = `anjin-tone-${idx}`;
                            const value = tone;
                            const label = capitalize(tone);

                            return (
                              <FormItem
                                key={id}
                                className="flex items-center space-x-2"
                              >
                                <FormControl>
                                  <RadioGroupItem id={id} value={value} />
                                </FormControl>
                                <FormLabel htmlFor={id}>{label}</FormLabel>
                              </FormItem>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mariko"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Mariko Sama"}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Mariko Sama's translation..."
                        />
                      </FormControl>
                      <FormDescription>
                        {"Start with the understated reply..."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <ButtonRender isSubmitting={isSubmitting} />
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  );
}
