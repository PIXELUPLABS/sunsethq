"use client";

import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";
import { MobileNav } from "./mobile-nav";
import { usePageScrolled } from "../hooks/use-page-scrolled";

// How far the header shifts down once scrolled, in px - tracked 1:1 against
// the actual scroll position (not CSS-transitioned) so it moves exactly in
// step with the user's own scroll gesture instead of snapping in afterward.
const NAVBAR_SHIFT_PX = 24;

/**
 * `linkBase` prefixes the section anchors so pages other than the home page
 * can point back at it - "/" turns "#how-it-works" into "/#how-it-works".
 */
export function Navbar({ linkBase = "" }: { linkBase?: string }) {
  const { scrolled, scrollY } = usePageScrolled();
  const shiftPx = Math.min(scrollY, NAVBAR_SHIFT_PX);

  return (
    <header
      className={`fixed top-0 left-0 z-20 w-full overflow-hidden border-b border-dashed transition-colors duration-700 ${
        scrolled ? "border-transparent" : "border-[#dedede]"
      }`}
      style={{ transform: `translateY(${shiftPx}px)` }}
    >
      {/* backdrop-filter belongs on its own layer, not the header itself -
          on the header it would make it a containing block for the mobile
          nav panel's position:fixed, collapsing that panel to the header's
          own height instead of the viewport. The 97% ground is the design's:
          it lets the blur read against whatever scrolls under the bar.
          Fades out on scroll so only the right-side bg image section (and
          the elements that live in it) stay visible. */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[#fcfcfc]/97 backdrop-blur-[16px] transition-opacity duration-500 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Fades in once the page scrolls - covers the right half of the bar,
          inset the same 72px other sections use for their desktop side
          padding. */}
      <div
        className={`pointer-events-none absolute inset-y-0 right-[72px] w-1/2 bg-cover bg-right transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url(/images/header-bg-right.svg)" }}
      />

      {/* Fades in over the same right-bg section, 12px in from its own left
          edge (that section is `right-[72px] w-1/2`, so its left edge sits
          at `50% - 72px`). Swaps places with the top-left logo above. */}
      <Link
        href="/"
        aria-hidden={!scrolled}
        tabIndex={scrolled ? undefined : -1}
        className={`absolute top-1/2 left-[calc(50%-60px)] flex -translate-y-1/2 items-center transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Image src="/images/sunset-logo.svg" alt="Replay" width={111} height={36} />
      </Link>

      {/* Below 1800px this is unchanged: max-w-[1560px] + px-6 sm:px-18,
          same as before. At 1800px and up the padding drops to 0 (kept
          `!important` - Tailwind emits the min-[1800px] block before the
          sm: block, so without it sm:px-18, same specificity but later in
          the stylesheet, would win and the padding would stick) while
          max-w-[1560px] stays, so mx-auto centers a fixed 1560px bar
          instead of letting it stretch full-bleed. */}
      <div className="relative mx-auto flex h-16 w-full max-w-[1560px] items-center justify-between px-6 sm:px-18 min-[1800px]:px-0!">
        <Link
          href="/"
          className={`flex items-center transition-opacity duration-500 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image src="/images/sunset-logo.svg" alt="Replay" width={111} height={36} priority />
        </Link>

        {/* Hidden for now - restore by dropping the leading `hidden`. */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 xl:gap-7">
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
          className={`group relative hidden items-center overflow-hidden bg-[#141518] px-5 py-3 font-serif text-xs tracking-wide text-white transition-transform duration-500 lg:flex ${
            scrolled ? "-translate-x-3" : "translate-x-0"
          }`}
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
