import Image from "next/image";

type GrainCardProps = {
  title: string;
  body: string;
  tagLabel: string;
  tagIcon?: string;
  /** Opt in to the blue "Replay" hover state (about page growth cards). */
  hoverable?: boolean;
};

const DEFAULT_TAG_ICON = "/images/briefcase-line.svg";
const HOVER_ASSETS = "/images/about/growth-card-hover";
const HOVER_FADE = "transition-opacity duration-300 ease-out motion-reduce:transition-none";
const HOVER_TEXT = "transition-colors duration-300 ease-out motion-reduce:transition-none";

/**
 * The grey grain-textured card with a corner fold and jagged bottom edge,
 * used across feature/criteria grids (about, referrals). Pixel-matched to
 * its Figma source once; reuse this rather than recreating the texture.
 */
export function GrainCard({
  title,
  body,
  tagLabel,
  tagIcon = DEFAULT_TAG_ICON,
  hoverable = false,
}: GrainCardProps) {
  return (
    <div
      className={`relative flex h-60 flex-col justify-between overflow-hidden border border-black/15 px-5 pt-5 pb-10 ${hoverable ? "group" : ""}`}
    >
      <div className="pointer-events-none absolute -inset-px">
        <Image
          src="/images/medium-grey-texture-bg.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {hoverable && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 ${HOVER_FADE}`}
        >
          <div className="absolute inset-0 bg-[#eaebf1]" />
          <div
            className="absolute inset-0 bg-top-left opacity-11 mix-blend-multiply"
            style={{
              backgroundImage: `url(${HOVER_ASSETS}/texture-multiply.webp)`,
              backgroundSize: "370px 370px",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(179.96deg,#133264_26.96%,#147dba_143.8%)]" />
          <div
            className="absolute inset-0 bg-top-left mix-blend-soft-light"
            style={{
              backgroundImage: `url(${HOVER_ASSETS}/texture-soft-light.webp)`,
              backgroundSize: "296px 296px",
            }}
          />
        </div>
      )}

      <div className="relative flex flex-col gap-3">
        <p
          className={`font-serif-regular text-2xl leading-[1.1] tracking-[-0.24px] text-black ${hoverable ? `group-hover:text-white ${HOVER_TEXT}` : ""}`}
        >
          {title}
        </p>
        <p
          className={`text-sm leading-[1.4] tracking-[-0.42px] text-black/60 ${hoverable ? `group-hover:text-white/60 ${HOVER_TEXT}` : ""}`}
        >
          {body}
        </p>
      </div>

      <div className="relative flex items-center gap-1.5 opacity-60">
        <span className="relative size-3">
          <Image
            src={tagIcon}
            alt=""
            width={12}
            height={12}
            className={`size-3 ${hoverable ? `group-hover:opacity-0 ${HOVER_FADE}` : ""}`}
          />
          {hoverable && (
            <Image
              src={`${HOVER_ASSETS}/briefcase-line.svg`}
              alt=""
              width={12}
              height={12}
              className={`absolute inset-0 size-3 opacity-0 group-hover:opacity-100 ${HOVER_FADE}`}
            />
          )}
        </span>
        <p
          className={`text-xs leading-none font-medium text-black uppercase ${hoverable ? `group-hover:text-white ${HOVER_TEXT}` : ""}`}
        >
          {tagLabel}
        </p>
      </div>

      <div
        className={`absolute -top-px right-0 size-4 bg-black ${hoverable ? `group-hover:opacity-0 ${HOVER_FADE}` : ""}`}
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />
      {hoverable && (
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-px right-0 size-4 bg-[#499df8] opacity-0 group-hover:opacity-100 ${HOVER_FADE}`}
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22px] overflow-hidden sm:block ${hoverable ? `group-hover:opacity-0 ${HOVER_FADE}` : ""}`}
        aria-hidden
      >
        <div
          className="absolute inset-x-0 top-0 h-[44px] bg-top bg-no-repeat"
          style={{
            backgroundImage: "url(/images/hover-card-texture-lines.png)",
            backgroundSize: "100% 44px",
          }}
        />
      </div>
      {hoverable && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22px] overflow-hidden opacity-0 group-hover:opacity-100 sm:block ${HOVER_FADE}`}
        >
          <div className="-scale-y-100">
            <Image
              src={`${HOVER_ASSETS}/bottom-lines.webp`}
              alt=""
              width={596}
              height={61}
              className="block h-[61px] w-full max-w-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
