import Image from "next/image";
import Link from "next/link";

/**
 * The "Value my data" primary CTA used by every hero variant - shared so the
 * button stays pixel-identical wherever a hero renders it.
 */
export function HeroCtaButton() {
  return (
    <Link
      href="/value-my-data"
      className="group relative flex h-13 w-[300px] max-w-full items-center justify-center overflow-hidden bg-[#141518] font-serif text-xs tracking-[0.1px] text-white lg:h-auto lg:py-6 lg:text-base lg:tracking-wide"
    >
      <Image
        src="/images/hero/btn-pattern.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
      </div>
      <span className="relative">Value my data</span>
    </Link>
  );
}
