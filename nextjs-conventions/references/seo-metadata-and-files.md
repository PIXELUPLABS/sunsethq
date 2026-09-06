# SEO: Metadata & Essential Files

App Router SEO relies on a handful of well-known files/exports. Use the
Metadata API exclusively — never mix in `next-seo` in the App Router, and
never mix a static `metadata` export with `generateMetadata` in the same
route segment (pick one).

## `app/layout.tsx` — Root Metadata

```typescript
import type { Metadata, Viewport } from 'next';

// Viewport must be a separate export — `themeColor`, `colorScheme`, and
// `viewport` inside the `metadata` object are not supported.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://your-site.com'), // required for relative URLs to resolve
  title: {
    default: 'Site Title - Main Keyword',
    template: '%s | Site Name',
  },
  // ~150-160 chars is a guideline, not a limit — Google truncates per device/query
  description: 'Compelling description with target keywords',
  // No `keywords` field: Google ignores the keywords meta tag entirely — pure noise
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-site.com',
    siteName: 'Site Name',
    title: 'Site Title',
    description: 'Description for social sharing',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Site preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Site Title',
    description: 'Description for Twitter',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

## `app/sitemap.ts` — Dynamic Sitemap

```typescript
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-site.com';
  const posts = await getPosts(); // your CMS/DB

  return [
    {
      url: baseUrl,
      images: [`${baseUrl}/og-image.png`], // Image Sitemap entry
    },
    { url: `${baseUrl}/about` },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt, // real content timestamp
    })),
  ];
}
```

`lastModified` must reflect the content's actual last change (CMS `updatedAt`,
file mtime, git commit date) — Google only trusts `lastmod` when it's
consistently accurate; stamping `new Date()` on every build teaches Google to
ignore the field entirely. Skip `changeFrequency` and `priority` — Google
ignores both.

## `app/robots.ts` — Robots Configuration

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://your-site.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
        // Do NOT disallow /_next/ — crawlers need render-critical CSS/JS
        // Do NOT add bot-specific rules (Googlebot, Bingbot) unless overriding wildcard —
        // and if you do, repeat all disallows: named groups don't inherit `*` rules (RFC 9309)
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

`host` is intentionally omitted — it's a non-standard directive Google
ignores. Use canonical URLs / 301s to declare the preferred host instead.

## `app/manifest.ts` — Web App Manifest

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Site Name',
    short_name: 'Site',
    description: 'Site description',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

Same `MetadataRoute` family as sitemap/robots; place at the root of `app/`.
**Not an SEO requirement** — a PWA-completeness nicety with no ranking
effect; skip it unless the site is (or may become) a PWA. (A static
`app/manifest.json` works too.)

## OG / Twitter Images

Three ways to set social images — prefer the file conventions over
hand-syncing URLs in the metadata object:

1. **External URL in metadata** (the `openGraph.images` / `twitter.images`
   examples above) — fine for externally hosted images.
2. **Static file convention (recommended default):** drop
   `opengraph-image.(png|jpg|gif)` and/or `twitter-image.*` into a route
   segment (`app/opengraph-image.png` for the root,
   `app/blog/opengraph-image.png` for `/blog`). Next.js auto-emits
   `og:image`/`twitter:image` + `:type/:width/:height`. A deeper, more
   specific image overrides one above it. Add alt text with a sibling
   `opengraph-image.alt.txt`. Build fails if the file exceeds 8 MB (OG) /
   5 MB (Twitter).
3. **Dynamic generation with `ImageResponse`** (per-page/per-post images):

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const alt = 'Post preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;            // params is a Promise in v16
  const post = await getPost(slug);
  return new ImageResponse(
    <div style={{ display: 'flex', fontSize: 64, width: '100%', height: '100%' }}>{post.title}</div>,
    { ...size },
  );
}
```

`ImageResponse` renders via Satori — **flexbox only, no `display: grid`**.
These files are statically optimized at build time unless they read
request-time data.

## Quick Fixes

### Add noindex to a page

```typescript
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```

### Dynamic metadata per page

```typescript
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;            // params is a Promise in current Next.js
  const product = await getProduct(id);
  return {
    title: product.name,
    description: product.description,
  };
}
```

### Canonical for dynamic routes

```typescript
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}
```
