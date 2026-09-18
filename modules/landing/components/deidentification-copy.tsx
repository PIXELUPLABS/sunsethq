import { DEIDENTIFICATION_COPY, DEIDENTIFICATION_TABS } from "../lib/constants";

/**
 * The heading and body copy for the active tab. Every tab's copy shares a
 * single grid cell, so the panel is as tall as the longest one and the
 * section doesn't change height when the tab changes.
 */
export function DeidentificationCopy({
  activeIndex,
  durationMs,
}: {
  activeIndex: number;
  durationMs: number;
}) {
  return (
    <div className="grid">
      {DEIDENTIFICATION_TABS.map((tab, index) => {
        const isActive = index === activeIndex;
        const copy = DEIDENTIFICATION_COPY[tab];

        return (
          <div
            key={tab}
            inert={!isActive}
            style={{ transitionDuration: `${durationMs}ms` }}
            // Each tab centers its own copy in the shared cell, so shorter
            // tabs sit centered rather than riding the tallest tab's top.
            className={`flex flex-col justify-center gap-5 transition-opacity ease-in-out [grid-area:1/1] ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <h3 className="font-serif text-2xl leading-[1.1] tracking-[-0.24px] text-black min-[1150px]:text-[32px] min-[1150px]:tracking-[-0.32px] xl:text-[40px] xl:tracking-[-0.4px]">
              {copy.heading}
            </h3>
            <div className="flex max-w-[90%] flex-col gap-3.5 text-sm leading-[1.4] tracking-[-0.42px] text-black/60 opacity-80 min-[1150px]:max-w-none min-[1150px]:gap-2 min-[1150px]:text-base min-[1150px]:tracking-[-0.48px] min-[1150px]:text-[#727272] min-[1150px]:opacity-100">
              {copy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
