type Props = {
  /** Tailwind height class for the fade band, e.g. "h-[30%]". */
  heightClass: string;
};

/**
 * Grain-textured paper gradient laid over the bottom of a hero illustration
 * so it dissolves into the section background instead of ending on an edge.
 */
export function HeroBottomFade({ heightClass }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 ${heightClass}`}
      style={{
        backgroundColor: "#fcfcfc",
        backgroundImage: "url(/images/grain-light-texture.svg)",
        backgroundSize: "cover",
        maskImage: "linear-gradient(to bottom, transparent, black)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
      }}
    />
  );
}
