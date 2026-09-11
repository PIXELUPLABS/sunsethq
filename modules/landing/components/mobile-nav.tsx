"use client";

import Image from "next/image";
import { NAV_LINKS } from "../lib/constants";
import { useDisclosure } from "../hooks/use-disclosure";

export function MobileNav() {
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
        {isOpen ? (
          <svg
            className="size-5 text-[#141518]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.667}
            aria-hidden
          >
            <path d="m4.5 4.5 11 11M15.5 4.5l-11 11" />
          </svg>
        ) : (
          <Image
            src="/images/menu-line.svg"
            alt=""
            width={20}
            height={20}
            className="size-5"
          />
        )}
      </button>

      {/* top-16 sits the panel directly under the 64px header bar. */}
      <div
        id="mobile-nav-panel"
        hidden={!isOpen}
        className="fixed inset-x-0 top-16 z-10 flex max-h-[calc(100vh-64px)] flex-col gap-8 overflow-y-auto border-t border-dashed border-black/8 bg-[#fcfcfc]/97 px-6 pt-8 pb-10 backdrop-blur-md"
      >
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />

        <nav aria-label="Main" className="relative flex flex-col">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={close}
              className="border-b border-dashed border-black/8 py-4 font-serif text-2xl tracking-tight text-[#141518]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#value-my-data"
          onClick={close}
          className="relative flex h-13 items-center justify-center bg-[#141518] font-serif text-xs tracking-[0.1px] text-white uppercase"
        >
          Value my data
        </a>
      </div>
    </div>
  );
}
