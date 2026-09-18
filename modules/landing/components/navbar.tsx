"use client";

import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { usePageScrolled } from "../hooks/use-page-scrolled";

export function Navbar({ linkBase = "" }: { linkBase?: string }) {
  const { scrolled } = usePageScrolled();

  return (
    <header
      className={`fixed top-0 left-0 z-20 w-full overflow-hidden border-b border-dashed border-[#dedede] transition-[border-color,translate] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        scrolled ? "lg:translate-y-4 lg:border-transparent" : "lg:translate-y-0"
      }`}
    >
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

      <div className="pointer-events-none absolute inset-0 hidden px-6 sm:px-18 lg:block min-[1800px]:px-0!">
        <div className="relative mx-auto h-full max-w-[1560px]">
          <div
            className={`absolute inset-y-0 right-0 w-full border border-[#A8A8A8] bg-cover bg-right transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: "url(/images/grain-light-texture.svg)" }}
          />

          <div
            className={`absolute inset-y-0 left-0 w-full border border-[#A8A8A8] bg-cover bg-left transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: "url(/images/grain-light-texture.svg)" }}
          />
        </div>
      </div>

      <div className="relative mx-auto flex h-16 w-full max-w-[1560px] items-center justify-between px-6 sm:px-18 min-[1560px]:max-[1704px]:pr-[calc(852px_-_50vw)]! min-[1704px]:max-[1800px]:pr-0! min-[1800px]:px-0!">
        <Link
          href="/"
          className={`relative z-10 flex items-center transition-transform duration-500 ${
            scrolled ? "lg:translate-x-3" : "lg:translate-x-0"
          }`}
        >
          {/* The mark occupies the first ~20px of the 111px logo; clipping the
              wrapper to 22px on scroll hides the wordmark and keeps the mark
              exactly where it was. */}
          <span
            className={`block overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              scrolled ? "w-[111px] lg:w-[22px]" : "w-[111px]"
            }`}
          >
            <Image
              src="/images/sunset-logo.svg"
              alt="Replay"
              width={111}
              height={36}
              priority
              className="max-w-none"
            />
          </span>
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
