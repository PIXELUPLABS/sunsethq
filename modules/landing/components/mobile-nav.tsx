"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";
import { useDisclosure } from "../hooks/use-disclosure";
import { NavColorStrip } from "./nav-color-strip";

const MENU_ICON = "/images/menu-line.svg";
const CLOSE_ICON = "/images/menu-close-line.svg";
const GRAIN_TILE = "/images/texture-grain-light.png";

export function MobileNav({ linkBase = "" }: { linkBase?: string }) {
  const { isOpen, close, toggle } = useDisclosure();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        className="flex size-9 items-center justify-center px-1.5 py-px"
      >
        {/* Both icons stay mounted and crossfade, so the button reads as one
            control changing state rather than two icons. */}
        <span className="relative block size-5">
          <Image
            src={MENU_ICON}
            alt=""
            width={20}
            height={20}
            className={`absolute inset-0 size-5 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={CLOSE_ICON}
            alt=""
            width={20}
            height={20}
            className={`absolute inset-0 size-5 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
      </button>

      {/* The panel fills the viewport below the 64px header bar: links at the
          top, the CTA pushed to the bottom, the colour bar under both.
          It stays mounted so it can fade, and rides on visibility rather than
          `hidden` - visibility is transitionable, and still keeps the closed
          panel out of the tab order and off the a11y tree. */}
      <div
        id="mobile-nav-panel"
        className={`fixed inset-x-0 top-16 bottom-0 z-10 flex flex-col overflow-hidden border-t border-dashed border-black/8 bg-[#fcfcfc] transition-[opacity,visibility] motion-reduce:transition-none ${
          isOpen
            ? "visible opacity-100 duration-300 ease-out"
            : "invisible opacity-0 duration-200 ease-in"
        }`}
      >
        {/* The design's grain is a 259px tile, not a stretched sheet, so it
            keeps its own scale however tall the panel gets. The tile's own
            alpha already carries the design's 11% - dialling the layer down as
            well would double it away to nothing. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            backgroundImage: `url("${GRAIN_TILE}")`,
            backgroundSize: "259px 259px",
            backgroundPosition: "left top",
          }}
        />

        {/* overscroll-contain keeps a flick at the end of the panel from
            handing the scroll back to the page underneath. The content settles
            down into place while the panel fades, leaving the ground and the
            colour bar still. */}
        <div
          className={`relative flex min-h-0 flex-1 flex-col justify-between gap-10 overflow-y-auto overscroll-contain p-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {/* A dashed rule sits between links, taking the 20px gap on either
              side of it the way the design's zero-height divider does. */}
          <nav aria-label="Main" className="flex flex-col gap-5">
            {NAV_LINKS.map((link, index) => (
              <Fragment key={link.label}>
                {index > 0 && (
                  <span
                    aria-hidden
                    className="block border-t border-dashed border-black/20"
                  />
                )}
                {link.isRoute ? (
                  <Link
                    href={link.href}
                    onClick={close}
                    className="font-serif text-[20px] leading-[1.04] tracking-[-1px] text-black"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={`${linkBase}${link.href}`}
                    onClick={close}
                    className="font-serif text-[20px] leading-[1.04] tracking-[-1px] text-black"
                  >
                    {link.label}
                  </a>
                )}
              </Fragment>
            ))}
          </nav>

          <a
            href={`${linkBase}#value-my-data`}
            onClick={close}
            className="flex h-13 min-h-12 shrink-0 items-center justify-center border border-[#141518] bg-[#141518] px-[22px] font-serif text-base leading-3 tracking-[0.1px] text-white uppercase"
          >
            Value my data
          </a>
        </div>

        <NavColorStrip />
      </div>
    </div>
  );
}
