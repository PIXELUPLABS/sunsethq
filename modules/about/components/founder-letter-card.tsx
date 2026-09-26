import Image from "next/image";
import { FOUNDER_SIGNATURE, LETTER_DIVIDER, LETTER_GRAIN_TEXTURE } from "../lib/assets";
import { FOUNDER_LETTER, FOUNDER_NAME, FOUNDER_TITLE } from "../lib/constants";

export function FounderLetterCard() {
  return (
    <div className="relative flex w-full flex-col items-end bg-[#eaebf1] px-4 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-11 mix-blend-multiply"
        style={{
          backgroundImage: `url(${LETTER_GRAIN_TEXTURE})`,
          backgroundSize: "370px 370px",
          backgroundPosition: "top left",
        }}
      />

      <div className="relative -mb-1 flex w-full flex-col items-start gap-8 p-2 sm:w-[572px] sm:p-6">
        <div className="flex w-full flex-col items-start gap-5">
          <p className="w-full font-serif text-[28px] leading-none tracking-[-1.12px] text-black sm:text-[32px] sm:tracking-[-1.28px]">
            {FOUNDER_LETTER.title}
          </p>
          <div className="flex w-full flex-col items-start gap-4 text-base leading-[1.4] tracking-[-0.48px] text-[#565656]">
            {FOUNDER_LETTER.body.map((paragraph) => (
              <p key={paragraph} className="w-full max-w-[500px]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <Image
          src={LETTER_DIVIDER}
          alt=""
          width={516.5}
          height={1}
          unoptimized
          className="block h-px w-full max-w-[516.5px]"
        />

        <p className="font-serif text-2xl leading-none tracking-[-0.96px] whitespace-nowrap text-black">
          {FOUNDER_LETTER.closingLine}
        </p>
      </div>

      <div className="relative flex flex-col items-end overflow-hidden">
        <div className="relative -mb-2.5 h-24 w-[277px] shrink-0">
          <div className="absolute top-[13px] left-[74px] h-[78px] w-[225px] opacity-80">
            <Image
              src={FOUNDER_SIGNATURE}
              alt={`${FOUNDER_NAME}'s signature`}
              fill
              sizes="225px"
              className="pointer-events-none object-bottom"
            />
          </div>
        </div>
        <p className="relative font-mono text-xs leading-[1.1] tracking-[0.96px] whitespace-nowrap text-black/60 uppercase">
          {FOUNDER_TITLE}
        </p>
      </div>
    </div>
  );
}
