import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BookingResult } from "./booking-result";
import { ThankYouResult } from "./thank-you-result";

type SubmittedFormArgs = {
  state: "Calendar" | "Thank you";
  width: number;
  email: string;
};

const meta = {
  title: "Value my data/Submitted form",
  args: { state: "Calendar", width: 680, email: "" },
  argTypes: {
    state: { control: "radio", options: ["Calendar", "Thank you"] },
    width: { control: { type: "range", min: 320, max: 1000, step: 20 } },
    email: { control: "text", description: "Optional email prefill for the live Cal calendar." },
  },
  render: ({ state, width, email }) => (
    <div className="min-h-screen bg-[#fcfcfc] px-4 py-10">
      <div className="mx-auto w-full" style={{ maxWidth: width }}>
        {state === "Calendar" ? (
          <BookingResult bookingUrl="https://replaydata.cal.com/sales/data-valuation" email={email} />
        ) : <ThankYouResult />}
      </div>
    </div>
  ),
} satisfies Meta<SubmittedFormArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Calendar: Story = {};
export const ThankYou: Story = { args: { state: "Thank you" } };
