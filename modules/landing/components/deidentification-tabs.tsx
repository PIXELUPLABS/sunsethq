"use client";

import { DEIDENTIFICATION_TABS } from "../lib/constants";
import { useTabs } from "../hooks/use-tabs";
import { ProcessBar } from "./process-bar";

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
            className={`relative flex flex-1 items-center justify-center overflow-hidden border border-[#ccc] py-6 font-serif text-lg transition-colors ${
              isActive ? "bg-black text-[#f2f2f2]" : "bg-transparent text-black"
            }`}
          >
            {tab}
            {isActive ? (
              <ProcessBar className="absolute inset-x-0 bottom-0 h-[3px]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
