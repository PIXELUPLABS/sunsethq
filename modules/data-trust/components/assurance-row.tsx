import Image from "next/image";
import {
  DATA_TRUST_ASSURANCE_IMAGES,
  DATA_TRUST_LIABILITY_ICON,
  DATA_TRUST_OWNERSHIP_ICON,
  DATA_TRUST_STRUCTURE_ICON,
  JURISDICTION_ICON,
} from "../lib/assets";
import type { AssuranceRow as AssuranceRowData } from "../types";
import { AssuranceMedia } from "./assurance-media";
import { AssuranceProgress } from "./assurance-progress";

type AssuranceRowProps = {
  row: AssuranceRowData;
  index: number;
  total: number;
};

/** "Counsel" keeps the original jurisdiction icon; the other three rows
 *  each get their own eyebrow icon. */
const TAG_ICONS: Record<string, string> = {
  Structure: DATA_TRUST_STRUCTURE_ICON,
  Liability: DATA_TRUST_LIABILITY_ICON,
  Ownership: DATA_TRUST_OWNERSHIP_ICON,
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
      className={`flex flex-col gap-6 border-[0.84px] border-dashed border-[#a8a8a8] p-6 lg:items-stretch lg:gap-6 ${
        mediaFirst ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* `min-[1440px]:h-[490px]` only (no height between 1024-1439px) - in
          that bounded range the plate's own height shrinks with the row
          (see `AssuranceMedia`), so this column is left at `h-auto` and
          `lg:items-stretch` above grows it to match the plate's now-shorter
          height instead of staying rigidly 490px and leaving the plate
          looking short/misaligned next to it. At `min-[1440px]:` the plate
          is back to a fixed 490px itself, so this reproduces the exact
          original fixed-height pairing there, unchanged. */}
      <div className="flex min-w-0 flex-1 flex-col min-[1440px]:h-[490px]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 lg:gap-3">
            <Image
              src={TAG_ICONS[row.tagLabel] ?? JURISDICTION_ICON}
              alt=""
              width={18}
              height={18}
              className="size-4 lg:size-[18px]"
            />
            <p className="text-sm leading-none font-medium text-black uppercase">
              {row.tagLabel}
            </p>
          </div>
          <AssuranceProgress activeIndex={index} total={total} />
        </div>

        {/* On desktop, the heading is pushed down to sit a fixed 20px
            (`lg:mt-5`) above the body paragraph, rather than sitting right
            below the jurisdiction row - `lg:mt-auto` on the heading eats
            all the column's leftover height, so the heading+body pair
            together land flush against the column's bottom edge. The
            mobile gap here is unchanged from before (`mt-6`, matching this
            column's old mobile `gap-6`), and the body paragraph keeps its
            own old mobile gap to the heading (`mt-4`, matching the old
            `gap-4`). */}
        <h3
          className={`mt-6 font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-black lg:mt-auto lg:text-[32px] ${HEADING_TRACKING[row.headingTracking]}`}
        >
          {row.title}
        </h3>
        <div
          className={`mt-4 flex flex-col gap-4 text-sm leading-[1.4] tracking-[-0.42px] text-black lg:mt-5 ${BODY_SIZE[row.bodySize]}`}
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
