"use client";

import { useState } from "react";

export function useTabs<T extends string>(tabs: readonly T[], defaultTab: T = tabs[0]) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  return { activeTab, setActiveTab };
}
