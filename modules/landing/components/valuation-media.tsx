import Image from "next/image";
import { VALUATION_STEPS } from "../lib/constants";
import { StepVideo } from "./step-video";

const STEP_VIDEOS = [
  "/images/htw-1.webm",
  "/images/htw-2.webm",
  "/images/htw-3.webm",
  "/images/htw-4.webm",
];

/** The crossfading stack of step illustrations, one layer per valuation step. */
export function ValuationMedia({
  activeIndex,
  hasEnteredViewport,
}: {
  activeIndex: number;
  hasEnteredViewport: boolean;
}) {
  return (
    <>
      {VALUATION_STEPS.map((step, index) => {
        const isActive = index === activeIndex;
        const fadeClassName = `absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isActive ? "opacity-100" : "opacity-0"
        }`;
        const videoSrc = STEP_VIDEOS[index];

        if (videoSrc) {
          return (
            <div key={step.label} className={fadeClassName}>
              {hasEnteredViewport && <StepVideo src={videoSrc} active={isActive} />}
            </div>
          );
        }

        return (
          <Image
            key={step.label}
            src={step.image}
            alt={step.alt}
            fill
            className={`object-cover ${fadeClassName}`}
          />
        );
      })}
    </>
  );
}
