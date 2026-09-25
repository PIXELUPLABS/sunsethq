import type { Preview } from "@storybook/nextjs-vite";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { sb } from "storybook/test";
import "../app/globals.css";

sb.mock("../modules/value-my-data/hooks/use-value-my-data-form.ts", { spy: true });
sb.mock("../modules/value-my-data/components/form-verification.tsx", { spy: true });

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const serif = localFont({
  src: "../public/fonts/stk-bureau-serif-book.woff2",
  variable: "--font-serif",
  weight: "400",
  style: "normal",
  display: "swap",
});

const preview: Preview = {
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  decorators: [(Story) => (
    <div className={`${sans.variable} ${serif.variable} font-sans antialiased`}>
      <Story />
    </div>
  )],
};

export default preview;
