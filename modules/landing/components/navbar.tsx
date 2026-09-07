import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 overflow-hidden border-b border-dashed border-black/8 backdrop-blur-sm">
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative flex h-16 items-center justify-between px-18">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/images/logo-mark.svg" alt="Replay" width={25} height={25} priority />
          <span className="font-serif text-xl leading-none text-[#464646]">Replay</span>
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
          className="flex items-center border border-ink bg-ink px-5 py-3 font-serif text-xs uppercase tracking-wide text-white"
        >
          Value my data
        </a>
      </div>
    </header>
  );
}
