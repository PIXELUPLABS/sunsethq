import Image from "next/image";

type PrimaryButtonHoverProps = {
  /** Which interaction reveals the state. Touch-first buttons use "active". */
  on?: "hover" | "active";
};

// Full class strings so Tailwind can see them.
const REVEAL = {
  hover: {
    fill: "[@media(hover:hover)]:group-hover:opacity-100",
    strip: "[@media(hover:hover)]:group-hover:translate-x-0",
  },
  active: {
    fill: "group-active:opacity-100",
    strip: "group-active:translate-x-0",
  },
} as const;

const HOVER_WEAVE = "/images/button-hover-weave.webp";

/**
 * Hover surface for the black primary buttons, taken from the Figma
 * "hover" variant: a blue vertical gradient under a soft-light weave with a
 * faint inset edge, and the colour strips sliding in from both sides.
 *
 * Render it inside a `group relative overflow-hidden` button, before the
 * label, which should be `relative` so it stays on top.
 */
export function PrimaryButtonHover({ on = "hover" }: PrimaryButtonHoverProps) {
  const reveal = REVEAL[on];

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${reveal.fill}`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #133264 26.96%, #147dba 143.8%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url(${HOVER_WEAVE})`,
            backgroundSize: "185px 185px",
          }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_0_1.5px_rgba(0,0,0,0.3)]" />
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 -translate-x-full transition-transform duration-300 ${reveal.strip}`}
      >
        <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-1.5 translate-x-full transition-transform duration-300 ${reveal.strip}`}
      >
        <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
      </div>
    </>
  );
}
