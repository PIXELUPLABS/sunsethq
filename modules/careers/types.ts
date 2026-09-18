export type WhyReplayStatement = {
  title: string;
  body: string;
};

export type Value = {
  title: string;
  body: string;
  icon: string;
};

export type Role = {
  id: string;
  title: string;
  team: string;
  location: string;
  employmentType: string;
  compensation?: string;
  description: string;
  applyHref: string;
  jobUrl?: string;
};

export type Team = {
  name: string;
  roles: Role[];
};

export type CollagePhoto = {
  id: string;
  src: string;
  alt: string;
  leftCqw: number;
  topCqw: number;
  widthCqw: number;
  heightCqw: number;
  rotationDeg: number;
  baseZ: number;
};
