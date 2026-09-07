export function HeroClassificationText({
  className,
  text,
}: {
  className: string;
  text: string;
}) {
  return (
    <div
      className={`absolute flex -translate-y-1/2 flex-col justify-center font-mono text-[9.719px] leading-[1.3] tracking-[-0.11px] whitespace-pre-line uppercase ${className}`}
    >
      {text}
    </div>
  );
}
