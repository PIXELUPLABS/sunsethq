import Image from "next/image";

export function RevenueStreamShelfItem({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-[1.2346cqw] border-r border-b border-dashed border-[#a8a8a8] px-[1.5432cqw]">
      <Image
        src={icon}
        alt=""
        width={18}
        height={18}
        className="h-[1.3889cqw] w-[1.3889cqw] shrink-0"
      />
      <p className="whitespace-nowrap font-mono text-[1.2346cqw] uppercase tracking-[-0.0086cqw] text-black">
        {label}
      </p>
    </div>
  );
}
