import type { ReactNode } from "react";

type SectionTagProps = {
  label: string;
  icon?: ReactNode;
  tone?: "light" | "dark";
  textClassName?: string;
  borderClassName?: string;
  paddingClassName?: string;
  heightClassName?: string;
};

export function SectionTag({
  label,
  icon,
  tone = "light",
  textClassName,
  borderClassName,
  paddingClassName = "px-2.5 py-2",
  heightClassName = "h-8",
}: SectionTagProps) {
  const border =
    borderClassName ??
    (tone === "dark" ? "border-[#a9b8c8]" : "border-[#b2b2b2]");
  const text = textClassName ?? (tone === "dark" ? "text-[#a9b8c8]" : "text-[#7b7b7b]");

  return (
    <div className="flex items-start">
      <div
        className={`flex ${heightClassName} items-center justify-center border ${border} ${paddingClassName} -mr-px`}
      >
        <p className={`font-mono text-[10px] uppercase tracking-[0.08em] ${text}`}>
          {label}
        </p>
      </div>
      {icon ? (
        <div
          className={`flex size-8 items-center justify-center border-t border-r border-b ${border}`}
        >
          {icon}
        </div>
      ) : null}
    </div>
  );
}
