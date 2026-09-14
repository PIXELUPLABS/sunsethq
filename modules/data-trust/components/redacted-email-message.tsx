import {
  cq,
  EMAIL_HEADER_ROWS,
  EMAIL_PARAGRAPHS,
} from "../lib/redacted-email";

/**
 * The message itself. It is rendered twice - once as the original, once inside
 * the cleaned half where the redaction bars are laid over it - so both halves
 * line up exactly.
 */
export function RedactedEmailMessage() {
  return (
    <div
      className="flex flex-col"
      style={{ gap: cq(29.88), letterSpacing: cq(-0.2324) }}
    >
      <div
        className="flex items-center uppercase"
        style={{ gap: cq(13.942), fontSize: cq(13.942), lineHeight: 1.3 }}
      >
        <div
          className="flex flex-col font-mono text-white/60"
          style={{ gap: cq(6.971), width: cq(79.003) }}
        >
          {EMAIL_HEADER_ROWS.map((row) => (
            <p key={row.label}>{row.label}</p>
          ))}
        </div>
        <div
          className="flex flex-col font-mono font-medium whitespace-nowrap text-white/85"
          style={{ gap: cq(6.971) }}
        >
          {EMAIL_HEADER_ROWS.map((row) => (
            <p key={row.label}>{row.value}</p>
          ))}
        </div>
      </div>

      <div className="text-white/60" style={{ fontSize: cq(17.074) }}>
        {EMAIL_PARAGRAPHS.map((paragraph, index) => (
          <p
            key={paragraph[0].text}
            className="leading-[1.1] whitespace-pre-line"
            style={{
              marginBottom:
                index === EMAIL_PARAGRAPHS.length - 1 ? 0 : cq(21.3425),
            }}
          >
            {paragraph.map((segment) =>
              segment.strong ? (
                <span
                  key={segment.text}
                  className="font-medium text-white/85"
                >
                  {segment.text}
                </span>
              ) : (
                <span key={segment.text}>{segment.text}</span>
              ),
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
