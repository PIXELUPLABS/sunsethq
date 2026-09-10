import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";

export function Navbar() {
  return (
    <header className="fixed top-0 left-1/2 z-20 w-full max-w-[1560px] -translate-x-1/2 overflow-hidden border-b border-dashed border-black/8 backdrop-blur-sm">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative flex h-16 items-center justify-between px-18">
        <Link href="/" className="flex items-center">
          <Image src="/images/sunset-logo.svg" alt="Replay" width={111} height={36} priority />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-tight text-[#777] transition-colors hover:text-[#141518]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#value-my-data"
          className="group relative flex items-center overflow-hidden bg-[#141518] px-5 py-3 font-serif text-xs uppercase tracking-wide text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
          </div>
          <span className="relative">Value my data</span>
        </a>
      </div>
    </header>
  );
}
