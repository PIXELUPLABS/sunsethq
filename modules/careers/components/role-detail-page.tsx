import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/modules/landing/components/footer";
import { Navbar } from "@/modules/landing/components/navbar";
import type { Role } from "../types";

type RoleDetailPageProps = {
  role: Role;
};

/**
 * A role's own page - what `RoleRow` on `/careers` now links each row to,
 * instead of expanding the description inline. Same bordered-frame/grain
 * shell every other Careers section uses (`careers-hero.tsx`,
 * `why-replay-section.tsx`), so this reads as part of the same page rather
 * than a different template bolted on.
 *
 * The description/prose classes are copied from what `role-row.tsx` used
 * to render inline - same Ashby `descriptionHtml` field, same restyling of
 * its raw tags, just living here now.
 *
 * Unlike the listing row's deliberately quiet chevron, Apply here is the
 * site's actual primary-button markup (`cta-section.tsx`'s solid fill +
 * color-strip hover), sized up to match the homepage hero's CTA
 * (`hero-section.tsx`) on `lg` - this page has exactly one purpose, so it
 * should read as a real, prominent CTA rather than stay understated the
 * way one row among several needs to.
 *
 * Heading tops out at 56px (the hero headlines' own `sm` size) rather than
 * their full 72px `lg` size - a role title runs longer than "Value my
 * data", so it doesn't get the extra jump those short marketing lines do.
 */
export function RoleDetailPage({ role }: RoleDetailPageProps) {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <section className="relative overflow-hidden bg-[#fcfcfc]">
          {/* `next/image`'s `fill` + `object-cover` (what `careers-hero.tsx`/
              `hero-section.tsx` use) re-fits the texture to the container's
              full *height* - fine for those fixed-shape heroes, but this
              section's height is driven by `role.description`, which can run
              long. A long role blew the grain up to cover that extra height,
              scaling the texture way past its native size. Same fix
              `open-roles-section.tsx` already uses for its own variable-height
              section: `background-size: 100% auto` ties the tile's scale to
              the section's *width* only (matching the width-bound hero
              sections) and repeats it downward instead of rescaling. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat bg-[length:100%_auto]"
          />

          <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-[#d4d4d4]">
            <div className="mx-auto flex w-full max-w-[760px] flex-col items-start gap-10 px-6 pt-[108px] pb-16 lg:px-0 lg:pt-[160px] lg:pb-24">
              <Link
                href="/careers#open-roles"
                className="group flex items-center gap-1.5 font-mono text-xs tracking-wide text-[#727272] uppercase transition-colors duration-200 ease-snap hover:text-black"
              >
                <span
                  aria-hidden
                  className="transition-transform duration-200 ease-snap [@media(hover:hover)]:group-hover:-translate-x-[3px]"
                >
                  &larr;
                </span>
                All open roles
              </Link>

              <div className="flex flex-col items-start gap-5">
                <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black sm:text-[56px] sm:leading-none sm:tracking-tight">
                  {role.title}
                </h1>
                <p className="flex flex-wrap gap-x-3 font-mono text-xs tracking-wide text-[#919191] uppercase">
                  <span>{role.location}</span>
                  <span>{role.employmentType}</span>
                  {role.compensation ? <span>{role.compensation}</span> : null}
                </p>
              </div>

              {/* Same tag restyling `role-row.tsx` used for this field before
                  the description moved here - trusted first-party Ashby
                  content (`descriptionHtml`), not user-submitted.
                  Ashby's editor has no heading level - every section title
                  in the real payload comes through as its own top-level
                  `<p><strong>Title</strong></p>` (a direct child of this
                  div), never a real `<h2>`/`<h3>`, so the `[&_h2]`/`[&_h3]`
                  rules below are a defensive fallback and `>p:has(>strong...)`
                  (direct-child, not `_p`) is what actually matches Ashby's
                  section titles - styled as the page's H2 (20px `font-serif`,
                  i.e. STK Bureau Serif). The direct-child scoping matters:
                  bold lead-in words inside list items (e.g.
                  "**NYC**: you don't live in NY...") are also a lone
                  `<strong>` child of their own `<p>`, just one nested inside
                  `<li>` instead of sitting at the top level - without `>`
                  those picked up the H2 treatment too.
                  Ashby also pads every section with its own empty
                  `<p style="min-height:1.5em"></p>` spacers, which on top of
                  this div's own `[&_p]:mb-3` stacked into a lot of dead
                  space - `:empty` + `hidden` collapses them. */}
              <div
                className="flex w-full flex-col text-sm leading-[1.6] text-[#727272] [&_a]:text-black [&_a]:underline [&_a]:decoration-[#d4d4d4] [&_a]:underline-offset-4 [&_a:hover]:decoration-black [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-[20px] [&_h2]:text-black [&_h2]:first:mt-0 [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-black [&_h3]:first:mt-0 [&_li]:mt-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p:empty]:hidden [&>p:has(>strong:only-child)]:mt-6 [&>p:has(>strong:only-child)]:first:mt-0 [&_strong]:font-medium [&_strong]:text-[#4a4a4a] [&>p:has(>strong:only-child)>strong]:font-serif [&>p:has(>strong:only-child)>strong]:text-[20px] [&>p:has(>strong:only-child)>strong]:font-normal [&>p:has(>strong:only-child)>strong]:text-black [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: role.description }}
              />

              <a
                href={role.applyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-13 w-[300px] max-w-full items-center justify-center overflow-hidden bg-[#141518] transition-transform duration-150 ease-snap active:scale-[0.97] lg:h-auto lg:w-auto lg:px-10 lg:py-6"
              >
                <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-30" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
                  <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
                  <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
                </div>
                <span className="relative font-serif text-xs leading-[0.8] tracking-wide text-white uppercase lg:text-base">
                  Apply
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
