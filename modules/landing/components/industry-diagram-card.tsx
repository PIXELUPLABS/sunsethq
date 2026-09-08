import Image from "next/image";

export function IndustryDiagramCard({
  label,
  icon,
  left,
  top,
}: {
  label: string;
  icon: string;
  left: number;
  top: number;
}) {
  return (
    <div
      className="absolute flex flex-col items-start justify-between border-[0.5px] border-dashed border-black p-[1.8045cqw]"
      style={{
        left: `${(left / 665) * 100}cqw`,
        top: `${(top / 665) * 100}cqw`,
        width: "19.0977cqw",
        height: "19.0977cqw",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#eaebf1]" />
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover mix-blend-multiply"
      />
      <Image
        src={icon}
        alt=""
        width={16}
        height={16}
        className="relative z-10 size-[2.406cqw]"
      />
      <p className="relative z-10 whitespace-nowrap font-serif-accent text-[2.1053cqw] tracking-tight text-[#090909]">
        {label}
      </p>
    </div>
  );
}
