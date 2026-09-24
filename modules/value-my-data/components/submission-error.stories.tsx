import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mocked } from "storybook/test";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { useValueMyDataForm } from "../hooks/use-value-my-data-form";
import { submissionErrorState } from "../lib/submission-error-story";
import { FormVerification } from "./form-verification";
import { ValueMyDataForm } from "./value-my-data-form";

const meta = {
  title: "Value my data/Submission error",
  args: { width: 680 },
  parameters: { viewport: { options: MINIMAL_VIEWPORTS } },
  argTypes: { width: { control: { type: "range", min: 320, max: 1000, step: 20 } } },
  beforeEach: () => {
    mocked(useValueMyDataForm).mockReturnValue(submissionErrorState());
    // Keep the production widget's reserved space without loading Turnstile.
    mocked(FormVerification).mockImplementation(() => <div className="min-h-[65px]" />);
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Company name", { exact: true }), "Acme Inc.");
    await userEvent.type(canvas.getByLabelText("Work email", { exact: true }), "alex@example.com");
    await userEvent.selectOptions(canvas.getByLabelText("Years of Operation", { exact: true }), "3 to 5 years");
    await userEvent.selectOptions(canvas.getByLabelText("Number of people who work in the business", { exact: true }), "20 - 49");
    await userEvent.selectOptions(canvas.getByLabelText("Share of internal communications in english", { exact: true }), "100%");
  },
  render: ({ width }) => (
    <div className="min-h-screen bg-[#fcfcfc] px-4 py-10">
      <div className="mx-auto w-full" style={{ maxWidth: width }}>
        <ValueMyDataForm />
      </div>
    </div>
  ),
} satisfies Meta<{ width: number }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NetworkFailure: Story = {};
export const Mobile: Story = { globals: { viewport: { value: "mobile2", isRotated: false } } };
