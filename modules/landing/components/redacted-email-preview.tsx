function Pii({ children }: { children: string }) {
  return <span className="rounded-sm bg-white/25 px-1 text-white/95">{children}</span>;
}

export function RedactedEmailPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-6 border border-white/50 bg-white/10 p-8 font-mono text-[13px] leading-relaxed text-white/60 backdrop-blur-sm">
      <div className="flex flex-col gap-1.5 uppercase">
        <p>
          From: <Pii>Sarah Chen</Pii>
        </p>
        <p>
          To: <Pii>Sarah@acme.com</Pii>
        </p>
        <p>
          Subject: <Pii>June invoice — account 483920</Pii>
        </p>
      </div>

      <div className="flex flex-col gap-4 normal-case">
        <p>
          Hi <Pii>Daniel</Pii>,
        </p>
        <p>
          Could you update the account to use Priya Shah as the billing
          contact and resend the invoice to{" "}
          <Pii>priya.shah@acme.com</Pii>?
        </p>
        <p>
          For reference, the account ID is ACC-483920 and the invoice number
          is <Pii>INV-20481.</Pii>
        </p>
        <p>
          API Key: <Pii>sk_live_51H8rQ2eZvKYl</Pii>o2C1H8xP9m
        </p>
        <p>
          Thanks,
          <br />
          <Pii>Sarah Chen</Pii>
          <br />
          Director of Operations
          <br />
          Acme Corp
          <br />
          +1 415 555 0199
        </p>
      </div>
    </div>
  );
}
