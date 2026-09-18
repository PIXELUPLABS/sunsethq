import Image from "next/image";
import { PrimaryButtonHover } from "@/components/ui/primary-button-hover";
import Link from "next/link";

/**
 * The "Value my data" primary CTA used by every hero variant - shared so the
 * button stays pixel-identical wherever a hero renders it.
 */
export function HeroCtaButton() {
  return (
    <Link
      href="/value-my-data"
      className="group relative flex w-full max-w-full items-center justify-center overflow-hidden bg-[#141518] px-6 py-4 font-serif text-base tracking-[0.16px] text-white sm:w-auto"
    >
      <Image
        src="/images/hero/btn-pattern.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />
      <PrimaryButtonHover />
      <span className="relative leading-[0.8]">Value my data</span>
    </Link>
  );
}
