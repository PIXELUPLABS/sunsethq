export const EMAIL_CARD_WIDTH = 572;
export const EMAIL_CARD_HEIGHT = 480.118;

export const EMAIL_BODY_WIDTH = 491.871;

export function cq(value: number) {
  return `${((value / EMAIL_CARD_WIDTH) * 100).toFixed(4)}cqw`;
}

export const EMAIL_HEADER_ROWS = [
  { label: "From:", value: "Sarah Chen" },
  { label: "To:", value: "Sarah@acme.com" },
  { label: "Subject:", value: "June invoice — account 483920" },
];

type EmailSegment = { text: string; strong?: boolean };

export const EMAIL_PARAGRAPHS: EmailSegment[][] = [
  [{ text: "Hi " }, { text: "Daniel,", strong: true }],
  [
    {
      text: "Could you update the account to use Priya Shah as the billing contact and resend the invoice to ",
    },
    { text: "priya.shah@acme.com?", strong: true },
  ],
  [
    {
      text: "For reference, the account ID is ACC-483920 and the invoice number is ",
    },
    { text: "INV-20481.", strong: true },
  ],
  [
    { text: "API Key: " },
    { text: "sk_live_51H8rQ2eZvKYl", strong: true },
    { text: "o2C1H8xP9m" },
  ],
  [
    { text: "Thanks,\n" },
    {
      text: "Sarah Chen\nDirector of Operations\nAcme Corp\n+1 415 555 0199",
      strong: true,
    },
  ],
];

export const REDACTION_BARS = [
  { x: 92.51, y: -1.65, width: 83.035, height: 18.746 },
  { x: 92.51, y: 24.22, width: 123.367, height: 18.746 },
  { x: 92.51, y: 49.2, width: 244.362, height: 18.746 },
  { x: 20.11, y: 98.9, width: 54.566, height: 17.191 },
  { x: 282.34, y: 141.06, width: 83.035, height: 17.199 },
  { x: 256.95, y: 160.34, width: 194.54, height: 17.199 },
  { x: 237.26, y: 198.09, width: 106.76, height: 17.199 },
  { x: 0, y: 217.54, width: 87.78, height: 17.199 },
  { x: 69.04, y: 257.44, width: 289.438, height: 17.199 },
  { x: 0, y: 318.89, width: 90.153, height: 16.208 },
  { x: 0, y: 336.82, width: 170.816, height: 16.208 },
  { x: 0, y: 355.37, width: 85.408, height: 16.208 },
  { x: 0, y: 373.48, width: 125.739, height: 16.208 },
];

export const SCAN_GLOW =
  "linear-gradient(to right, #499df8 0%, rgba(73,157,248,0.2933) 54.81%, rgba(73,157,248,0) 100%)";
