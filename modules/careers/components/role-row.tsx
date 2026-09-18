import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";
import type { Role } from "../types";

type RoleRowProps = {
  role: Role;
  index: number;
  isLast: boolean;
};

export function RoleRow({ role, index, isLast }: RoleRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/careers/roles/${role.id}`}
      className={`group relative my-1.5 flex items-start gap-4 border-b py-5 text-left transition-colors duration-200 ease-snap active:!bg-black/[0.05] [@media(hover:hover)]:hover:bg-black/[0.03] lg:mx-6 lg:my-0 lg:p-5 ${
        isLast ? "border-transparent" : "border-black/10"
      }`}
    >
      <span className="mt-1 font-mono text-xs text-[#898989]">{num}</span>
      <span className="flex flex-1 flex-col gap-1">
        <span className="w-fit font-serif text-lg tracking-[-0.3px] text-black">
          {role.title}
        </span>
        <span className="flex flex-wrap gap-x-3 font-mono text-xs tracking-wide text-[#919191] uppercase">
          <span>{role.location}</span>
          <span>{role.employmentType}</span>
          {role.compensation ? <span>{role.compensation}</span> : null}
        </span>
      </span>
      <span className="mt-1.5 flex shrink-0 items-center gap-1.5">
        <span className="hidden -translate-x-1 font-mono text-xs tracking-wide text-[#898989] uppercase opacity-0 transition-[opacity,transform] duration-200 ease-snap [@media(hover:hover)]:inline-block [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100">
          Apply Now
        </span>
        <ChevronRightIcon className="size-4 text-[#898989] transition-colors duration-200 ease-snap [@media(hover:hover)]:group-hover:text-black" />
      </span>
    </Link>
  );
}
