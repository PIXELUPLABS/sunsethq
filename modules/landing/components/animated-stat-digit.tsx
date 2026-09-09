"use client";

import { useDigitCountUp } from "../hooks/use-digit-count-up";

export function AnimatedStatDigit({
  target,
  digitIndex,
  start,
}: {
  target: number;
  digitIndex: number;
  start: boolean;
}) {
  const display = useDigitCountUp(target, start, digitIndex);

  return <span>{display}</span>;
}
