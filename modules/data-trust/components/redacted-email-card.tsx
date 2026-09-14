import {
  DATA_TRUST_CARD_BACKDROP,
  DATA_TRUST_CARD_BACKDROP_SIZE,
  DATA_TRUST_REDACTION_TEXTURE,
  DATA_TRUST_REDACTION_TEXTURE_SIZE,
} from "../lib/assets";
import {
  cq,
  EMAIL_CARD_HEIGHT,
  EMAIL_CARD_WIDTH,
  REDACTION_BARS,
  SCAN_GLOW,
} from "../lib/redacted-email";
import { RedactedEmailMessage } from "./redacted-email-message";

/**
 * A customer email with a scan line partway across it: everything to the left
 * is the record as it arrived, everything to the right is the same record with
 * the identifying spans struck out.
 *
 * The card is an inline-size container, so the whole composition - type
 * included - scales with the width it is handed instead of needing a separate
 * set of sizes per breakpoint.
 */
export function RedactedEmailCard({ className }: { className?: string }) {
  return (
    <div
      className={`relative w-full ${className ?? ""}`}
      style={{ containerType: "inline-size" }}
      aria-hidden
    >
      <div
        className="relative w-full overflow-hidden border-white/50"
        style={{
          aspectRatio: `${EMAIL_CARD_WIDTH} / ${EMAIL_CARD_HEIGHT}`,
          borderWidth: cq(1.294),
        }}
      >
        <div className="absolute inset-0 bg-white/15" />
        <div
          className="absolute inset-0 opacity-18 backdrop-blur-[2px]"
          style={{
            backgroundImage: `url("${DATA_TRUST_CARD_BACKDROP}")`,
            backgroundSize: DATA_TRUST_CARD_BACKDROP_SIZE,
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-white/50"
          style={{
            width: cq(548.706),
            height: cq(456.824),
            borderWidth: cq(0.559),
          }}
        />

        {/* the record as it arrived */}
        <div
          className="absolute left-1/2 -translate-x-1/2 opacity-78"
          style={{ top: cq(44.51), width: cq(491.871) }}
        >
          <RedactedEmailMessage />
        </div>

        {/* the cleaned half, clipped to everything right of the scan line */}
        <div
          className="absolute overflow-hidden bg-white/12"
          style={{
            left: cq(284.71),
            top: cq(9.93),
            width: cq(274.353),
            height: cq(456.824),
          }}
        >
          <div
            className="absolute"
            style={{ right: cq(29.2), top: cq(34.63), width: cq(491.871) }}
          >
            <RedactedEmailMessage />

            {REDACTION_BARS.map((bar) => (
              <div
                key={`${bar.x}-${bar.y}`}
                className="absolute bg-[#d9d9d9]"
                style={{
                  left: cq(bar.x),
                  top: cq(bar.y),
                  width: cq(bar.width),
                  height: cq(bar.height),
                }}
              >
                <div
                  className="absolute inset-0 mix-blend-multiply"
                  style={{
                    backgroundImage: `url("${DATA_TRUST_REDACTION_TEXTURE}")`,
                    backgroundSize: DATA_TRUST_REDACTION_TEXTURE_SIZE,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="absolute inset-y-0 left-0"
            style={{ width: cq(71.5), background: SCAN_GLOW }}
          />
        </div>

        {/* the scan line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-white"
          style={{ top: cq(9.93), bottom: cq(9.48), width: cq(2.588) }}
        />
      </div>
    </div>
  );
}
