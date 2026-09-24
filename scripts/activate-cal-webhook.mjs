import { activateCalWebhook } from "./cal-webhook-release.mjs";

await activateCalWebhook(process.env.CAL_COM_API_KEY);
