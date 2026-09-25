import type { PurposeNode } from "../types";

const TONE_CLASSES: Record<PurposeNode["tone"], string> = {
  muted: "border border-dashed border-white/30 bg-[rgba(11,11,11,0.39)]",
  outline: "border border-dashed border-white/70",
  highlight: "border border-white/60 bg-white/8",
};

export function PurposeDiagramNode({ node }: { node: PurposeNode }) {
  return (
    <div
      className={`flex h-24 flex-1 flex-col justify-between px-3.5 py-3 ${TONE_CLASSES[node.tone]}`}
    >
      <p className="font-mono text-[10px] tracking-[0.9px] text-[#ddd] uppercase">
        {node.label}
      </p>
      <div className="flex flex-col gap-1.5">
        <p className="font-serif text-xl leading-none tracking-[-0.4px] text-white uppercase">
          {node.value}
        </p>
        {node.showYieldBar ? (
          <div className="flex items-start gap-[3px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-1.5 w-6 shrink-0 bg-[#499df8]" />
            ))}
            <div className="h-1.5 w-6 shrink-0 bg-white/20" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
