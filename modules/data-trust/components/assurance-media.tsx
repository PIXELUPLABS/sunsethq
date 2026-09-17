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
 * The plate beside each row, unchanged at its exact 703x490 design size
 * from `min-[1440px]:` up (fixed `w-[703px] h-[490px]`, matching the
 * original design pixel-for-pixel). Only between 1024-1439px does it go
 * fluid (`lg:max-[1439px]:w-[45%]`, `aspect-[703/490]` instead of a fixed
 * height) so it shrinks with the row instead of staying rigidly 703px wide
 * and squeezing the text column next to it - the box's height shrinks in
 * lockstep with its width in that range, so the full image stays visible
 * via `object-cover` rather than a fixed-height box cropping more of it off
 * as the width narrows. With real artwork, it's just that image - the flat
 * ground, soft-light weave, and grain band below are the
 * empty-placeholder's own look, not something layered on top of real art.
 * `lg:max-[1439px]:self-start`: the row now uses `items-stretch` (see
 * `AssuranceRow`) so the text column can grow to match this plate's height
 * in that same 1024-1439px range - without `self-start` here, that same
 * stretch would also apply to this plate, forcing its height to whatever
 * the row (now driven by the taller side) computes to and breaking its
 * `aspect-[703/490]`. Not needed at `min-[1440px]:`, where the plate's own
 * explicit height already overrides stretch on its own.
 */
export function AssuranceMedia({ src, alt = "" }: AssuranceMediaProps) {
  if (src) {
    return (
      <div className="relative aspect-[703/490] w-full shrink-0 overflow-hidden bg-[#cbccd5] lg:max-[1439px]:w-[45%] lg:max-[1439px]:self-start min-[1440px]:aspect-auto min-[1440px]:h-[490px] min-[1440px]:w-[703px]">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, (max-width: 1439px) 45vw, 703px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[703/490] w-full shrink-0 overflow-hidden bg-[#cbccd5] lg:max-[1439px]:w-[45%] lg:max-[1439px]:self-start min-[1440px]:aspect-auto min-[1440px]:h-[490px] min-[1440px]:w-[703px]">
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url("${SOFT_LIGHT_TEXTURE}")`,
          backgroundSize: SOFT_LIGHT_TEXTURE_SIZE,
        }}
      />
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
