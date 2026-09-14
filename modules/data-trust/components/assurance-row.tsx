import Image from "next/image";
import { JURISDICTION_ICON } from "../lib/assets";
import type { AssuranceRow as AssuranceRowData } from "../types";
import { AssuranceMedia } from "./assurance-media";
import { AssuranceProgress } from "./assurance-progress";

type AssuranceRowProps = {
  row: AssuranceRowData;
  index: number;
  total: number;
};

const HEADING_TRACKING = {
  tight: "lg:leading-none lg:tracking-[-1.28px]",
  open: "lg:leading-[1.1] lg:tracking-[-0.32px]",
} as const;

const BODY_SIZE = {
  sm: "",
  base: "lg:text-base lg:tracking-[-0.48px]",
} as const;

/**
 * One claim: a tag, a heading, the copy, and a plate. The design alternates
 * which side the plate sits on; on mobile every row reads copy-then-plate.
 */
export function AssuranceRow({ row, index, total }: AssuranceRowProps) {
  const mediaFirst = index % 2 === 1;

  return (
    <article
      className={`flex flex-col gap-6 border-[0.84px] border-dashed border-[#a8a8a8] p-3 sm:p-6 lg:items-center lg:gap-6 ${
        mediaFirst ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6 lg:h-[408px] lg:justify-between lg:gap-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 lg:gap-3">
            <Image
              src={JURISDICTION_ICON}
              alt=""
              width={18}
              height={18}
              className="size-4 lg:size-[18px]"
            />
            <p className="text-sm leading-none font-medium text-black uppercase lg:text-base">
              {row.tagLabel}
            </p>
          </div>
          <AssuranceProgress activeIndex={index} total={total} />
        </div>

        <div className="flex flex-col gap-4 lg:gap-5">
          <h3
            className={`font-serif text-[26px] leading-[1.1] tracking-[-0.26px] text-black lg:text-[32px] ${HEADING_TRACKING[row.headingTracking]}`}
          >
            {row.title}
          </h3>
          <div
            className={`flex flex-col gap-4 text-sm leading-[1.4] tracking-[-0.42px] text-black ${BODY_SIZE[row.bodySize]}`}
          >
            {row.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <AssuranceMedia />
    </article>
  );
}
