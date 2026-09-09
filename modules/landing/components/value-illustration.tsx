"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { createIllustrationScaler } from "../lib/illustration-scale";
import { VALUE_TIMING } from "../lib/value-illustration-timing";
import { useReplayTrigger } from "../hooks/use-replay-trigger";

const CANVAS = { width: 648, height: 709 };
const s = createIllustrationScaler(CANVAS.width, CANVAS.height);

const ASSET_PATH = "/images/valuation/value";
const CARD_FACE_A = `${ASSET_PATH}/card-face-a.png`;
const CARD_FACE_B = `${ASSET_PATH}/card-face-b.png`;

const ROW_BG = "rgba(217,217,217,0.18)";
const ROW_BG_BLUE = "rgba(20,125,186,0.45)";
const ROW_BORDER = "0.729px solid rgba(0,0,0,0.1)";

type Beat = { delayMs: number; durationMs: number };

function FadeSlide({
  left,
  top,
  width,
  height,
  beat,
  opacity = 1,
  slideX = 0,
  slideY = 0,
  style,
  className,
  children,
}: {
  left: number;
  top: number;
  width: number;
  height?: number;
  beat: Beat;
  opacity?: number;
  slideX?: number;
  slideY?: number;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`absolute ${className ?? ""}`}
      style={
        {
          left: s.x(left),
          top: s.y(top),
          width: s.x(width),
          height: height === undefined ? "auto" : s.y(height),
          animationName: slideX || slideY ? "reveal-fade-slide" : "reveal-fade",
          animationDuration: `${beat.durationMs}ms`,
          animationDelay: `${beat.delayMs}ms`,
          animationTimingFunction: "ease-out",
          animationFillMode: "both",
          "--reveal-opacity": String(opacity),
          "--reveal-x": s.x(slideX),
          "--reveal-y": s.y(slideY),
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

function StatRow({
  left,
  top,
  width,
  beat,
  opacity,
  label,
  value,
}: {
  left: number;
  top: number;
  width: number;
  beat: Beat;
  opacity: number;
  label: string;
  value: string;
}) {
  return (
    <FadeSlide
      left={left}
      top={top}
      width={width}
      beat={beat}
      opacity={opacity}
      className="flex items-center justify-between whitespace-nowrap font-mono text-white"
      style={{
        fontSize: s.x(11.827),
        borderTop: "1.183px solid rgba(255,255,255,0.15)",
        paddingTop: s.y(8.279),
        paddingBottom: s.y(2.365),
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </FadeSlide>
  );
}

function CodeLine({
  beat,
  numberWidth,
  gap,
  opacity,
  numberLabel,
  brace,
}: {
  beat: Beat;
  numberWidth: number;
  gap: number;
  opacity: number;
  numberLabel: string;
  brace?: string;
}) {
  return (
    <div
      className="flex shrink-0 items-center overflow-hidden rounded-tr-[1.46px] rounded-br-[1.46px]"
      style={{
        gap: s.x(gap),
        animationName: "reveal-grow-width",
        animationDuration: `${beat.durationMs}ms`,
        animationDelay: `${beat.delayMs}ms`,
        animationTimingFunction: "ease-out",
        animationFillMode: "both",
        "--reveal-size": s.x(160.316),
        opacity,
      } as CSSProperties}
    >
      <p
        className="shrink-0 text-center font-mono text-white opacity-50"
        style={{ width: s.x(10.591), fontSize: s.x(8.826) }}
      >
        {numberLabel}
      </p>
      {numberWidth > 0 ? (
        <div
          className="shrink-0"
          style={{
            width: s.x(numberWidth),
            height: s.y(9.461),
            background: ROW_BG,
            border: ROW_BORDER,
            borderRadius: s.x(1.457),
          }}
        />
      ) : null}
      {brace ? (
        <p
          className="shrink-0 text-center font-mono text-white opacity-50"
          style={{ width: s.x(10.591), fontSize: s.x(8.826) }}
        >
          {brace}
        </p>
      ) : null}
    </div>
  );
}

function BorderVector({
  left,
  top,
  src,
}: {
  left: number;
  top: number;
  src: string;
}) {
  return (
    <div
      className="absolute"
      style={
        {
          left: s.x(left),
          top: s.y(top),
          animationName: "reveal-unfurl",
          animationDuration: `${VALUE_TIMING.borderVectors.durationMs}ms`,
          animationDelay: `${VALUE_TIMING.borderVectors.delayMs}ms`,
          animationTimingFunction: "ease-out",
          animationFillMode: "both",
          "--reveal-x": s.x(185.146),
          "--reveal-y": s.y(279.699),
          "--reveal-start-size": s.x(16.342),
          "--reveal-start-size-y": s.y(24.688),
          "--reveal-size": s.x(201.488),
          "--reveal-size-y": s.y(304.387),
        } as CSSProperties
      }
    >
      <Image src={src} alt="" fill className="pointer-events-none object-fill" />
    </div>
  );
}

/** Isometric card-stack "skew" wrapper shared by the four content cards. */
function CardTilt({ children }: { children: ReactNode }) {
  return <div style={{ transform: "rotate(-2deg) skewX(-15deg) scaleY(0.97)" }}>{children}</div>;
}

export function ValueIllustration({ active }: { active: boolean }) {
  const playKey = useReplayTrigger(active);

  return (
    <div
      key={playKey}
      className="relative size-full overflow-hidden border border-[#444] bg-[#282827]"
      style={{ containerType: "size" }}
    >
      {/* Big stacked card: grain texture + "25M+ Records" */}
      <div
        className="absolute overflow-hidden border-[0.826px] border-[rgba(0,0,0,0.13)]"
        style={
          {
            left: s.x(254),
            top: s.y(261),
            width: s.x(294.361),
            transform: "rotate(-2deg) skewX(-15deg) scaleY(0.97)",
            animationName: "reveal-grow-height",
            animationDuration: `${VALUE_TIMING.bigCard.durationMs}ms`,
            animationDelay: `${VALUE_TIMING.bigCard.delayMs}ms`,
            animationTimingFunction: "ease-out",
            animationFillMode: "both",
            "--reveal-size": s.y(307.278),
          } as CSSProperties
        }
      >
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-50"
          style={{
            backgroundImage: `url(${ASSET_PATH}/frame-texture.png)`,
            backgroundSize: `${s.x(576)} ${s.y(432)}`,
            backgroundPosition: "top left",
          }}
        />
        <FadeSlide
          left={6.31}
          top={269.62}
          width={178.153}
          beat={VALUE_TIMING.recordsLabel}
          opacity={0.6}
          className="font-mono font-light tracking-[-0.02em] text-[rgba(255,255,255,0.7)]"
          style={{ fontSize: s.x(21.563), lineHeight: 1.4 }}
        >
          25M+ Records
        </FadeSlide>
      </div>

      {/* Messages */}
      <FadeSlide
        left={213.11}
        top={242.98}
        width={321.492}
        height={283.376}
        beat={VALUE_TIMING.messagesContainer}
        slideX={18.35}
        slideY={26.18}
      >
        <Image src={CARD_FACE_A} alt="" fill className="pointer-events-none object-fill" />
        <div className="absolute" style={{ left: s.x(18.78), top: s.y(14.05), width: s.x(268.197), height: s.y(229.213) }}>
          <div className="flex h-full w-full items-center justify-center">
            <CardTilt>
              <div className="relative overflow-hidden" style={{ width: s.x(217.161), height: s.y(227.464) }}>
                {[
                  { left: 0.01, top: 8.39, width: 148.58, height: 37.184, background: ROW_BG, beat: VALUE_TIMING.msgBg1 },
                  { left: 83.035, top: 57.17, width: 134.126, height: 11.624, background: ROW_BG_BLUE, beat: VALUE_TIMING.msgBg2 },
                  { left: 0, top: 76.54, width: 132.274, height: 57.384, background: ROW_BG, beat: VALUE_TIMING.msgBg3 },
                  { left: 112.019, top: 142.39, width: 105.142, height: 11.624, background: ROW_BG_BLUE, beat: VALUE_TIMING.msgBg4 },
                  { left: 0, top: 161.73, width: 102.219, height: 12.32, background: ROW_BG, beat: VALUE_TIMING.msgBg5 },
                  { left: 0, top: 182.14, width: 148.545, height: 12.32, background: ROW_BG, beat: VALUE_TIMING.msgBg6 },
                ].map((row, i) => (
                  <FadeSlide key={i} left={row.left} top={row.top} width={row.width} height={row.height} beat={row.beat} slideY={10.83}>
                    <div className="absolute inset-0" style={{ background: row.background, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  </FadeSlide>
                ))}
                <StatRow left={0.2} top={205.15} width={217.366} beat={VALUE_TIMING.msgStats} opacity={0.64} label="Messages" value="32k+" />
              </div>
            </CardTilt>
          </div>
        </div>
      </FadeSlide>

      {/* Tickets */}
      <FadeSlide
        left={171.57}
        top={184.88}
        width={321.492}
        height={283.376}
        beat={VALUE_TIMING.ticketsContainer}
        slideX={26.61}
        slideY={33.16}
      >
        <Image src={CARD_FACE_B} alt="" fill className="pointer-events-none object-fill" />
        <div className="absolute" style={{ left: s.x(18.91), top: s.y(15.38), width: s.x(268.197), height: s.y(229.213) }}>
          <div className="flex h-full w-full items-center justify-center">
            <CardTilt>
              <div className="relative overflow-hidden" style={{ width: s.x(217.161), height: s.y(227.464) }}>
                {/* row 1 */}
                <FadeSlide left={0} top={0} width={217.629} height={70.961} beat={VALUE_TIMING.ticketRow1} slideY={10.83}>
                  <div className="absolute" style={{ left: s.x(0), top: s.y(0), width: s.x(105.259), height: s.y(70.961), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(9.47), top: s.y(9.46), width: s.x(86.336), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(9.47), top: s.y(21.29), width: s.x(73.326), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(9.47), top: s.y(33.12), width: s.x(73.326), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(86.35), top: s.y(50.86), width: s.x(11.827), height: s.y(11.827), background: ROW_BG_BLUE, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(112.37), top: s.y(0), width: s.x(105.259), height: s.y(70.961), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(121.83), top: s.y(9.46), width: s.x(66.23), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(121.83), top: s.y(21.29), width: s.x(81.605), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(121.83), top: s.y(33.12), width: s.x(73.326), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(195.15), top: s.y(50.86), width: s.x(11.827), height: s.y(11.827), background: ROW_BG_BLUE, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                </FadeSlide>

                {/* row 2 */}
                <FadeSlide left={0.02} top={78.06} width={217.629} height={70.961} beat={VALUE_TIMING.ticketRow2} slideY={10.83}>
                  <div className="absolute" style={{ left: s.x(0), top: s.y(0), width: s.x(105.259), height: s.y(70.961), background: "rgba(217,217,217,0.14)", border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(9.47), top: s.y(9.46), width: s.x(81.605), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(9.47), top: s.y(21.29), width: s.x(86.336), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(9.49), top: s.y(33.11), width: s.x(62.682), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(86.34), top: s.y(54.4), width: s.x(11.827), height: s.y(11.827), background: ROW_BG_BLUE, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(112.37), top: s.y(0), width: s.x(105.259), height: s.y(70.961) }}>
                    <Image src={`${ASSET_PATH}/ticket-icon.svg`} alt="" fill className="pointer-events-none object-contain" />
                  </div>
                </FadeSlide>

                {/* row 3 */}
                <FadeSlide left={0.01} top={156.11} width={217.629} height={41.394} beat={VALUE_TIMING.ticketRow3} slideY={10.83}>
                  <div className="absolute" style={{ left: s.x(0), top: s.y(0), width: s.x(105.259), height: s.y(41.394), background: "rgba(217,217,217,0.06)", border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ opacity: 0.72, left: s.x(9.47), top: s.y(10.65), width: s.x(86.336), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ opacity: 0.72, left: s.x(9.47), top: s.y(22.48), width: s.x(73.326), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ left: s.x(112.37), top: s.y(0), width: s.x(105.259), height: s.y(41.394), background: "rgba(217,217,217,0.06)", border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ opacity: 0.72, left: s.x(121.83), top: s.y(10.65), width: s.x(48.49), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                  <div className="absolute" style={{ opacity: 0.72, left: s.x(121.83), top: s.y(22.48), width: s.x(73.326), height: s.y(7.096), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                </FadeSlide>

                <StatRow left={0.21} top={205.15} width={217.366} beat={VALUE_TIMING.ticketStats} opacity={0.64} label="Tickets" value="720+" />
              </div>
            </CardTilt>
          </div>
        </div>
      </FadeSlide>

      {/* Documents */}
      <FadeSlide
        left={126.62}
        top={128.11}
        width={321.492}
        height={283.376}
        beat={VALUE_TIMING.documentsContainer}
        slideX={26.61}
        slideY={33.16}
      >
        <Image src={CARD_FACE_A} alt="" fill className="pointer-events-none object-fill" />
        <div className="absolute" style={{ left: s.x(18.93), top: s.y(14.2), width: s.x(268.197), height: s.y(229.213) }}>
          <div className="flex h-full w-full items-center justify-center">
            <CardTilt>
              <div className="relative overflow-hidden" style={{ width: s.x(217.161), height: s.y(227.464) }}>
                {[
                  { top: -0.48, opacity: 1, beat: VALUE_TIMING.docPlaceholder1, height: 50.855, lines: true },
                  { top: 57.47, opacity: 0.8, beat: VALUE_TIMING.docPlaceholder2, height: 50.855, lines: true },
                  { top: 115.42, opacity: 0.7, beat: VALUE_TIMING.docPlaceholder3, height: 50.855, lines: true },
                  { top: 173.37, opacity: 0.25, beat: VALUE_TIMING.docPlaceholder4, height: 18.504, lines: false },
                ].map((doc, i) => (
                  <FadeSlide key={i} left={0} top={doc.top} width={217.614} height={doc.height} beat={doc.beat} opacity={doc.opacity} slideY={10.83}>
                    <div className="absolute inset-0" style={{ background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                    {doc.lines ? (
                      <>
                        <div className="absolute" style={{ left: s.x(8.27), top: s.y(8.52), width: s.x(199.874), height: s.y(9.461), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                        <div className="absolute" style={{ left: s.x(8.28), top: s.y(23.89), width: s.x(152.566), height: s.y(9.461), background: ROW_BG, border: ROW_BORDER, borderRadius: s.x(1.457) }} />
                      </>
                    ) : null}
                  </FadeSlide>
                ))}
                <StatRow left={0.21} top={205.15} width={217.366} beat={VALUE_TIMING.docStats} opacity={0.64} label="Documents" value="258" />
              </div>
            </CardTilt>
          </div>
        </div>
      </FadeSlide>

      {/* Code */}
      <FadeSlide
        left={82.86}
        top={68.98}
        width={321.492}
        height={283.376}
        beat={VALUE_TIMING.codeContainer}
        slideX={26.61}
        slideY={33.16}
      >
        <Image src={CARD_FACE_B} alt="" fill className="pointer-events-none object-fill" />
        <div className="absolute" style={{ left: s.x(18.37), top: s.y(14.57), width: s.x(268.197), height: s.y(229.213) }}>
          <div className="flex h-full w-full items-center justify-center">
            <CardTilt>
              <div className="relative overflow-hidden" style={{ width: s.x(217.161), height: s.y(227.464) }}>
                <div className="absolute flex flex-col" style={{ left: s.x(0), top: s.y(0), width: s.x(202.878), gap: s.y(6.178) }}>
                  <CodeLine beat={VALUE_TIMING.codeLines[0]} numberWidth={139.133} gap={10.591} opacity={0.99} numberLabel="1" />
                  <CodeLine beat={VALUE_TIMING.codeLines[1]} numberWidth={101.089} gap={5.296} opacity={0.98} numberLabel="2" brace="{" />
                  <CodeLine beat={VALUE_TIMING.codeLines[2]} numberWidth={113.046} gap={10.591} opacity={0.79} numberLabel="3" />
                  <CodeLine beat={VALUE_TIMING.codeLines[3]} numberWidth={133.698} gap={14.122} opacity={0.65} numberLabel="4" />
                  <CodeLine beat={VALUE_TIMING.codeLines[4]} numberWidth={0} gap={5.296} opacity={0.64} numberLabel="5" brace="}" />
                  <CodeLine beat={VALUE_TIMING.codeLines[5]} numberWidth={150.05} gap={5.296} opacity={0.53} numberLabel="6" brace="{" />
                  <CodeLine beat={VALUE_TIMING.codeLines[6]} numberWidth={169.569} gap={10.591} opacity={0.49} numberLabel="7" />
                  <CodeLine beat={VALUE_TIMING.codeLines[7]} numberWidth={90.219} gap={10.591} opacity={0.48} numberLabel="8" />
                  <CodeLine beat={VALUE_TIMING.codeLines[8]} numberWidth={147.829} gap={17.652} opacity={0.47} numberLabel="9" />
                  <CodeLine beat={VALUE_TIMING.codeLines[9]} numberWidth={122.829} gap={21.182} opacity={0.41} numberLabel="10" />
                  <CodeLine beat={VALUE_TIMING.codeLines[10]} numberWidth={104.35} gap={14.122} opacity={0.37} numberLabel="11" />
                  <CodeLine beat={VALUE_TIMING.codeLines[11]} numberWidth={136.959} gap={10.591} opacity={0.28} numberLabel="12" />
                  <CodeLine beat={VALUE_TIMING.codeLines[12]} numberWidth={0} gap={5.296} opacity={0.27} numberLabel="13" brace="}" />
                </div>
                <StatRow left={0.2} top={205.15} width={217.366} beat={VALUE_TIMING.codeFooter} opacity={0.64} label="Code" value="25k+" />
              </div>
            </CardTilt>
          </div>
        </div>
      </FadeSlide>

      {/* Growing frame-edge vectors */}
      <BorderVector left={16.64} top={266.25} src={`${ASSET_PATH}/border-vector-left.svg`} />
      <BorderVector left={310.43} top={255.92} src={`${ASSET_PATH}/border-vector-mid.svg`} />
      <BorderVector left={379.46} top={-42.44} src={`${ASSET_PATH}/border-vector-right.svg`} />

      {/* "8M Indicated value" chip */}
      <div className="absolute flex items-center justify-center" style={{ left: s.x(43), top: s.y(558.2988), width: s.x(309.904), height: s.y(72.178) }}>
        <CardTilt>
          <FadeSlide
            left={0}
            top={0}
            width={295.804}
            height={63.481}
            beat={VALUE_TIMING.indicator}
            slideY={10}
            className="flex items-center justify-between overflow-hidden border border-dashed border-[#646464]"
            style={{ paddingLeft: s.x(10.486), paddingRight: s.x(10.486), paddingTop: s.y(4.194), paddingBottom: s.y(6) }}
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(172,188,187,0.3)" }} />
            <div
              className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-90"
              style={{
                backgroundImage: `url(${ASSET_PATH}/indicator-texture.png)`,
                backgroundSize: `${s.x(339)} ${s.y(254)}`,
                backgroundPosition: "top left",
              }}
            />
            <p className="relative font-serif-accent leading-none text-white" style={{ fontSize: s.x(32.875) }}>
              8M
            </p>
            <p
              className="relative text-right font-mono font-light text-white opacity-60"
              style={{ fontSize: s.x(12.583), lineHeight: 1.4 }}
            >
              Indicated value
            </p>
            <div className="absolute flex items-center justify-center" style={{ left: s.x(-5.06), top: s.y(43.2), width: s.x(304.651), height: s.y(30.392) }}>
              <div
                className="relative"
                style={{
                  width: s.x(297.629),
                  height: s.y(18.98),
                  transform: "rotate(2.05deg) scaleX(1.01) scaleY(1.03) skewX(14.74deg)",
                }}
              >
                <Image src={`${ASSET_PATH}/indicator-bar.svg`} alt="" fill className="pointer-events-none object-fill" />
              </div>
            </div>
          </FadeSlide>
        </CardTilt>
      </div>

      {/* Decorative overlays sit above every card, matching Figma's top-of-stack layer order */}
      <Image
        src={`${ASSET_PATH}/bricks-pattern.svg`}
        alt=""
        fill
        className="pointer-events-none object-fill"
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${ASSET_PATH}/grain-overlay.png)`,
          backgroundSize: `${s.x(222)} ${s.y(222)}`,
        }}
      />
    </div>
  );
}
