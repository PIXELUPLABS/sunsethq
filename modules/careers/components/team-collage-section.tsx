"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useTeamCollageTilt } from "../hooks/use-team-collage-tilt";
import { TEAM_COLLAGE_BODY, TEAM_COLLAGE_EYEBROW, TEAM_COLLAGE_TITLE } from "../lib/constants";
import { TEAM_COLLAGE_CONTAINER_ASPECT, TEAM_COLLAGE_PHOTOS } from "../lib/team-collage-items";

/** The photo panel's own effective width: the full `max-w-[1560px]` frame,
 * no horizontal padding (per review, the panel runs edge-to-edge to its
 * own `border-y` lines rather than sitting inset like the heading text
 * above it - see the comment on that panel below). Used only for
 * `next/image`'s `sizes` hint; the actual layout comes from the JSX
 * structure itself, not this constant. */
const CONTAINER_MAX_WIDTH_PX = 1560;

/** Stagger delay between adjacent photos' scroll-in fade, matching
 * `values-section.tsx`'s own per-card stagger below this section. An
 * `animation-delay`, not a `transition-delay` - see the note on
 * `.team-collage-photo` in `globals.css` for why that distinction is the
 * whole reason this fade doesn't fight the hover interaction below. */
const STAGGER_MS_PER_PHOTO = 50;
const ENTER_ANIMATION_MS = 400;

/**
 * Editorial photo composition, above `<OpenRolesSection>`: one large
 * anchor photo, two medium, five smaller - see `CollagePhoto` in
 * `../types.ts` and `TEAM_COLLAGE_PHOTOS` for the hand-composed
 * position/size/rotation/stacking of each one. Deliberately not a
 * scrapbook pile: most photos sit straight (`rotationDeg: 0`), touches
 * between neighbors are light (a handful of cqw, sometimes just an
 * adjacent gap), and the resting shadow in `.team-collage-photo`
 * (`globals.css`) is one flat, barely-there value rather than scaled per
 * photo - see `team-collage-items.ts` for the fuller history of why an
 * earlier, more overlapped/rotated version read as disconnected from the
 * rest of this page's clean, structured tone.
 *
 * The container is locked to the layout's own aspect ratio
 * (`TEAM_COLLAGE_CONTAINER_ASPECT`) and sized with CSS container query
 * units (`cqw`, matching `revenue-stream-shelf.tsx`'s existing use of the
 * same technique) so every photo's position/size scales as one fixed
 * composition at any viewport width - never a layout shift, never a
 * per-breakpoint recomputation.
 *
 * A one-time scroll-in fade (same `useInView` hook `values-section.tsx`
 * uses below this section) is staggered via `animation-delay`, kept
 * deliberately separate from the hover interaction's `transition` - see
 * `.team-collage-photo` in `globals.css` for why sharing one was a real
 * bug, not just a style preference.
 *
 * Hover interaction (raise to front, pointer-follow tilt, lift, soft
 * shadow) lives in `useTeamCollageTilt` - see that hook for why it writes
 * straight to each photo's `style` instead of going through React state.
 * It's the one place this composition gets playful - everything else
 * about the resting layout is calm on purpose.
 *
 * The eyebrow/title/body block above the photos follows the same
 * `SectionTag` + serif `h2` + muted `p` pattern every other section on
 * this page uses (`careers-hero.tsx`, `open-roles-section.tsx`) and sits
 * in the same `px-3 sm:px-10` inset as `<WhyReplaySection>`'s own heading,
 * so its margins land identically to that section and to
 * `<OpenRolesSection>` below.
 *
 * The photo panel itself is a distinct bordered block, not padded inline
 * with the heading: `border-y border-dashed border-[#d4d4d4]` top and
 * bottom, no horizontal padding of its own, so the photos run edge-to-edge
 * to the outer frame's `border-x` instead of sitting inset like the
 * heading - per review, this reads as a structured, framed module rather
 * than photos loosely floating in the same padded column as the text.
 */
