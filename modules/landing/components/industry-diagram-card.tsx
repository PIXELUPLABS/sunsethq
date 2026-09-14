import Image from "next/image";

export function IndustryDiagramCard({
  label,
  icon,
  left,
  top,
  offsetLeft,
  offsetTop,
  start,
  delayMs = 0,
}: {
  label: string;
  icon: string;
  left: number;
  top: number;
  offsetLeft: number;
  offsetTop: number;
  start: boolean;
  delayMs?: number;
}) {
  return (
    <div
      className="absolute flex flex-col items-start justify-between border-[0.5px] border-dashed border-black/70 p-[1.8045cqw] transition-transform duration-700 ease-out"
      style={{
        left: `${(left / 665) * 100}cqw`,
        top: `${(top / 665) * 100}cqw`,
        width: "19.0977cqw",
        height: "19.0977cqw",
        transitionDelay: `${delayMs}ms`,
        transform: start
          ? "translate(0, 0)"
          : `translate(${(offsetLeft / 665) * 100}cqw, ${(offsetTop / 665) * 100}cqw)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#eaebf1]" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: "url(/images/texture-grain-white.png)",
          backgroundSize: "160px 160px",
        }}
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
