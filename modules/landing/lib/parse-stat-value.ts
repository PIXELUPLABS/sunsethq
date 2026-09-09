export type StatValueSegment =
  | { type: "digit"; value: number; digitIndex: number }
  | { type: "text"; value: string };

export function parseStatValue(value: string): StatValueSegment[] {
  let digitIndex = 0;

  return value.split("").map((char) => {
    if (/\d/.test(char)) {
      const segment: StatValueSegment = { type: "digit", value: Number(char), digitIndex };
      digitIndex += 1;
      return segment;
    }

    return { type: "text", value: char };
  });
}
