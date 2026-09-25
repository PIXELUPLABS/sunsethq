import Image from "next/image";

type GrainCardProps = {
  title: string;
  body: string;
  tagLabel: string;
  tagIcon?: string;
};

const DEFAULT_TAG_ICON = "/images/briefcase-line.svg";

/**
 * The grey grain-textured card with a corner fold and jagged bottom edge,
 * used across feature/criteria grids (about, referrals). Pixel-matched to
 * its Figma source once; reuse this rather than recreating the texture.
 */
export function GrainCard({ title, body, tagLabel, tagIcon = DEFAULT_TAG_ICON }: GrainCardProps) {
  return (
    <div className="relative flex h-60 flex-col justify-between overflow-hidden border border-black/15 px-5 pt-5 pb-10">
      <div className="pointer-events-none absolute -inset-px">
        <Image
          src="/images/medium-grey-texture-bg.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-col gap-3">
        <p className="font-serif-regular text-2xl leading-[1.1] tracking-[-0.24px] text-black">
          {title}
        </p>
        <p className="text-sm leading-[1.4] tracking-[-0.42px] text-black/60">{body}</p>
      </div>

      <div className="relative flex items-center gap-1.5 opacity-60">
        <Image src={tagIcon} alt="" width={12} height={12} className="size-3" />
        <p className="text-xs leading-none font-medium text-black uppercase">{tagLabel}</p>
      </div>

      <div
        className="absolute -top-px right-0 size-4 bg-black"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22px] overflow-hidden sm:block"
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
    </div>
  );
}
