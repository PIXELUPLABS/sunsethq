"use client";

import Image from "next/image";
import { AutoplayVideo } from "./autoplay-video";

export function DeidentificationMediaLayer({
  videoSrc,
  imageSrc,
  isIncoming,
}: {
  videoSrc?: string;
  imageSrc: string;
  isIncoming: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 ${isIncoming ? "animate-[reveal-fade_500ms_ease-out]" : ""}`}
    >
      {videoSrc ? (
        <AutoplayVideo src={videoSrc} className="h-full w-full object-cover" />
      ) : (
        <Image
          src={imageSrc}
          alt="Redacted email preview: an original message shown alongside the same message with personally identifiable information replaced by gray redaction bars"
          fill
          className="object-cover"
        />
      )}
    </div>
  );
}
