import { parseStatValue } from "../lib/parse-stat-value";
import { AnimatedStatDigit } from "./animated-stat-digit";

export function AnimatedStatValue({ value, start }: { value: string; start: boolean }) {
  const segments = parseStatValue(value);

  return (
    <>
      {segments.map((segment, i) =>
        segment.type === "digit" ? (
          <AnimatedStatDigit
            key={i}
            target={segment.value}
            digitIndex={segment.digitIndex}
            start={start}
          />
        ) : (
          <span key={i}>{segment.value}</span>
        )
      )}
    </>
  );
}
