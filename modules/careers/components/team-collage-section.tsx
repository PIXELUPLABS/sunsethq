"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useTeamCollageTilt } from "../hooks/use-team-collage-tilt";
import { TEAM_COLLAGE_BODY, TEAM_COLLAGE_EYEBROW, TEAM_COLLAGE_TITLE } from "../lib/constants";
import { TEAM_COLLAGE_CONTAINER_ASPECT, TEAM_COLLAGE_PHOTOS } from "../lib/team-collage-items";

const CONTAINER_MAX_WIDTH_PX = 1560;

const STAGGER_MS_PER_PHOTO = 50;
const ENTER_ANIMATION_MS = 400;

export function TeamCollageSection() {
  const { activeId, registerPhoto, handlePointerEnter, handlePointerMove, handlePointerLeave } =
    useTeamCollageTilt();
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18">
      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4] pb-16 sm:pb-20">
        <div className="px-3 pt-16 sm:px-10 sm:pt-20">
          <div className="flex max-w-[560px] flex-col items-start gap-6">
            <SectionTag
              label={TEAM_COLLAGE_EYEBROW}
              textClassName="text-black/60"
              borderClassName="border-dashed border-black/25"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
            />
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
                {TEAM_COLLAGE_TITLE}
              </h2>
              <p className="max-w-[480px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
                {TEAM_COLLAGE_BODY}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-y border-dashed border-[#d4d4d4] py-10 sm:mt-14 sm:py-14">
          <div
            ref={inViewRef}
            className="relative w-full"
            style={{
              aspectRatio: TEAM_COLLAGE_CONTAINER_ASPECT,
              containerType: "inline-size",
              perspective: "1200px",
            }}
          >
            {TEAM_COLLAGE_PHOTOS.map((photo, index) => (
              <div
                key={photo.id}
                ref={registerPhoto(photo.id)}
                onMouseEnter={() => handlePointerEnter(photo.id)}
                onMouseMove={handlePointerMove(photo.id)}
                onMouseLeave={() => handlePointerLeave(photo.id)}
                className="team-collage-photo absolute overflow-hidden border border-[#d4d4d4] bg-[#e7e7e2] will-change-transform"
                style={
                  {
                    left: `${photo.leftCqw}cqw`,
                    top: `${photo.topCqw}cqw`,
                    width: `${photo.widthCqw}cqw`,
                    height: `${photo.heightCqw}cqw`,
                    zIndex: activeId === photo.id ? 50 : photo.baseZ,
                    "--base-rotate": `${photo.rotationDeg}deg`,
                    opacity: inView ? undefined : 0,
                    animation: inView
                      ? `team-collage-enter ${ENTER_ANIMATION_MS}ms var(--ease-snap) ${
                          index * STAGGER_MS_PER_PHOTO
                        }ms both`
                      : undefined,
                  } as CSSProperties
                }
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={`(max-width: ${CONTAINER_MAX_WIDTH_PX}px) ${photo.widthCqw}vw, ${Math.round(
                    (photo.widthCqw / 100) * CONTAINER_MAX_WIDTH_PX,
                  )}px`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
