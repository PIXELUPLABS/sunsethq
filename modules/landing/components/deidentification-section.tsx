import { SectionTag } from "./section-tag";
import { RedactedEmailPreview } from "./redacted-email-preview";
import { DeidentificationTabs } from "./deidentification-tabs";

export function DeidentificationSection() {
  return (
    <section id="de-identification" className="flex justify-center bg-white px-6 py-20 sm:px-18">
      <div className="flex w-full max-w-[1296px] flex-col gap-20 border-x border-b border-dashed border-[#d4d4d4] p-5 sm:p-10">
        <div className="flex flex-col items-start gap-6">
          <SectionTag label="The Process" />
          <h2 className="font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px]">
            De-Identification
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 bg-[#eaebf1] p-6 lg:grid-cols-2 lg:gap-10 lg:p-10">
          <div className="flex flex-col justify-center gap-14">
            <h3 className="font-serif text-3xl leading-tight tracking-tight text-black sm:text-[40px]">
              Your data leaves cleaner than a medical record.
            </h3>
            <div className="flex flex-col gap-2 text-base leading-relaxed tracking-tight text-[#727272]">
              <p>
                The federal standard for de-identifying medical records
                (HIPAA) lists eighteen categories that have to be stripped
                out. We cover all eighteen, and many more.
              </p>
              <p>
                Names, emails, API keys, access tokens, customer records. Our
                de-identification covers 60+ categories, across every file
                type and application your business works in.
              </p>
            </div>
          </div>

          <div className="bg-brand-gradient min-h-[420px] p-6 sm:p-10">
            <RedactedEmailPreview />
          </div>
        </div>

        <DeidentificationTabs />
      </div>
    </section>
  );
}
