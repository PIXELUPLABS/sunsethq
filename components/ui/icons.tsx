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
    <svg className={className} viewBox="0 0 24 24" fill="#A6B5C5" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.875 3.75V20.25C4.875 20.5484 4.75647 20.8345 4.5455 21.0455C4.33452 21.2565 4.04837 21.375 3.75 21.375C3.45163 21.375 3.16548 21.2565 2.9545 21.0455C2.74353 20.8345 2.625 20.5484 2.625 20.25V3.75C2.625 3.45163 2.74353 3.16548 2.9545 2.9545C3.16548 2.74353 3.45163 2.625 3.75 2.625C4.04837 2.625 4.33452 2.74353 4.5455 2.9545C4.75647 3.16548 4.875 3.45163 4.875 3.75ZM6.375 9.375V6C6.375 5.50272 6.57254 5.02581 6.92417 4.67417C7.27581 4.32254 7.75272 4.125 8.25 4.125H16.5C16.9973 4.125 17.4742 4.32254 17.8258 4.67417C18.1775 5.02581 18.375 5.50272 18.375 6V9.375C18.375 9.87228 18.1775 10.3492 17.8258 10.7008C17.4742 11.0525 16.9973 11.25 16.5 11.25H8.25C7.75272 11.25 7.27581 11.0525 6.92417 10.7008C6.57254 10.3492 6.375 9.87228 6.375 9.375ZM8.625 9H16.125V6.375H8.625V9ZM22.125 14.625V18C22.125 18.4973 21.9275 18.9742 21.5758 19.3258C21.2242 19.6775 20.7473 19.875 20.25 19.875H8.25C7.75272 19.875 7.27581 19.6775 6.92417 19.3258C6.57254 18.9742 6.375 18.4973 6.375 18V14.625C6.375 14.1277 6.57254 13.6508 6.92417 13.2992C7.27581 12.9475 7.75272 12.75 8.25 12.75H20.25C20.7473 12.75 21.2242 12.9475 21.5758 13.2992C21.9275 13.6508 22.125 14.1277 22.125 14.625ZM19.875 15H8.625V17.625H19.875V15Z" />
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
