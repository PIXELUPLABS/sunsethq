import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";
import { MobileNav } from "./mobile-nav";

/**
 * `linkBase` prefixes the section anchors so pages other than the home page
 * can point back at it - "/" turns "#how-it-works" into "/#how-it-works".
 */
export function Navbar({ linkBase = "" }: { linkBase?: string }) {
  return (
    <header className="fixed top-0 left-0 z-20 w-full overflow-hidden border-b border-dashed border-[#dedede]">
      {/* backdrop-filter belongs on its own layer, not the header itself -
          on the header it would make it a containing block for the mobile
          nav panel's position:fixed, collapsing that panel to the header's
          own height instead of the viewport. The 97% ground is the design's:
          it lets the blur read against whatever scrolls under the bar. */}
      <div className="pointer-events-none absolute inset-0 bg-[#fcfcfc]/97 backdrop-blur-[16px]" />

      <div className="relative mx-auto flex h-16 w-full max-w-[1560px] items-center justify-between px-6 sm:px-18">
        <Link href="/" className="flex items-center">
          <Image src="/images/sunset-logo.svg" alt="Replay" width={111} height={36} priority />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 lg:flex xl:gap-7">
          {NAV_LINKS.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm tracking-tight text-[#777] transition-colors hover:text-[#141518]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={`${linkBase}${link.href}`}
                className="text-sm tracking-tight text-[#777] transition-colors hover:text-[#141518]"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <MobileNav linkBase={linkBase} />

        <a
          href="#value-my-data"
          className="group relative hidden items-center overflow-hidden bg-[#141518] px-5 py-3 font-serif text-xs uppercase tracking-wide text-white lg:flex"
        >
          <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
          </div>
          <span className="relative">Value my data</span>
        </a>
      </div>
    </header>
  );
}
