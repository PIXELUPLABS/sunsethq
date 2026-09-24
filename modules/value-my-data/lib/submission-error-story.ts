import type { useValueMyDataForm } from "../hooks/use-value-my-data-form";

// This fixture is imported only by Storybook; no lead request is sent.
export function submissionErrorState(): ReturnType<typeof useValueMyDataForm> {
  return {
    isSubmitted: false,
    booking: null,
    isSubmitting: false,
    error: "We couldn’t confirm receipt. Your answers are saved in this tab—please try again.",
    handleSubmit: async event => { event.preventDefault(); },
    formRef: { current: null },
    resultRef: { current: null },
    verification: {
      containerRef: { current: null }, token: "storybook-only", canSubmit: true,
      fallbackReason: undefined, verificationError: "",
      onReady: () => {}, onError: () => {}, reset: () => {},
    },
  };
}
