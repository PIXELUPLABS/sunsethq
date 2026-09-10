"use client";

import { AutoplayVideo } from "./autoplay-video";
import { useReplayTrigger } from "../hooks/use-replay-trigger";

export function StepVideo({ src, active }: { src: string; active: boolean }) {
  const playKey = useReplayTrigger(active);

  return <AutoplayVideo key={playKey} src={src} className="h-full w-full object-cover" />;
}
