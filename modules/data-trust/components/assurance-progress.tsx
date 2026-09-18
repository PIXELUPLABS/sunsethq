import {
  DATA_TRUST_INDICATOR_TEXTURE,
  DATA_TRUST_INDICATOR_TEXTURE_SIZE,
} from "../lib/assets";

type AssuranceProgressProps = {
  activeIndex: number;
  total: number;
};

export function AssuranceProgress({
  activeIndex,
  total,
}: AssuranceProgressProps) {
  return (
    <div className="flex shrink-0 items-start gap-1" aria-hidden>
      {Array.from({ length: total }, (_, index) =>
        index === activeIndex ? (
          <div
            key={index}
            className="relative h-2.5 w-[30px] overflow-hidden bg-[#499df8]"
          >
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                backgroundImage: `url("${DATA_TRUST_INDICATOR_TEXTURE}")`,
                backgroundSize: DATA_TRUST_INDICATOR_TEXTURE_SIZE,
              }}
            />
          </div>
        ) : (
          <div key={index} className="h-2.5 w-0.5 bg-black/14" />
        ),
      )}
    </div>
  );
}
