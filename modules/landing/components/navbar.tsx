"use client";

import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { usePageScrolled } from "../hooks/use-page-scrolled";

/**
 * `linkBase` prefixes the section anchors so pages other than the home page
 * can point back at it - "/" turns "#how-it-works" into "/#how-it-works".
 */
export function Navbar({ linkBase = "" }: { linkBase?: string }) {
  const { scrolled } = usePageScrolled();

  return (
    <header
      className={`fixed top-0 left-0 z-20 w-full overflow-hidden border-b border-dashed border-[#dedede] transition-[border-color,translate] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        // No translate utility at all below `lg` - even a zero translate-y-0
        // would make this header a containing block for MobileNav's `fixed`
        // panel, anchoring it to the header's own box instead of the
        // viewport (the same class of bug the backdrop-filter comment above
        // warns about). MobileNav itself is only ever mounted `md:hidden` and
        // below, so this doesn't need to worry about that until `lg:` - the
        // floating/scrolled treatment is deliberately `lg:`-only everywhere
        // in this file, so 768-1024px always renders the plain default bar.
        scrolled ? "lg:translate-y-4 lg:border-transparent" : "lg:translate-y-0"
      }`}
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
          scrolled ? "opacity-100 lg:opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>

      {/* Same two-layer box every content section uses - `px-6 sm:px-18`
          padding first, then a `mx-auto max-w-[1560px]` band nested inside
          the padded area - instead of capping the outer wrapper itself at
          1560px. Capping the outer wrapper directly made it hit its cap (and
          start centering with mx-auto slack) as soon as the viewport passed
          1560px, while every content section's own band - padded first,
          capped second - doesn't reach that same centered state until the
          padded-down width also hits 1560px (1704px viewport). Between
          1560-1704px that mismatch left this band's right edge up to ~72px
          short of, and its center line off from, the matching section
          band's (e.g. the how-it-works video column's) edges. Padding first
          reproduces the exact same math as those sections at every width, so
          the two stay aligned continuously instead of only above ~1704px.
          `min-[1800px]:px-0!` mirrors the content row's own override just
          below, for the same specificity reason noted there. `z-index` isn't
          set here on purpose - it stays below the content row (a later,
          unpositioned-z sibling that paints on top per DOM order) so that
          row's real "Value my data" button keeps showing over this band's
          right-side bg image. Only the icon/links below need to win that
          stacking fight, so they carry their own `z-10` instead of lifting
          the whole band. */}
      <div className="pointer-events-none absolute inset-0 hidden px-6 sm:px-18 lg:block min-[1800px]:px-0!">
        <div className="relative mx-auto h-full max-w-[1560px]">
          {/* Fades in once the page scrolls - covers the full band above.
              Same grain-texture background the default (unscrolled) bar
              uses above, not a dedicated floating-bar image. */}
          <div
            className={`absolute inset-y-0 right-0 w-full border border-[#A8A8A8] bg-cover bg-right transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: "url(/images/grain-light-texture.svg)" }}
          />

          {/* Mirrors the right-side band above on the left edge, same width. */}
          <div
            className={`absolute inset-y-0 left-0 w-full border border-[#A8A8A8] bg-cover bg-left transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: "url(/images/grain-light-texture.svg)" }}
          />

          {/* Fades in over the bg bands above, 12px in from the row's own
              left edge - lands near where the top-left logo below fades
              out, a near-positional swap rather than just a role swap. */}
          <Link
            href="/"
            aria-hidden={!scrolled}
            tabIndex={scrolled ? undefined : -1}
            className={`pointer-events-auto absolute top-1/2 left-3 z-10 flex -translate-y-1/2 items-center transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image src="/favicon-light.svg" alt="Replay" width={28} height={28} />
          </Link>
        </div>
      </div>

      {/* Below 1560px and at 1800px+ this is unchanged (see that rule's own
          comment above for the 1800px handoff).
          1560-1800px: the goal is the scrolled "Value my data" button
          sitting a constant 12px inside the right edge of the 50%
          floating band above (not the viewport edge). That 12px already
          exists as this button's own `-translate-x-3` (scrolled-only), so
          the padding math below only needs to bring the button *flush*
          with the band's edge (0px gap) pre-transform - the existing
          transform then supplies the 12px inset on top of that whenever
          the band is actually visible.
          The band's own right edge is *not* a fixed distance from the
          viewport across this whole range, since it uses the fixed
          padding-first/cap-second order (72px flush from 1560 up to
          1704px, where its own max-w-[1560px] starts engaging, then a
          growing margin on top of that 72px past 1704px), while this row
          still uses the older cap-first/padding-second order (mx-auto
          max-w-[1560px], *then* padding), so its own margin starts
          growing immediately at 1560px instead of at 1704px - the two
          edges drift apart by up to 72px across 1560-1704px before
          converging.
          The fix is a `padding-right` that cancels exactly that drift:
          `calc(852px_-_50vw)` (1560-1704px) is 72px at 1560px (matching
          the band's own flush 72px, since the row isn't over-margined
          yet there either), sliding down to 0px at 1704px, where the
          drift has fully closed; 1704-1800px then holds flat at `0px`,
          since past 1704px both boxes are centered by the same
          `max-w-[1560px]`/`mx-auto`, so their edges move in lockstep and
          the drift is already gone. `max-[1704px]` is exclusive (< 1704)
          in this Tailwind version, matching `max-[1800px]`'s exclusivity
          noted below, so the two ranges hand off with no overlap or gap
          at the boundary. */}
      <div className="relative mx-auto flex h-16 w-full max-w-[1560px] items-center justify-between px-6 sm:px-18 min-[1560px]:max-[1704px]:pr-[calc(852px_-_50vw)]! min-[1704px]:max-[1800px]:pr-0! min-[1800px]:px-0!">
        <Link
          href="/"
          className={`flex items-center transition-opacity duration-500 ${
            scrolled ? "opacity-100 lg:opacity-0" : "opacity-100"
          }`}
        >
          <Image src="/images/sunset-logo.svg" alt="Replay" width={111} height={36} priority />
        </Link>

        <MobileNav linkBase={linkBase} />

        <div className="hidden items-center gap-6 md:flex">
          <NavLinks
            linkBase={linkBase}
            className={`hidden items-center gap-6 transition-transform duration-500 md:flex ${
              scrolled ? "lg:-translate-x-3" : "lg:translate-x-0"
            }`}
          />

          <Link
            href="/value-my-data"
            className={`group relative hidden items-center overflow-hidden bg-[#141518] px-5 py-3 font-serif text-xs tracking-wide text-white transition-transform duration-500 md:flex ${
              scrolled ? "lg:-translate-x-3" : "lg:translate-x-0"
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
          </Link>
        </div>
      </div>
    </header>
  );
}
