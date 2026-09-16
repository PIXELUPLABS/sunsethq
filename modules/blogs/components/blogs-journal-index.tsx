"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { HERO_BAR_NOISE } from "@/modules/landing/lib/hero-assets";
import { BLOG_CATEGORIES, BLOG_POSTS, BLOGS_INDEX_BODY, BLOGS_INDEX_HEADLINE, BLOGS_INDEX_TAG } from "../lib/constants";

/** The small multi-colour accent strip down the left edge of the active
 *  filter tab (Figma node 6672:16956, drawn there under "All" only since
 *  Figma's own mockup is static) - the same colored-segment + soft-light
 *  noise technique `ProcessBar` uses elsewhere on the site, just vertical
 *  and with its own one-off palette, so it's hand-built here rather than
 *  bent into that horizontal, fixed-palette component. Segment heights are
 *  Figma's own raw pixel values, kept only as relative `flex-grow` weights
 *  (their instance's absolute height doesn't carry over to this tab's own,
 *  shorter height). Now that the tabs are clickable, it tracks whichever
 *  one is active rather than staying pinned to the first. */
const ACTIVE_TAB_ACCENT = [
  { color: "#499df8", weight: 268.357 },
  { color: "#54702f", weight: 157.346 },
  { color: "#7e7e7e", weight: 253.878 },
  { color: "#349be7", weight: 37.647 },
  { color: "#54702f", weight: 157.346 },
  { color: "#eae058", weight: 23.168 },
];

const PROGRESS_SEGMENTS = 5;

// Matches `DeidentificationTabs`' own slide (home page, de-identification
// tab switch) exactly - same easing, same duration - since this is that
// same "active tab" black-bar-slide pattern, just measured in pixels
// (`offsetLeft`/`offsetWidth`) rather than assumed as an even percentage
// split: that component always has exactly 3 equal-width tabs, but this
// row's 7 tabs render at their own natural content widths on narrow
// screens (`overflow-x-auto`, no `shrink-0`), so a fixed `100 / count`%
// wouldn't track the real tab boundaries there.
const SLIDE_EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
const SLIDE_DURATION_MS = 220;

/**
 * The Blogs page's post index (Figma node 6672:16944) - a filter row over
 * a dashed-rule ledger of entries, pixel-matched at `lg:` since Figma gives
 * no mobile spec; mobile falls back to a single-column stack of the same
 * rows with this site's own established smaller type scale.
 */
