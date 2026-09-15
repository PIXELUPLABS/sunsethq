import type { CollagePhoto } from "../types";

/**
 * Editorial composition, not a scrapbook pile - a wide horizontal
 * arrangement of team/culture photos above the open-roles section, sized
 * to match this page's own tone (see the two earlier passes below for
 * what didn't work). All four position/size fields are expressed as a
 * percentage of the container's own *width* - see `team-collage-section.tsx`,
 * which locks the container to a fixed aspect ratio and sizes it with CSS
 * container query units, so a value defined against width alone still
 * lands in the right spot at any viewport width.
 *
 * Every `widthCqw`/`heightCqw` pair matches its photo's real aspect ratio
 * exactly (portrait photos at 828x1104 = 3:4, landscape at 828x621 = 4:3 -
 * see `public/images/careers/team-photo-*.webp`) so `object-cover` in
 * `team-collage-section.tsx` never has to crop into a face to fill the
 * box, and never leaves letterboxing either. Reflow this pairing together
 * with `TEAM_COLLAGE_CONTAINER_ASPECT` below if a photo is ever swapped
 * for one with a different ratio.
 *
 * Four passes to get here:
 * - v1: photos placed *near* each other with ~0 actual overlap - read as
 *   a loose scatter.
 * - v2: overcorrected with overlaps up to ~20cqw deep - read as
 *   cluttered, and let the mouse cross several stacked photos before
 *   reaching one further into the pile (a real hover bug, not just a
 *   look - see `team-collage-section.tsx`'s history).
 * - v3: the piled-photos idea itself was the mismatch, not its tuning -
 *   this page reads clean and editorial everywhere else. Rebuilt around
 *   one clear hierarchy - `rooftop-dinner` as a single large anchor, two
 *   medium landscape photos, five smaller supporting ones - mostly
 *   straight (`rotationDeg: 0`) with only three photos carrying a
 *   barely-there ±1.5° tilt. The rotation/shadow that used to do the
 *   "playful" work at rest is gone too - see `.team-collage-photo` in
 *   `globals.css`, which holds one flat resting shadow instead of a
 *   per-photo elevation scale. That job belongs to the hover interaction
 *   alone now (`use-team-collage-tilt.ts`), not the static layout.
 * - v4: v3's hierarchy and sizes were right, but its gaps between the
 *   four loose clusters (top-left pair, the anchor, the isolated
 *   top-right accent, the bottom pair) were wide enough that it read as
 *   separate floating groups rather than one collage - especially at
 *   narrower viewports. Same photos, same sizes, same rotation - just
 *   pulled in: every photo now touches or lightly overlaps (commonly
 *   16-32px at the container's *then* 1560px width, i.e. roughly 1-2cqw)
 *   at least one neighbor, closing the specific gaps that read as dead
 *   space (`sunset-photo`/`elevator-group` were the furthest out, now
 *   pulled in to graze the anchor's corner instead of floating near the
 *   edge; `office-dog`/`couch-with-dog` moved up to close the gap under
 *   `skyline-dinner`/the anchor). Overall footprint (bounding box) is
 *   roughly 19% narrower and 19% shorter than v3 - about a third less
 *   area - without any photo losing more than ~half its area to overlap,
 *   so nothing reads as buried the way v2's pile did.
 * - v5 (this one): the container itself moved from 1560px down to 1100px
 *   (`team-collage-section.tsx`'s `CONTAINER_MAX_WIDTH_PX`) to match
 *   `<OpenRolesSection>`'s actual content width instead of its outer
 *   frame - the two sections read as different widths stacked directly
 *   on top of each other otherwise. Every position/size value below is
 *   still in `cqw` (a percentage of the container's own width), so
 *   nothing here needed to change - the same composition just renders
 *   ~30% smaller in absolute pixels, proportionally identical.
 */
export const TEAM_COLLAGE_PHOTOS: CollagePhoto[] = [
  {
    id: "office-lunch",
    src: "/images/careers/team-photo-1.webp",
    alt: "Teammates sharing a meal around the table in the office",
    leftCqw: 10,
    topCqw: 3,
    widthCqw: 14,
    heightCqw: 18.67,
    rotationDeg: -1.5,
    baseZ: 4,
  },
  {
    id: "work-session",
    src: "/images/careers/team-photo-4.webp",
    alt: "Teammates gathered around a table during a work session",
    leftCqw: 23,
    topCqw: 1,
    widthCqw: 27,
    heightCqw: 20.25,
    rotationDeg: 0,
    baseZ: 2,
  },
  {
    id: "sunset-photo",
    src: "/images/careers/team-photo-2.webp",
    alt: "Teammates photographing a sunset over the skyline from the office",
    leftCqw: 78,
    topCqw: 8,
    widthCqw: 13,
    heightCqw: 17.33,
    rotationDeg: 1.5,
    // Pulled in to graze the anchor's top-right corner (~4cqw overlap)
    // instead of floating out near the container edge, per review - it
    // still keeps clear negative space above/right of it, just not the
    // wide gap back to the rest of the collage it had before.
    baseZ: 5,
  },
  {
    id: "skyline-dinner",
    src: "/images/careers/team-photo-7.webp",
    alt: "Three teammates at dinner with the city skyline lit up at night",
    leftCqw: 10,
    topCqw: 20,
    widthCqw: 24,
    heightCqw: 18,
    rotationDeg: 0,
    baseZ: 3,
  },
  {
    id: "rooftop-dinner",
    src: "/images/careers/team-photo-3.webp",
    alt: "The team having dinner together at a rooftop restaurant",
    leftCqw: 46,
    topCqw: 14,
    widthCqw: 36,
    heightCqw: 27,
    rotationDeg: 0,
    // The one large anchor - everything else is sized and placed around
    // it, never the other way around.
    baseZ: 1,
  },
  {
    id: "elevator-group",
    src: "/images/careers/team-photo-6.webp",
    alt: "The team crowded together for a group photo in an elevator",
    leftCqw: 78,
    topCqw: 34,
    widthCqw: 13,
    heightCqw: 17.33,
    rotationDeg: 0,
    baseZ: 6,
  },
  {
    id: "office-dog",
    src: "/images/careers/team-photo-8.webp",
    alt: "The office dog dressed up in a bandana and hair bow",
    leftCqw: 16,
    topCqw: 34,
    widthCqw: 14,
    heightCqw: 18.67,
    rotationDeg: -1,
    baseZ: 8,
  },
  {
    id: "couch-with-dog",
    src: "/images/careers/team-photo-5.webp",
    alt: "Two teammates working on the office couch with a dog",
    leftCqw: 35,
    topCqw: 33,
    widthCqw: 25,
    heightCqw: 18.75,
    rotationDeg: 0,
    baseZ: 7,
  },
];

/** Tailwind `aspect-[...]` value for the collage container - tall enough
 * to fit every photo above at its `topCqw + heightCqw`, in the same
 * width-relative units (see the note on those two fields). Recompute if
 * the layout above changes: the tallest photo currently bottoms out at
 * ~52.7 (office-dog), so 1100 (=55 of 2000) leaves a small margin rather
 * than clipping it exactly at the edge - shorter than v3's 1320 because
 * this pass pulled everything closer together, not because anything
 * shrank. */
export const TEAM_COLLAGE_CONTAINER_ASPECT = "2000/1100";
