import Image from "next/image";
import { DATA_TRUST_ASSURANCE_IMAGES, JURISDICTION_ICON } from "../lib/assets";
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
      className={`flex flex-col gap-6 border-[0.84px] border-dashed border-[#a8a8a8] p-6 lg:items-center lg:gap-6 ${
        mediaFirst ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col lg:h-[490px]">
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

        {/* Heading sits a fixed 20px below the jurisdiction row above it
            on desktop (`lg:mt-5`); the mobile gap here is unchanged from
            before (`mt-6`, matching this column's old mobile `gap-6`).
            The body paragraph keeps its own old mobile gap to the heading
            (`mt-4`, matching the old `gap-4`), but on desktop stays
            pinned to the column's bottom edge (`lg:mt-auto`) at its
            original position instead of following the heading up too. */}
        <h3
          className={`mt-6 font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-black lg:mt-5 lg:text-[32px] ${HEADING_TRACKING[row.headingTracking]}`}
        >
          {row.title}
        </h3>
        <div
          className={`mt-4 flex flex-col gap-4 text-sm leading-[1.4] tracking-[-0.42px] text-black lg:mt-auto ${BODY_SIZE[row.bodySize]}`}
        >
          {row.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <AssuranceMedia src={DATA_TRUST_ASSURANCE_IMAGES[index]} alt="" />
    </article>
  );
}
