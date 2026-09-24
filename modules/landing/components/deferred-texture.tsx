"use client";

import type { CSSProperties } from "react";
import { useInView } from "../hooks/use-in-view";

type Props = { src: string; className?: string; style?: CSSProperties };

// Defer only decorative paint; the section's text and layout remain in HTML.
export function DeferredTexture({ src, className, style }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px" });
  return <div ref={ref} aria-hidden className={className} style={{ ...style, backgroundImage: inView ? `url("${src}")` : undefined }} />;
}
