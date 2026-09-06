"use client";

import { useState } from "react";

export function useAccordion(defaultOpenIndex: number | null = 0) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return { openIndex, toggle };
}
