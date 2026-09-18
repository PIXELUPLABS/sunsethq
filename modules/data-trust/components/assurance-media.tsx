import Image from "next/image";
import {
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
  SOFT_LIGHT_TEXTURE,
  SOFT_LIGHT_TEXTURE_SIZE,
} from "../lib/assets";

type AssuranceMediaProps = {
  src?: string;
  alt?: string;
};

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
