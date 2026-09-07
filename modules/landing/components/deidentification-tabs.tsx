"use client";

import { DEIDENTIFICATION_TABS } from "../lib/constants";
import { useTabs } from "../hooks/use-tabs";
import { ProcessBar } from "./process-bar";

const GRAIN_TEXTURE = "/images/deidentification/grain-texture.webp";

export function DeidentificationTabs() {
  const { activeTab, setActiveTab } = useTabs(DEIDENTIFICATION_TABS);

  return (
    <div className="flex w-full">
      {DEIDENTIFICATION_TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative flex h-[72px] flex-1 items-center justify-center gap-6 overflow-hidden border border-[#ccc] font-serif text-lg transition-colors ${
              isActive ? "bg-black text-[#f2f2f2]" : "bg-transparent text-black"
            }`}
          >
            {isActive ? (
              <>
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.11] mix-blend-multiply"
                  style={{
                    backgroundImage: `url(${GRAIN_TEXTURE})`,
                    backgroundSize: "432.6px 432.6px",
                  }}
                />
                <ProcessBar className="absolute inset-x-0 top-0 h-2" />
              </>
            ) : null}

            <span className="relative">{tab}</span>
            <span
              className={`absolute bottom-[5px] left-[7px] size-4 rounded-full ${
                isActive ? "bg-[#454545]" : "bg-[#b2b2b2]/40"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
