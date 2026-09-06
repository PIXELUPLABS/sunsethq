# Images: Optimization

Always use `next/image` for any image rendering, and prefer modern
compressed formats.

## Rules

- **Never use a raw `<img>` tag.** Always import and use `Image` from
  `next/image`.
- **Prefer `.webp` or `.avif` source files** over `.jpg`/`.png` for any new
  image assets. If only a `.jpg`/`.png` is available, convert it, or let
  `next/image`'s automatic optimization handle format negotiation — but the
  source asset should still be webp/avif where you control it.
- Always set `width`/`height` (or use `fill` with a sized/positioned parent)
  to avoid layout shift.
- Use `priority` only for above-the-fold/LCP images (e.g. hero image); don't
  mark every image priority.
- Provide meaningful `alt` text — never leave it empty unless the image is
  purely decorative (`alt=""`).
- For remote images, configure allowed domains in `next.config.js`
  (`images.remotePatterns`) rather than disabling optimization.

## Example

```tsx
import Image from "next/image";
import heroImage from "@/public/hero.webp";

export function HeroBanner() {
  return (
    <Image
      src={heroImage}
      alt="Product dashboard overview"
      priority
      className="rounded-lg"
    />
  );
}
```
