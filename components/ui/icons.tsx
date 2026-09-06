type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 20s-7-4.35-9.5-8.5C.6 8.1 2.2 4.5 5.8 4.5c2 0 3.3 1.1 4.2 2.4.9-1.3 2.2-2.4 4.2-2.4 3.6 0 5.2 3.6 3.3 7C19 15.65 12 20 12 20Z" />
    </svg>
  );
}

export function FilmIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

export function UserBoxIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M7 17c1-2.2 2.9-3 5-3s4 .8 5 3" />
    </svg>
  );
}

export function GavelIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m14 5 5 5" />
      <path d="m9.5 9.5-6 6 3 3 6-6" />
      <path d="m13 6 5 5 2-2-5-5-2 2Z" />
      <path d="M4 20h8" />
    </svg>
  );
}

export function ZapIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M21 8v8a1 1 0 0 1-.5.87l-8 4.5a1 1 0 0 1-1 0l-8-4.5A1 1 0 0 1 3 16V8a1 1 0 0 1 .5-.87l8-4.5a1 1 0 0 1 1 0l8 4.5A1 1 0 0 1 21 8Z" />
      <path d="M3.3 7.6 12 12.3l8.7-4.7M12 12.3V21" />
    </svg>
  );
}

export function LandmarkIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 10h16M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18M12 3 3 8h18L12 3Z" />
    </svg>
  );
}

export function AlignLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 6h16M4 12h10M4 18h13" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
