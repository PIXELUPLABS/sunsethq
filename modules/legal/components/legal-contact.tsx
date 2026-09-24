export function LegalContact({ email }: { email: string }) {
  return (
    <address>
      Sunsets HQ Corp.<br />
      55 Washington Street, STE 552<br />
      Brooklyn, NY 11201<br />
      Email: <a href={`mailto:${email}`}>{email}</a>
    </address>
  );
}
