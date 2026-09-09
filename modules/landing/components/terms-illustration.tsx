"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { createIllustrationScaler } from "../lib/illustration-scale";
import { TERMS_ILLUSTRATION_DURATION_MS, TERMS_TIMING } from "../lib/terms-illustration-timing";
import { TERMS_DIVIDER, TERMS_ROWS, TERMS_ROW_GAP, type TermsRow } from "../lib/terms-illustration-rows";
import { fadeKeyframes, growKeyframes } from "../lib/loop-keyframes";
import { useReplayTrigger } from "../hooks/use-replay-trigger";

const CANVAS = { width: 648, height: 709 };
const s = createIllustrationScaler(CANVAS.width, CANVAS.height);
const CYCLE = TERMS_ILLUSTRATION_DURATION_MS;

const ASSET_PATH = "/images/valuation/terms";
const ROW_TILT = "rotate(-10deg) skewX(-10deg) scaleY(0.98)";
const CARD_SIZE = { width: 326.619, height: 446.514 };

const CARD1_ORIGIN = { x: 77, y: 319.976 };
const CARD2_ORIGIN = { x: 167, y: 182.116 };
const CARD3_ORIGIN = { x: 252.0027, y: 51.9752 };

// Shared local offsets for the 3 structural card pieces (identical across cards).
// Each piece has its own outer (positioned) box, a unique tilt transform, and a
// smaller pre-transform inner box centered within the outer box.
const CARD_SHELL_PARTS = {
  rightBar: {
    outer: { left: 22.85, top: 61.02, width: 303.77, height: 438.91 },
    inner: { width: 308.456, height: 385.352 },
    tilt: "rotate(-10deg) skewX(-10deg) scaleY(0.98)",
  },
  titleBar: {
    outer: { left: 0, top: 53.19, width: 324.32, height: 60.99 },
    inner: { width: 306.335, height: 23.94 },
    tilt: "rotate(-10deg) skewX(61deg) scaleY(0.48)",
  },
  leftBorder: {
    outer: { left: 0.13, top: 107, width: 22.72, height: 393.62 },
    inner: { width: 24.177, height: 385.352 },
    tilt: "rotate(20deg) skewX(20deg) scaleY(0.94)",
  },
};

// --- Keyframes: every animated element gets its own full-cycle @keyframes
// rule (hold / animate / hold), generated once at module load. A shared
// delay+duration+infinite-iteration approach doesn't work for a *looping*
// illustration: with `infinite`, the browser repeats the short beat duration
// itself, not the full 5.5s cycle, so elements would blink every ~300-500ms
// instead of once per loop.

const KEYFRAME_NAMES = {
  card1: "terms-card1",
  cardShadow: "terms-card-shadow",
  border: "terms-border",
  card2: "terms-card2",
  card3: "terms-card3",
  cardContent: "terms-card-content",
  subtitleLeft: "terms-subtitle-left",
  subtitleRight: "terms-subtitle-right",
  barLeft: "terms-bar-left",
  barsRight: "terms-bars-right",
  divider: "terms-divider",
  row: (i: number) => `terms-row-${i}`,
};

const KEYFRAMES_CSS = [
  fadeKeyframes(KEYFRAME_NAMES.card1, TERMS_TIMING.card1, CYCLE, { slideX: 20, slideY: 40 }),
  fadeKeyframes(KEYFRAME_NAMES.cardShadow, TERMS_TIMING.cardShadow, CYCLE),
  fadeKeyframes(KEYFRAME_NAMES.card2, TERMS_TIMING.card2, CYCLE, { slideX: 15, slideY: 30 }),
  fadeKeyframes(KEYFRAME_NAMES.card3, TERMS_TIMING.card3, CYCLE, { slideX: 15, slideY: 30 }),
  fadeKeyframes(KEYFRAME_NAMES.cardContent, TERMS_TIMING.cardContent, CYCLE, { slideY: 15 }),
  fadeKeyframes(KEYFRAME_NAMES.subtitleLeft, TERMS_TIMING.subtitleLeft, CYCLE),
  fadeKeyframes(KEYFRAME_NAMES.subtitleRight, TERMS_TIMING.subtitleRight, CYCLE),
  growKeyframes(KEYFRAME_NAMES.barLeft, TERMS_TIMING.barLeft, CYCLE, "width", s.x(112.5)),
  growKeyframes(KEYFRAME_NAMES.barsRight, TERMS_TIMING.barsRight, CYCLE, "width", s.x(148.581)),
  growKeyframes(KEYFRAME_NAMES.divider, TERMS_TIMING.divider, CYCLE, "width", s.x(TERMS_DIVIDER.contentWidth)),
  ...TERMS_ROWS.map((row, i) => growKeyframes(KEYFRAME_NAMES.row(i), TERMS_TIMING.rows[i], CYCLE, "width", s.x(row.contentWidth))),
].join("\n");

