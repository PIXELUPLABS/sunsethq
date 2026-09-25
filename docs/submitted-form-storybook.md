# Submitted form design preview

Run `npm run storybook`, then open [Submitted form — Calendar](http://127.0.0.1:6006/?path=/story/value-my-data-submitted-form--calendar). Choose **Thank You** in the sidebar for the nonqualifying result. The controls also switch states, adjust the card width, and change the calendar's email prefill. Both stories render the same components used by the website, with the site's stylesheet and fonts. Source edits appear through hot reload.

The stories render results directly: no form submission, Turnstile challenge, or Attio write is involved. The Calendar story loads the live Sales Cal event; completing a booking there would create a real meeting. Leave the email empty unless testing prefill.

[Submission error — Network Failure](http://127.0.0.1:6006/?path=/story/value-my-data-submission-error--network-failure) shows the real form with retained sample answers and the network/timeout error above the submit button. **Mobile** shows the same state in a narrower card. These stories mock the form hook and verification widget; clicking submit does not send a request.

- Booking layout: `modules/value-my-data/components/booking-result.tsx`
- Calendar embed: `modules/value-my-data/components/cal-booking.tsx`
- Thank-you layout: `modules/value-my-data/components/thank-you-result.tsx`
- Stories and controls: `modules/value-my-data/components/submitted-form.stories.tsx`

`npm run storybook:build` creates an ignored `storybook-static/` export. Storybook is a local development tool and is not included in the website's production routes or deployment.
