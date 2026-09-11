import Image from "next/image";

export function RevenueStreamShelfItem({
  icon,
  label,
  isLastRow = false,
  start = true,
  offsetX = 0,
  offsetY = 0,
  delayMs = 0,
}: {
  icon: string;
  label: string;
  isLastRow?: boolean;
  start?: boolean;
  offsetX?: number;
  offsetY?: number;
  delayMs?: number;
}) {
  const borderClasses = `border-r border-dashed border-[#a8a8a8] ${
    isLastRow ? "" : "border-b"
  }`;

  // Tether lines from each bottom corner of the floating card back to that
  // same corner's original slot — pointing from the floating corner toward
  // the resting corner, so they connect the two as the card lifts off.
  const tetherLength = Math.hypot(offsetX, offsetY);
  const tetherAngleDeg = (Math.atan2(-offsetY, -offsetX) * 180) / Math.PI;
  const tetherClasses = `pointer-events-none absolute h-0 border-t border-dashed border-[#a8a8a8] transition-opacity duration-400 ease-out ${
    start ? "opacity-0" : "opacity-100"
  }`;

  return (
    <div className="relative">
      {/* placeholder outline left behind in the grid slot while the card is
          offset, so the grid line isn't missing — hidden once the card
          settles back, since its own border then sits in the same place */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[#A8A8A8]/60 ${borderClasses} transition-opacity duration-400 ease-out ${
          start ? "opacity-0" : "opacity-100"
        }`}
        style={{
          borderTop: "5px solid #A6A6A6",
          borderRight: "5px solid #A6A6A6",
          transitionDelay: `${delayMs}ms`,
        }}
      />

      {/* top-left tether: floating corner -> original top-left corner */}
      <div
        className={tetherClasses}
        style={{
          top: `${offsetY}px`,
          left: `${offsetX}px`,
          width: `${tetherLength}px`,
          transformOrigin: "0 0",
          transform: `rotate(${tetherAngleDeg}deg)`,
          transitionDelay: `${delayMs}ms`,
        }}
      />

      {/* bottom-left tether: floating corner -> original bottom-left corner */}
      <div
        className={tetherClasses}
        style={{
          top: `calc(100% + ${offsetY}px)`,
          left: `${offsetX}px`,
          width: `${tetherLength}px`,
          transformOrigin: "0 0",
          transform: `rotate(${tetherAngleDeg}deg)`,
          transitionDelay: `${delayMs}ms`,
        }}
      />

      {/* bottom-right tether: floating corner -> original bottom-right corner */}
      <div
        className={tetherClasses}
        style={{
          top: `calc(100% + ${offsetY}px)`,
          left: `calc(100% + ${offsetX}px)`,
          width: `${tetherLength}px`,
          transformOrigin: "0 0",
          transform: `rotate(${tetherAngleDeg}deg)`,
          transitionDelay: `${delayMs}ms`,
        }}
      />

      {/* top-right tether: floating corner -> original top-right corner */}
      <div
        className={tetherClasses}
        style={{
          top: `${offsetY}px`,
          left: `calc(100% + ${offsetX}px)`,
          width: `${tetherLength}px`,
          transformOrigin: "0 0",
          transform: `rotate(${tetherAngleDeg}deg)`,
          transitionDelay: `${delayMs}ms`,
        }}
      />

      <div
        className={`absolute inset-0 z-10 flex items-center gap-[1.2346cqw] bg-white px-[1.5432cqw] transition-[transform,border-color,border-top-width,border-left-width,border-bottom-width] duration-400 ease-out ${borderClasses} ${
          start ? "border-t-0 border-l-0" : "border-t border-l"
        } ${isLastRow ? (start ? "" : "border-b") : ""}`}
        style={{
          transform: start
            ? "translate(0px, 0px)"
            : `translate(${offsetX}px, ${offsetY}px)`,
          transitionDelay: `${delayMs}ms`,
        }}
      >
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover mix-blend-multiply"
        />
        <Image
          src={icon}
          alt=""
          width={18}
          height={18}
          className="relative h-[1.3889cqw] w-[1.3889cqw] shrink-0"
        />
        <p className="relative whitespace-nowrap font-mono text-[1.2346cqw] uppercase tracking-[-0.0086cqw] text-black">
          {label}
        </p>
      </div>
    </div>
  );
}