function Reveal({
  left,
  top,
  width,
  height,
  animationName,
  style,
  className,
  children,
}: {
  left: number;
  top: number;
  width: number;
  height?: number;
  animationName: string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`absolute ${className ?? ""}`}
      style={{
        left: s.x(left),
        top: s.y(top),
        width: s.x(width),
        height: height === undefined ? "auto" : s.y(height),
        animationName,
        animationDuration: `${CYCLE}ms`,
        animationTimingFunction: "ease-out",
        animationIterationCount: "infinite",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** One tilted structural piece: an outer positioned+centered box, a unique skew/rotate, and a fill. */
function ShellPiece({
  part,
  fill,
}: {
  part: (typeof CARD_SHELL_PARTS)[keyof typeof CARD_SHELL_PARTS];
  fill: CSSProperties;
}) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: s.x(part.outer.left), top: s.y(part.outer.top), width: s.x(part.outer.width), height: s.y(part.outer.height) }}
    >
      <div style={{ transform: part.tilt }}>
        <div style={{ width: s.x(part.inner.width), height: s.y(part.inner.height), ...fill }} />
      </div>
    </div>
  );
}

/** Card-1/2/3's shared isometric shell: an outlined or solid right face, title bar, and dark spine. */
function CardShell({ tone }: { tone: "outline" | "blue" | "dark" }) {
  const rightBarFill: CSSProperties =
    tone === "outline" ? { border: "1px solid #595959" } : { background: tone === "blue" ? "#076ba4" : "#353535" };
  const titleBarFill: CSSProperties = tone === "outline" ? { border: "1px solid #595959" } : { background: "#4f4f4f" };

  return (
    <>
      <ShellPiece part={CARD_SHELL_PARTS.rightBar} fill={rightBarFill} />
      <ShellPiece part={CARD_SHELL_PARTS.titleBar} fill={titleBarFill} />
      <ShellPiece part={CARD_SHELL_PARTS.leftBorder} fill={{ background: "#1c1c1c" }} />
    </>
  );
}

