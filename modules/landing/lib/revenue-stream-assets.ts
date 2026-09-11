export const REVENUE_STREAM_WIREFRAME = "/images/revenue-stream/wireframe.svg";
export const REVENUE_STREAM_PATTERN_LEFT =
  "/images/revenue-stream/pattern-left.svg";
export const REVENUE_STREAM_PATTERN_RIGHT =
  "/images/revenue-stream/pattern-right.svg";
export const REVENUE_STREAM_DASH_TICK_LEFT =
  "/images/revenue-stream/dash-tick-left.svg";
export const REVENUE_STREAM_DASH_TICK_RIGHT =
  "/images/revenue-stream/dash-tick-right.svg";

export const REVENUE_STREAM_PANEL_TOP =
  "/images/revenue-stream/panel-top.png";
export const REVENUE_STREAM_PANEL_FLOOR =
  "/images/revenue-stream/panel-floor.png";
export const REVENUE_STREAM_PANEL_SIDE_LEFT =
  "/images/revenue-stream/panel-side-left.png";
export const REVENUE_STREAM_PANEL_SIDE_RIGHT =
  "/images/revenue-stream/panel-side-right.png";

export const REVENUE_STREAM_FLOOR_BAND =
  "/images/revenue-stream/floor-band-image-1.svg";

export const REVENUE_STREAM_ITEMS = [
  {
    icon: "/images/revenue-stream/icon-product-logs.svg",
    label: "Product logs",
  },
  {
    icon: "/images/revenue-stream/icon-support-history.svg",
    label: "Support history",
  },
  {
    icon: "/images/revenue-stream/icon-decision-threads.svg",
    label: "Decision threads",
  },
  {
    icon: "/images/revenue-stream/icon-product-data.svg",
    label: "Product data",
  },
  { icon: "/images/revenue-stream/icon-billing.svg", label: "Billing" },
  {
    icon: "/images/revenue-stream/icon-internal-docs.svg",
    label: "Internal docs",
  },
  { icon: "/images/revenue-stream/icon-support.svg", label: "Support" },
  { icon: "/images/revenue-stream/icon-crm.svg", label: "CRM" },
  {
    icon: "/images/revenue-stream/icon-code-commits.svg",
    label: "Code and commits",
  },
  {
    icon: "/images/revenue-stream/icon-sales-conversations.svg",
    label: "Sales conversations",
  },
] as const;

export const REVENUE_STREAM_MOBILE_BAND =
  "/images/revenue-stream/mobile/band.png";
export const REVENUE_STREAM_MOBILE_WALL_LEFT =
  "/images/revenue-stream/mobile/wall-left.png";
export const REVENUE_STREAM_MOBILE_WALL_RIGHT =
  "/images/revenue-stream/mobile/wall-right.png";

// The mobile design stacks the shelf into a single column and shows eight of
// the ten rows, in its own order.
const MOBILE_LABELS = [
  "Product logs",
  "Decision threads",
  "Billing",
  "Support",
  "Code and commits",
  "Product data",
  "CRM",
  "Sales conversations",
];

export const REVENUE_STREAM_MOBILE_ITEMS = MOBILE_LABELS.map((label) => {
  const item = REVENUE_STREAM_ITEMS.find((entry) => entry.label === label);
  if (!item) throw new Error(`Unknown revenue stream item: ${label}`);
  return item;
});
