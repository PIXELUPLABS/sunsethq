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
    <div className="md:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        className="flex size-9 items-center justify-center px-1.5 py-px"
      >
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

      <div
        id="mobile-nav-panel"
        className={`fixed inset-x-0 top-16 bottom-0 z-10 flex flex-col overflow-hidden border-t border-dashed border-black/8 bg-[#fcfcfc] transition-[opacity,visibility] motion-reduce:transition-none ${
          isOpen
            ? "visible opacity-100 duration-300 ease-out"
            : "invisible opacity-0 duration-200 ease-in"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            backgroundImage: `url("${GRAIN_TILE}")`,
            backgroundSize: "259px 259px",
            backgroundPosition: "left top",
          }}
        />

        <div
          className={`relative flex min-h-0 flex-1 flex-col justify-between gap-10 overflow-y-auto overscroll-contain p-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
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

          <Link
            href="/value-my-data"
            onClick={close}
            className="cta-type flex h-13 min-h-12 shrink-0 items-center justify-center border border-[#141518] bg-[#141518] px-[22px] text-base leading-3 text-white"
          >
            Value my data
          </Link>
        </div>

        <NavColorStrip />
      </div>
    </div>
  );
}