/** One "typed in" document row: a bar (or single rect) that reveals via a clipped width grow. */
function TiltedGrowRow({ row, animationName, origin }: { row: TermsRow; animationName: string; origin: { x: number; y: number } }) {
  const left = row.left - origin.x;
  const top = row.top - origin.y;
  const growStyle: CSSProperties = {
    animationName,
    animationDuration: `${CYCLE}ms`,
    animationTimingFunction: "ease-out",
    animationIterationCount: "infinite",
  };

  return (
    <div
      className="absolute flex items-start justify-start"
      style={{ left: s.x(left), top: s.y(top), width: s.x(row.outerWidth), height: s.y(row.outerHeight) }}
    >
      <div style={{ transform: ROW_TILT }}>
        {row.bars ? (
          <div
            className="flex shrink-0 items-center overflow-hidden"
            style={{ height: s.y(row.contentHeight), gap: s.x(TERMS_ROW_GAP), ...growStyle }}
          >
            {row.bars.map((barWidth, i) => (
              <div
                key={i}
                className="h-full shrink-0"
                style={{
                  width: s.x(barWidth),
                  background: "rgba(217,217,217,0.17)",
                  border: "0.636px solid rgba(0,0,0,0.1)",
                  borderRadius: s.x(1.273),
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="shrink-0 overflow-hidden"
            style={{
              height: s.y(row.contentHeight),
              background: "rgba(217,217,217,0.17)",
              border: "0.636px solid rgba(0,0,0,0.1)",
              borderRadius: s.x(1.273),
              ...growStyle,
            }}
          />
        )}
      </div>
    </div>
  );
}

function TiltedDivider() {
  const left = TERMS_DIVIDER.left - CARD1_ORIGIN.x;
  const top = TERMS_DIVIDER.top - CARD1_ORIGIN.y;

  return (
    <div
      className="absolute flex items-start justify-start"
      style={{ left: s.x(left), top: s.y(top), width: s.x(TERMS_DIVIDER.outerWidth), height: s.y(TERMS_DIVIDER.outerHeight) }}
    >
      <div style={{ transform: ROW_TILT }}>
        <div
          className="relative overflow-hidden"
          style={{
            height: s.y(0.646485),
            animationName: KEYFRAME_NAMES.divider,
            animationDuration: `${CYCLE}ms`,
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
          }}
        >
          <Image src={`${ASSET_PATH}/divider.svg`} alt="" fill className="pointer-events-none object-fill" />
        </div>
      </div>
    </div>
  );
}

function ConnectorLine({ left, top, src }: { left: number; top: number; src: string }) {
  return (
    <div className="absolute flex items-end justify-end" style={{ left: s.x(left), top: s.y(top), width: s.x(174.982), height: s.y(268.012) }}>
      <div style={{ transform: "rotate(-146.86deg)" }}>
        <div
          className="relative"
          style={
            {
              width: s.x(0.65),
              animationName: "terms-line-grow",
              animationDuration: `${TERMS_ILLUSTRATION_DURATION_MS}ms`,
              animationIterationCount: "infinite",
              animationFillMode: "both",
              "--line-mid-size": s.y(164.577),
              "--line-size": s.y(320.077),
            } as CSSProperties
          }
        >
          <Image src={src} alt="" fill className="pointer-events-none object-fill" />
        </div>
      </div>
    </div>
  );
}

export function TermsIllustration({ active }: { active: boolean }) {
  const playKey = useReplayTrigger(active);

  return (
    <div
      key={playKey}
      className="relative size-full overflow-hidden border border-[#444]"
      style={{ containerType: "size", background: "linear-gradient(90deg, rgba(217,217,217,0.14), rgba(217,217,217,0.14)), #0c0c0b" }}
    >
      <style>{KEYFRAMES_CSS}</style>

      {/* Card-1: back document card with 19 typed-in text rows */}
      <Reveal left={CARD1_ORIGIN.x} top={CARD1_ORIGIN.y} width={CARD_SIZE.width} height={CARD_SIZE.height} animationName={KEYFRAME_NAMES.card1}>
        <CardShell tone="outline" />

        <Reveal left={0} top={0} width={CARD_SIZE.width} height={CARD_SIZE.height} animationName={KEYFRAME_NAMES.cardShadow}>
          <div
            className="absolute flex items-center justify-center"
            style={{ left: s.x(47), top: s.y(86.7), width: s.x(260.974), height: s.y(398.655) }}
          >
            <div style={{ transform: ROW_TILT }}>
              <div className="border-[0.873px] border-[rgba(255,255,255,0.11)]" style={{ width: s.x(265), height: s.y(352.639) }} />
            </div>
          </div>

          {TERMS_ROWS.map((row, i) => (
            <TiltedGrowRow key={i} row={row} animationName={KEYFRAME_NAMES.row(i)} origin={CARD1_ORIGIN} />
          ))}
          <TiltedDivider />
        </Reveal>
      </Reveal>

      {/* Card-2: middle blue accent card */}
      <Reveal left={CARD2_ORIGIN.x} top={CARD2_ORIGIN.y} width={CARD_SIZE.width} height={CARD_SIZE.height} animationName={KEYFRAME_NAMES.card2}>
        <CardShell tone="blue" />
      </Reveal>

      {/* Card-3: front offer card with price + revenue split */}
      <Reveal left={CARD3_ORIGIN.x} top={CARD3_ORIGIN.y} width={CARD_SIZE.width} height={CARD_SIZE.height} animationName={KEYFRAME_NAMES.card3}>
        <CardShell tone="dark" />

        <Reveal left={45.71} top={93.49} width={264.144} height={315.284} animationName={KEYFRAME_NAMES.cardContent}>
          <div className="h-full w-full" style={{ transform: "rotate(-11deg) skewX(-11deg) scaleY(0.98)" }}>
          <div className="flex h-full w-full flex-col justify-between">
            <div className="flex flex-col justify-between whitespace-nowrap" style={{ height: s.y(107.391) }}>
              <p className="font-mono font-light text-[rgba(255,255,255,0.7)] opacity-60" style={{ fontSize: s.x(11), lineHeight: 1.4 }}>
                OFFER TO LICENSE
              </p>
              <div className="flex w-full items-end justify-between font-mono text-white">
                <p style={{ fontSize: s.x(50), lineHeight: 1.1, letterSpacing: "-0.5px" }}>
                  <span className="font-light">[</span>
                  <span className="font-light" style={{ letterSpacing: "7px" }}>$</span>
                  <span className="font-light">8M]</span>
                </p>
                <p style={{ fontSize: s.x(11.006), lineHeight: 1.1, letterSpacing: "-0.11px" }}>INDICATED TOTAL</p>
              </div>
            </div>

            <div className="flex w-full flex-col" style={{ gap: s.y(12.84) }}>
              <div className="relative w-full whitespace-nowrap font-mono text-white" style={{ fontSize: s.x(11.006), letterSpacing: "-0.11px", height: s.y(35.26) }}>
                <Reveal left={0} top={0} width={57.916} animationName={KEYFRAME_NAMES.subtitleLeft}>
                  <span style={{ lineHeight: 1.1 }}>
                    UPFRONT
                    <br />
                  </span>
                  <span style={{ lineHeight: 1.1, color: "rgba(255,255,255,0.5)" }}>PAID ONCE</span>
                </Reveal>
                <Reveal left={179.06} top={0} width={83.438} animationName={KEYFRAME_NAMES.subtitleRight} className="text-right">
                  <span style={{ lineHeight: 1.1 }}>
                    REVENUE SHARE
                    <br />
                  </span>
                  <span style={{ lineHeight: 1.1, color: "rgba(255,255,255,0.5)" }}>PERPETUAL</span>
                </Reveal>
              </div>

              <div
                className="flex w-full shrink-0 items-center"
                style={{ height: s.y(97.288), gap: s.x(2), border: "0.5px solid rgba(255,255,255,0.15)" }}
              >
                <div
                  className="h-full shrink-0 overflow-hidden"
                  style={{
                    animationName: KEYFRAME_NAMES.barLeft,
                    animationDuration: `${CYCLE}ms`,
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    background: "#0e9692",
                  }}
                />
                <div
                  className="flex h-full shrink-0 items-center overflow-hidden"
                  style={{
                    gap: s.x(1.834),
                    animationName: KEYFRAME_NAMES.barsRight,
                    animationDuration: `${CYCLE}ms`,
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                  }}
                >
                  {Array.from({ length: 41 }).map((_, i) => (
                    <div key={i} className="h-full shrink-0" style={{ width: s.x(1.834), background: "#d9d9d9" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </Reveal>
      </Reveal>

      {/* Diagonal scaffolding lines connecting the three cards */}
      <ConnectorLine left={99.8581} top={381.1142} src={`${ASSET_PATH}/line-1.svg`} />
      <ConnectorLine left={99.8489} top={766.1204} src={`${ASSET_PATH}/line-2.svg`} />
      <ConnectorLine left={403.849} top={712.2234} src={`${ASSET_PATH}/line-3.svg`} />

      {/* Decorative overlays sit above every card, matching Figma's top-of-stack layer order */}
      <Image src={`${ASSET_PATH}/bricks-pattern.svg`} alt="" fill className="pointer-events-none object-fill" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ backgroundImage: `url(${ASSET_PATH}/grain-overlay.png)`, backgroundSize: `${s.x(222)} ${s.y(222)}` }}
      />
    </div>
  );
}
