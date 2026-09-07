import { HERO_CODE_SNIPPET_LINES } from "../lib/hero-assets";

export function HeroCodeSnippetCard({
  className,
  textClassName,
  dotClassName,
}: {
  className: string;
  textClassName: string;
  dotClassName: string;
}) {
  return (
    <div className={`absolute flex items-center justify-center ${className}`}>
      <div className={`leading-[1.1] uppercase ${textClassName}`}>
        {HERO_CODE_SNIPPET_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className={`absolute rounded-full ${dotClassName}`} />
    </div>
  );
}
