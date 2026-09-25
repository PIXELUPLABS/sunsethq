import Image from "next/image";
import { PURPOSE_DIAGRAM_ARROW } from "../lib/assets";
import { PURPOSE_ROWS } from "../lib/constants";
import { PurposeDiagramNode } from "./purpose-diagram-node";

export function PurposeDiagram() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-9">
      {PURPOSE_ROWS.map((row) => (
        <div
          key={row.label}
          className={`flex flex-col gap-3 ${row.muted ? "opacity-55" : ""}`}
        >
          <p className="font-mono text-[10px] tracking-[0.9px] text-[#ddd] uppercase">
            {row.label}
          </p>
          <div className="flex items-center gap-3">
            {row.nodes.map((node, index) => (
              <div key={node.label} className="contents">
                {index > 0 ? (
                  <div className="relative h-2 w-[18px] shrink-0">
                    <Image
                      src={PURPOSE_DIAGRAM_ARROW}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : null}
                <PurposeDiagramNode node={node} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
