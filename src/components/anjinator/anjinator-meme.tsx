"use client";

import NextImage from "next/image";
import { useState } from "react";
import shogun from "../../../public/shogun.jpeg";

import type { AnjinatorMeme } from ".";
import { ClipboardIcon, ImageIcon, UpdateIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { Card, CardContent, CardTitle } from "@components/ui/card";

import { capitalize } from "lodash";
import { toPng } from "html-to-image";

enum Section {
  Blackthorne = "blackthorne",
  Mariko = "mariko",
}
const MEME_CONTENT_ID = "anjinator-meme-content" as const;

export function AnjinatorMemeComponent({ meme }: { meme: AnjinatorMeme }) {
  const isAnjinRotatable = Array.isArray(meme.anjin);

  const [anjin, setAnjin] = useState(
    isAnjinRotatable ? meme.anjin[0] : meme.anjin
  );
  const [mariko, setMariko] = useState(
    isAnjinRotatable ? meme.mariko : meme.mariko[0]
  );
  const [currentIdx, setCurrentIdx] = useState(0);

  function rotateSelection() {
    if (isAnjinRotatable) {
      setCurrentIdx((currentIdx + 1) % meme.anjin.length);
      setAnjin(meme.anjin[currentIdx]);
    } else {
      setCurrentIdx((currentIdx + 1) % meme.mariko.length);
      setMariko(meme.mariko[currentIdx]);
    }
  }

  function copyImageToClipboard() {
    const node = document.getElementById(MEME_CONTENT_ID);

    toPng(node as HTMLElement)
      .then((dataUrl) => {
        const img = new Image(1, 1);
        img.src = dataUrl;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 950;
          canvas.height = 1150;

          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const item = new ClipboardItem({ "image/png": blob as Blob });
            navigator.clipboard.write([item]);

            toast("Meme image copied to clipboard!");
          });
        };
      })
      .catch((error) => {
        console.error("Failed to copy meme image:", error);

        toast("Failed to copy meme image.");
      });
  }

  function copyToClipboard() {
    const textToCopy = `Blackthorne: ${anjin}\n\nMariko Sama: ${mariko}`;

    navigator.clipboard.writeText(textToCopy);

    toast("Copied to clipboard!");
  }

  function ToolTray() {
    const style = { className: "cursor-pointer" } as const;

    const toggleText = `Toggle ${capitalize(
      isAnjinRotatable ? Section.Blackthorne : Section.Mariko
    )} text variants`;

    return (
      <div className="flex space-x-3 text-base items-start">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <UpdateIcon {...style} onClick={rotateSelection} />
            </TooltipTrigger>
            <TooltipContent>{toggleText}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <ClipboardIcon {...style} onClick={copyToClipboard} />
            </TooltipTrigger>
            <TooltipContent>Copy text to clipboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <ImageIcon {...style} onClick={copyImageToClipboard} />
            </TooltipTrigger>
            <TooltipContent>Copy image to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="flex-col space-y-3 w-[454px]">
      <Card className="h-[36px] py-2.5 items-center justify-center">
        <CardContent className="flex items-center justify-between">
          <CardTitle>{"Here's your Anjinator meme"}</CardTitle>
          <ToolTray />
        </CardContent>
      </Card>
      <div id={MEME_CONTENT_ID} className="p-2">
        <Card className="w-[450px]">
          <CardContent className="flex flex-col py-4 items-start space-y-2">
            <div className="flex">
              <span className="inline">
                <span className="font-semibold">{"Blackthorne: "}</span>
                <p id={Section.Blackthorne} className="inline leading-7">
                  {anjin}
                </p>
              </span>
            </div>
            <div className="flex">
              <span>
                <span className="font-semibold">{"Mariko Sama: "}</span>
                <p className="inline leading-7">{mariko}</p>
              </span>
            </div>
            <NextImage
              src={shogun}
              alt="Mariko Sama and the Anjin"
              className="rounded-lg"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
