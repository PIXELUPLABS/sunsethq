import Image from "next/image";
import {
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
  SOFT_LIGHT_TEXTURE,
  SOFT_LIGHT_TEXTURE_SIZE,
} from "../lib/assets";

type AssuranceMediaProps = {
  /** Artwork isn't in the design yet; without it this renders the empty plate. */
  src?: string;
  alt?: string;
};

/**
 * The 703x408 plate beside each row: a flat ground, a soft-light weave, and
 * the grain band the design runs along the bottom edge.
 */
export function AssuranceMedia({ src, alt = "" }: AssuranceMediaProps) {
  return (
    <div className="relative aspect-[703/408] w-full shrink-0 overflow-hidden bg-[#cbccd5] lg:aspect-auto lg:h-[408px] lg:w-[703px]">
      {src ? (
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 703px" className="object-cover" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url("${SOFT_LIGHT_TEXTURE}")`,
            backgroundSize: SOFT_LIGHT_TEXTURE_SIZE,
          }}
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-48 mix-blend-multiply"
        style={{
          backgroundImage: `url("${DATA_TRUST_GRAIN_STRIP}")`,
          backgroundSize: DATA_TRUST_GRAIN_STRIP_SIZE,
        }}
      />
      {/* the denser band the design lays across the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 opacity-48 mix-blend-multiply"
        style={{
          backgroundImage: `url("${DATA_TRUST_GRAIN_STRIP}")`,
          backgroundSize: "387px 516px",
        }}
      />
    </div>
  );
}
