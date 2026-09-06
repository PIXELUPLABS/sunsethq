import { PROCESS_BAR_COLORS } from "../lib/constants";

const WIDTHS = ["27%", "21%", "30%", "4%", "6%", "23%"];

export function ProcessBar({ className = "h-[9px]" }: { className?: string }) {
  return (
    <div className={`flex w-full overflow-hidden ${className}`}>
      {PROCESS_BAR_COLORS.map((color, i) => (
        <div
          key={i}
          className="h-full"
          style={{ width: WIDTHS[i], backgroundColor: color }}
        />
      ))}
    </div>
  );
}
