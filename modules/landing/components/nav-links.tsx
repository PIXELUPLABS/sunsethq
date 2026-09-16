import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";

type NavLinksProps = {
  /** Prefixes section anchors so pages other than home can point back at it. */
  linkBase: string;
  className: string;
  /** Visually hidden (e.g. mid fade-transition) - drops links out of tab order. */
  hidden?: boolean;
};

export function NavLinks({ linkBase, className, hidden }: NavLinksProps) {
  return (
    <nav aria-hidden={hidden} className={className}>
      {NAV_LINKS.map((link) =>
        link.isRoute ? (
          <Link
            key={link.label}
            href={link.href}
            tabIndex={hidden ? -1 : undefined}
            className="text-sm tracking-tight text-[#777] transition-colors hover:text-[#141518]"
          >
            {link.label}
          </Link>
        ) : (
          <a
            key={link.label}
            href={`${linkBase}${link.href}`}
            tabIndex={hidden ? -1 : undefined}
            className="text-sm tracking-tight text-[#777] transition-colors hover:text-[#141518]"
          >
            {link.label}
          </a>
        ),
      )}
    </nav>
  );
}
