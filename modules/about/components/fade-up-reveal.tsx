"use client";

import type { ReactNode } from "react";
import { useInView } from "@/modules/landing/hooks/use-in-view";

/** Fades and lifts its children into place the first time they scroll into view. */
export function FadeUpReveal({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -80px 0px" });

  return (
    <div
      ref={ref}
      className={`w-full transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
