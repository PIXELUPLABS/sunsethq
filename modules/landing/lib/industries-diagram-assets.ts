export const INDUSTRIES_GRID_LINES = "/images/industries/grid-lines.svg";

// offsetLeft/offsetTop are each card's starting position, expressed as a
// delta from its resting spot — sized and positioned to sit exactly over
// that card's connector bar (the #c0c0c8 panel behind it), so the card
// appears to slide out from under the bar into place on reveal.
export const INDUSTRY_DIAGRAM_CARDS = [
  { label: "Healthcare", icon: "/images/industries/icon-healthcare.svg", left: 255, top: 0, offsetLeft: 0, offsetTop: 13.25 },
  { label: "Media", icon: "/images/industries/icon-media.svg", left: 510.08, top: 248, offsetLeft: -13.08, offsetTop: 0.25 },
  { label: "Insurance", icon: "/images/industries/icon-insurance.svg", left: 0, top: 245, offsetLeft: 13.08, offsetTop: 0.25 },
  { label: "Service", icon: "/images/industries/icon-service.svg", left: 445.26, top: 58, offsetLeft: -11.26, offsetTop: 18 },
  { label: "Legal", icon: "/images/industries/icon-legal.svg", left: 64, top: 55, offsetLeft: 11.26, offsetTop: 18 },
  { label: "Energy", icon: "/images/industries/icon-energy.svg", left: 64, top: 436, offsetLeft: 14, offsetTop: -16.75 },
  { label: "CPG", icon: "/images/industries/icon-cpg.svg", left: 448, top: 440, offsetLeft: -14, offsetTop: -16.75 },
  { label: "Finance", icon: "/images/industries/icon-finance.svg", left: 254, top: 484.25, offsetLeft: 0, offsetTop: -16 },
] as const;
