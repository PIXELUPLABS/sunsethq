"use client";

import { useMeasuredHeight } from "../hooks/use-measured-height";
import { OurPurposeSection } from "./our-purpose-section";
import { ANewWayToGrowSection } from "./a-new-way-to-grow-section";

/**
 * Renders "Our purpose" and "A new way to grow" together so the latter's
 * pinned panel can be sized to match the former's rendered height.
 */
export function PurposeAndGrowthSections() {
  const { ref: purposeRef, height: purposeHeight } = useMeasuredHeight<HTMLDivElement>();

  return (
    <>
      <div ref={purposeRef}>
        <OurPurposeSection />
      </div>
      <ANewWayToGrowSection matchHeight={purposeHeight} />
    </>
  );
}
