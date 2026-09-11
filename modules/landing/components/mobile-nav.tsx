"use client";

import Image from "next/image";
import { NAV_LINKS } from "../lib/constants";
import { useDisclosure } from "../hooks/use-disclosure";
import { NavColorStrip } from "./nav-color-strip";

const MENU_ICON = "/images/menu-line.svg";
const CLOSE_ICON = "/images/menu-close-line.svg";
const GRAIN_TILE = "/images/texture-grain-light.png";

export function MobileNav({ linkBase = "" }: { linkBase?: string }) {
  const { isOpen, close, toggle } = useDisclosure();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        className="flex size-9 items-center justify-center px-1.5 py-px"
      >
        <Image
          src={isOpen ? CLOSE_ICON : MENU_ICON}
          alt=""
          width={20}
          height={20}
          className="size-5"
        />
      </button>

      {/* The panel fills the viewport below the 64px header bar: links at the
          top, the CTA pushed to the bottom, the colour bar under both. */}
      <div
        id="mobile-nav-panel"
        hidden={!isOpen}
        className="fixed inset-x-0 top-16 bottom-0 z-10 flex flex-col overflow-hidden border-t border-dashed border-black/8 bg-[#fcfcfc]"
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
            handing the scroll back to the page underneath. */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-between gap-10 overflow-y-auto overscroll-contain p-6">
          <nav aria-label="Main" className="flex flex-col gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={`${linkBase}${link.href}`}
                onClick={close}
                className="font-serif text-[20px] leading-[1.04] tracking-[-1px] text-black"
              >
                {link.label}
              </a>
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