export function TeamCollageSection() {
  const { activeId, registerPhoto, handlePointerEnter, handlePointerMove, handlePointerLeave } =
    useTeamCollageTilt();
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18">
      {/* Vertical-only continuation of the `max-w-[1560px]` frame chain
          (`why-replay-section.tsx` above, `open-roles-section.tsx` below) -
          this section previously sat undrawn between the two, breaking the
          frame's left/right edges as they run down the page. No top/bottom
          border: `<WhyReplaySection>` and `<OpenRolesSection>` already close
          their own top/bottom edges, so adding this section's own would
          double the horizontal line at each seam. `#d4d4d4`, matching the
          main page's own dashed grid lines - both neighbors (and the rest
          of this page's frame chain) use this same color throughout now,
          rather than the page-local `#a8a8a8` this and its neighbors
          briefly diverged to. */}
      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4] pb-16 sm:pb-20">
        <div className="px-3 pt-16 sm:px-10 sm:pt-20">
          <div className="flex max-w-[560px] flex-col items-start gap-6">
            <SectionTag
              label={TEAM_COLLAGE_EYEBROW}
              icon={
                <Image
                  src="/images/careers/values-icons/open_doorway_4x.webp"
                  alt=""
                  width={18}
                  height={18}
                />
              }
            />
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
                {TEAM_COLLAGE_TITLE}
              </h2>
              <p className="max-w-[480px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
                {TEAM_COLLAGE_BODY}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-y border-dashed border-[#d4d4d4] py-10 sm:mt-14 sm:py-14">
          <div
            ref={inViewRef}
            className="relative w-full"
            style={{
              // Not a Tailwind `aspect-[...]` class: it'd have to be a
              // static string for Tailwind's build-time scanner to find,
              // and this comes from the shared `TEAM_COLLAGE_CONTAINER_ASPECT`
              // constant instead (kept next to the layout it measures, in
              // `team-collage-items.ts`). `aspect-ratio` accepts the same
              // "w/h" syntax directly, so no parsing needed here.
              aspectRatio: TEAM_COLLAGE_CONTAINER_ASPECT,
              containerType: "inline-size",
              perspective: "1200px",
            }}
          >
            {TEAM_COLLAGE_PHOTOS.map((photo, index) => (
              <div
                key={photo.id}
                ref={registerPhoto(photo.id)}
                onMouseEnter={() => handlePointerEnter(photo.id)}
                onMouseMove={handlePointerMove(photo.id)}
                onMouseLeave={() => handlePointerLeave(photo.id)}
                className="team-collage-photo absolute overflow-hidden border border-[#d4d4d4] bg-[#e7e7e2] will-change-transform"
                style={
                  {
                    left: `${photo.leftCqw}cqw`,
                    top: `${photo.topCqw}cqw`,
                    width: `${photo.widthCqw}cqw`,
                    height: `${photo.heightCqw}cqw`,
                    zIndex: activeId === photo.id ? 50 : photo.baseZ,
                    "--base-rotate": `${photo.rotationDeg}deg`,
                    // Pure opacity, no inline `opacity` fallback needed:
                    // before `inView`, no animation is applied yet and
                    // this stays at the keyframes' own implicit start
                    // (unanimated - so set explicitly to 0 here); once
                    // triggered, `forwards` holds opacity at 1
                    // permanently, independent of hover.
                    opacity: inView ? undefined : 0,
                    // `both` (not just `forwards`): during its own
                    // staggered delay, a later photo needs the *from*
                    // keyframe (opacity 0) held too, or it'd flash at
                    // full opacity for up to `7 * STAGGER_MS_PER_PHOTO`
                    // before the animation actually starts.
                    animation: inView
                      ? `team-collage-enter ${ENTER_ANIMATION_MS}ms var(--ease-snap) ${
                          index * STAGGER_MS_PER_PHOTO
                        }ms both`
                      : undefined,
                  } as CSSProperties
                }
              >
                {/* `widthCqw` is relative to the container's own
                    max-width (`CONTAINER_MAX_WIDTH_PX`), so the rendered
                    width in px never exceeds
                    `widthCqw / 100 * CONTAINER_MAX_WIDTH_PX` - see
                    `team-collage-items.ts` for why width and height are
                    already sized to the photo's exact aspect ratio (no
                    crop, no letterboxing from `object-cover` here). */}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={`(max-width: ${CONTAINER_MAX_WIDTH_PX}px) ${photo.widthCqw}vw, ${Math.round(
                    (photo.widthCqw / 100) * CONTAINER_MAX_WIDTH_PX,
                  )}px`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
