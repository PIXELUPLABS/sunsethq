import Image from "next/image";
import { PrimaryButtonHover } from "@/components/ui/primary-button-hover";
import Link from "next/link";

/**
 * The primary hero CTA button - shared so it stays pixel-identical wherever
 * a hero renders it. Defaults to the homepage's "Value my data" button;
 * pass `label`/`href` to reuse the same styling for a different hero.
 */
export function HeroCtaButton({
  label = "Value my data",
  href = "/value-my-data",
}: {
  label?: string;
  href?: string;
} = {}) {
  return (
    <Link
      href={href}
      className="group relative flex w-full max-w-full items-center justify-center overflow-hidden bg-[#141518] px-6 py-4 font-serif text-base tracking-[0.16px] text-white sm:w-[260px]"
    >
      <Image
        src="/images/hero/btn-pattern.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />
      <PrimaryButtonHover />
      <span className="relative leading-[0.8]">{label}</span>
    </Link>
  );
}
