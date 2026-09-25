import manifest from "./image-manifest.json";

const images = manifest as Record<string, { key: string; widths: number[]; format?: "avif" }>;

export default function staticImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const image = images[decodeURI(src)];
  if (!image) return src;
  const size = image.widths.find((candidate) => candidate >= width) ?? image.widths[image.widths.length - 1];
  return `/generated-images/${image.key}-${size}.${image.format ?? "webp"}`;
}
