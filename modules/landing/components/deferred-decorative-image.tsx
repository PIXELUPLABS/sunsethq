"use client";

import Image, { type ImageProps } from "next/image";
import { useInView } from "../hooks/use-in-view";

const EMPTY_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
type Props = Omit<ImageProps, "src" | "alt" | "preload" | "priority" | "loading"> & { src: string };

// Native lazy images may start ~1250px before the viewport. Large decorative
// SVGs near the second section should not compete with the hero at startup.
// Keep the same Image dimensions/classes in SSR; only its pixels are deferred.
export function DeferredDecorativeImage({ src, ...props }: Props) {
  const { ref, inView } = useInView<HTMLImageElement>({ rootMargin: "400px" });
  return (
    <Image
      {...props}
      ref={ref}
      src={inView ? src : EMPTY_IMAGE}
      alt=""
      loading="eager"
      style={{ ...props.style, aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }}
    />
  );
}