export function BlogsJournalIndex() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Measures the active button's own box rather than assuming an even
  // `100 / BLOG_CATEGORIES.length`% split - see this file's own note above
  // `SLIDE_EASE_IN_OUT` for why that assumption doesn't hold here.
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeIndex];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-[#eaebf1] px-3 sm:px-18 lg:px-18">
      {/* Same grain-texture-over-`#eaebf1` treatment as the careers page's
          "Every role, in full, right here" section (open-roles-section.tsx)
          - a tiled background-image (not `next/image` `fill`) with
          `mix-blend-multiply`, per that file's own comment, rather than a
          flat fill. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat bg-[length:100%_auto] mix-blend-multiply"
      />

      <div className="relative flex w-full max-w-[1560px] flex-col gap-12 border-x border-dashed border-[#d4d4d4] px-4 py-14 lg:gap-20 lg:px-5 lg:py-20">
        <div className="flex flex-col items-start gap-3 lg:w-[700px] lg:gap-[18px]">
          <div className="border border-dashed border-[#a8a8a8] px-2.5 py-1.5">
            <p className="font-mono text-[9px] text-black uppercase">{BLOGS_INDEX_TAG}</p>
          </div>
          <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black lg:text-[44px] lg:tracking-[-1.76px]">
            {BLOGS_INDEX_HEADLINE}
          </h2>
          <p className="max-w-[444px] text-[14.5px] leading-[1.45] text-[#727272] sm:text-[15px] sm:leading-[1.5]">
            {BLOGS_INDEX_BODY}
          </p>
        </div>

        <div className="flex flex-col items-start gap-5 lg:gap-5">
          {/* Filter row - clickable, with the same black-bar slide the home
              page's de-identification tab switch uses (`deidentification-tabs.tsx`).
              Horizontally scrollable below `lg:`, since 7 tabs can't fit a
              phone width without wrapping oddly - filtering `BLOG_POSTS` by
              category isn't wired up yet (only 5 of the 10 posts Figma
              counts exist as real entries), so this only swaps the active
              visual state for now. */}
          {/* `overflow-x-auto` keeps the row scrollable on narrow screens
              (7 tabs don't fit a phone width) - `no-scrollbar` (styled-jsx
              below, since the equivalent Tailwind arbitrary-property
              classes silently failed to compile here) only hides the
              scrollbar chrome itself, cross-browser, since this row's own
              dashed/solid tab borders already communicate "more content"
              without needing a visible scrollbar too. */}
          <div className="no-scrollbar relative flex w-full items-start overflow-x-auto">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden bg-black"
              style={{
                width: indicator.width,
                transform: `translate3d(${indicator.left}px, 0, 0)`,
                willChange: "transform",
                backfaceVisibility: "hidden",
                transitionProperty: "transform, width",
                transitionDuration: `${SLIDE_DURATION_MS}ms`,
                transitionTimingFunction: SLIDE_EASE_IN_OUT,
              }}
            >
              <div className="absolute inset-y-0 left-0 flex w-1 flex-col overflow-hidden">
                {ACTIVE_TAB_ACCENT.map((segment, segmentIndex) => (
                  <div
                    key={segmentIndex}
                    className="relative w-full"
                    style={{ flexGrow: segment.weight, backgroundColor: segment.color }}
                  >
                    <div
                      className="absolute inset-0 mix-blend-soft-light"
                      style={{
                        backgroundImage: `url(${HERO_BAR_NOISE})`,
                        backgroundSize: "30.24px 720px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {BLOG_CATEGORIES.map((category, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={category.label}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={active}
                  className={`relative flex flex-1 shrink-0 cursor-pointer flex-col items-center justify-center gap-6 overflow-hidden border-y border-r border-[#ccc] px-6 py-3 ${
                    index === 0 ? "border-l" : ""
                  }`}
                  style={{ transition: `color ${SLIDE_DURATION_MS}ms ease` }}
                >
                  <p
                    className={`relative font-serif text-base leading-none tracking-[-0.64px] whitespace-nowrap ${
                      active ? "text-[#f2f2f2]" : "text-[#010101]"
                    }`}
                  >
                    {category.label} ({category.count})
                  </p>
                </button>
              );
            })}
          </div>

          {/* Ledger. */}
          <div className="flex w-full flex-col items-start">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.index}
                className="flex w-full flex-col gap-3 border-t border-dashed border-[#a8a8a8] py-6 lg:min-h-[184px] lg:flex-row lg:items-start lg:gap-7"
              >
                <p className="font-mono text-xs leading-none text-[#898989] uppercase lg:w-[90px]">
                  [{post.index}]
                </p>

                <div className="flex flex-col items-start gap-2.5 lg:w-[150px] lg:gap-2.5">
                  <p className="text-xs leading-none font-medium text-black uppercase">
                    {post.category}
                  </p>
                  <div className="flex items-start gap-[3px]">
                    {Array.from({ length: PROGRESS_SEGMENTS }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1 w-4"
                        style={{ backgroundColor: i < post.progress ? "#499df8" : "#b8bac2" }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start gap-3 text-black lg:gap-3">
                  <p className="font-serif text-2xl leading-none tracking-[-1.28px] lg:text-[32px]">
                    {post.headline}
                  </p>
                  <p className="text-sm leading-[1.4] tracking-[-0.42px] text-black/60 lg:text-base lg:tracking-[-0.48px]">
                    {post.body}
                  </p>
                </div>

                <p className="font-mono text-xs leading-none text-[#898989] uppercase lg:w-[170px] lg:text-right">
                  {post.date} &middot; {post.readTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
