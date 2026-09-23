import { FormGrainTexture, FormGuideLine } from "./form-decoration";

export function ThankYouResult() {
  return (
    <div role="status" className="relative flex min-h-[420px] flex-col items-center justify-center gap-3 overflow-hidden bg-white p-10 text-center shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)]">
      <FormGrainTexture />
      <FormGuideLine />
      <p className="relative font-serif text-2xl text-black">Thank you for your interest.</p>
      <p className="relative max-w-[360px] text-sm leading-[1.5] text-[#727272]">
        We&rsquo;ll reach out if it&rsquo;s a fit.
      </p>
    </div>
  );
}
