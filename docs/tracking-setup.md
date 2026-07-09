# VİS VİZE — Tracking Setup (GTM + GA4 + Google Ads)

This site pushes structured **`vis_*` dataLayer events**. Google Tag Manager
listens to them and forwards to GA4 and Google Ads. **No GA4 measurement ID or
Google Ads conversion label is hardcoded in the website** — they live in GTM.

- Website code: `src/lib/tracking/*`, `src/components/GoogleTagManager.tsx`,
  `src/components/TrackingAutoEvents.tsx`.
- GTM is installed **once** (root layout). gtag.js is **not** loaded directly
  (that would double-count conversions).

## Environment variable

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

If unset, GTM renders nothing (safe for dev/preview). GA4/Ads IDs are configured
**inside GTM**, never in the app.

## Event map (source of truth)

| dataLayer event          | Fires when                              | GA4 event           | Google Ads conversion          | Priority        |
| ------------------------ | --------------------------------------- | ------------------- | ------------------------------ | --------------- |
| `vis_lead_submit`        | Confirmed successful form submit only   | `generate_lead`     | VIS \| Website Form Submit     | Primary         |
| `vis_form_start`         | First interaction with a lead form      | `form_start`        | VIS \| Form Start (optional)   | Secondary       |
| `vis_phone_click`        | Click a `tel:` link                     | `phone_click`       | VIS \| Website Phone Click     | Primary         |
| `vis_whatsapp_click`     | Click a WhatsApp link                   | `whatsapp_click`    | VIS \| WhatsApp Click          | Secondary first |
| `vis_email_click`        | Click a `mailto:` link                  | `email_click`       | VIS \| Email Click (optional)  | Secondary       |
| `vis_contact_page_view`  | Contact page mounts                     | `contact_page_view` | VIS \| Contact Page View (opt) | Secondary       |

Google-Ads-asset conversions **need no website code**: `VIS | Google Lead Form
Submit`, `VIS | Call From Ads`.

Every event also carries: `event_id`, `event_time`, `page_location`,
`page_path`, `page_title`, and any captured `utm_*` / `gclid` / `gbraid` /
`wbraid`. `event_id` is used to de-duplicate conversions in GTM/Ads.

---

## A) Data Layer Variables to create in GTM

Create a **Data Layer Variable** for each (Variable name → Data Layer Variable Name):

```
event_id                 → event_id
form_id                  → form_id
form_name                → form_name
country                  → country
visa_type                → visa_type
lead_type                → lead_type
click_url                → click_url
click_text               → click_text
phone_number             → phone_number
whatsapp_number          → whatsapp_number
email                    → email
utm_source               → utm_source
utm_medium               → utm_medium
utm_campaign             → utm_campaign
utm_term                 → utm_term
utm_content              → utm_content
gclid                    → gclid
gbraid                   → gbraid
wbraid                   → wbraid
user_data.email          → user_data.email
user_data.phone_number   → user_data.phone_number
user_data.first_name     → user_data.first_name
user_data.last_name      → user_data.last_name
```

(GTM supports dotted paths like `user_data.email` as the Data Layer Variable Name.)

## B) Triggers to create

Custom Event triggers (Trigger type: **Custom Event**, Event name = exact string):

```
vis_lead_submit
vis_form_start
vis_phone_click
vis_whatsapp_click
vis_email_click
vis_contact_page_view
```

## C) GA4 Event tags

First create a **GA4 Configuration** tag (your GA4 Measurement ID) firing on
Initialization / All Pages. Then one **GA4 Event** tag per trigger:

| GA4 Event name       | Trigger                   | Suggested event params (from DLV)              |
| -------------------- | ------------------------- | ---------------------------------------------- |
| `generate_lead`      | `vis_lead_submit`         | form_id, form_name, country, visa_type, lead_type, event_id |
| `form_start`         | `vis_form_start`          | form_id, form_name, country, visa_type         |
| `phone_click`        | `vis_phone_click`         | click_url, click_text, page_path               |
| `whatsapp_click`     | `vis_whatsapp_click`      | click_url, click_text, page_path               |
| `email_click`        | `vis_email_click`         | click_url, click_text                          |
| `contact_page_view`  | `vis_contact_page_view`   | page_path                                      |

**Never** map `user_data.*`, `email`, or `phone_number` PII into GA4 event
parameters. Those are for Google Ads Enhanced Conversions only (section E).

## D) Google Ads Conversion tags

Create a **Google Ads Conversion Tracking** tag per conversion. Fill the
**Conversion ID** and **Conversion Label** from Google Ads (Tools → Conversions).

| Ads conversion tag           | Trigger              | Conversion ID   | Conversion Label |
| ---------------------------- | -------------------- | --------------- | ---------------- |
| VIS \| Website Form Submit   | `vis_lead_submit`    | _from Google Ads_ | _from Google Ads_ |
| VIS \| Website Phone Click   | `vis_phone_click`    | _from Google Ads_ | _from Google Ads_ |
| VIS \| WhatsApp Click        | `vis_whatsapp_click` | _from Google Ads_ | _from Google Ads_ |

Optional secondary Ads conversion tags: `VIS | Form Start` (`vis_form_start`),
`VIS | Contact Page View` (`vis_contact_page_view`), `VIS | Email Click`
(`vis_email_click`).

Set the tag's **Transaction ID / order ID** to `{{event_id}}` where available so
Google Ads de-duplicates.

## E) Enhanced Conversions (Website Form Submit ONLY)

1. In Google Ads, enable **Enhanced Conversions for leads** on `VIS | Website
   Form Submit` (accept the terms).
2. In GTM add a **Google Ads User-Provided Data** tag:
   - User data: choose **Manual configuration** and map:
     - Email → `{{user_data.email}}`
     - Phone → `{{user_data.phone_number}}`
     - First name → `{{user_data.first_name}}`
     - Last name → `{{user_data.last_name}}`
   - Trigger: `vis_lead_submit`.
3. The website already normalizes this data (email lowercased/trimmed, Turkish
   phones to E.164 `+90XXXXXXXXXX`) before pushing to the dataLayer.
4. Do **not** send this data to GA4.

## F) Google Ads primary / secondary settings

**Primary** (Google Ads → Conversions → set as *Primary*):
- VIS | Website Form Submit
- VIS | Google Lead Form Submit
- VIS | Call From Ads
- VIS | Website Phone Click

**Secondary**:
- VIS | WhatsApp Click
- VIS | Form Start
- VIS | Contact Page View
- VIS | Email Click

## G) Testing checklist

1. Open GTM **Preview Mode** (Tag Assistant) against the site.
2. Submit a test lead form.
3. Confirm `vis_form_start` fires **once**.
4. Confirm `vis_lead_submit` fires **only after** a successful submit (not on
   click, not on validation error, not on a server error).
5. Confirm GA4 `generate_lead` fires.
6. Confirm the **VIS | Website Form Submit** Ads tag fires.
7. Click a phone number → confirm `vis_phone_click` fires.
8. Click WhatsApp → confirm `vis_whatsapp_click` fires.
9. Check **GA4 DebugView**.
10. After publishing GTM, check **Google Ads → Conversions → Diagnostics**.

### Local debugging without GTM

In the browser console:

```js
window.visTrackingDebug = true;
```

Every dataLayer push is then logged as a readable table (also always logged in
`NODE_ENV=development`). Inspect the raw queue with `window.dataLayer`.

## H) Consent Mode (later)

Google Consent Mode is **not** wired yet. To add it:

1. Before GTM loads, push default consent (a `beforeInteractive` inline script
   or a GTM "Consent Initialization" trigger) — see the comment in
   `src/components/GoogleTagManager.tsx`.
2. Update consent from the cookie-consent UI (`gtag('consent','update',…)`).
3. Configure GTM tags to respect consent (Additional consent checks).

Basic form functionality and lead submission must **never** be blocked by
consent state.

## Where things live in the code

| Concern                    | File                                          |
| -------------------------- | --------------------------------------------- |
| GTM install (script + noscript) | `src/components/GoogleTagManager.tsx`    |
| dataLayer push + event base | `src/lib/tracking/dataLayer.ts`              |
| Typed event helpers         | `src/lib/tracking/events.ts`                 |
| UTM / click-id capture      | `src/lib/tracking/utm.ts`                    |
| Auto tel/WhatsApp/mailto    | `src/components/TrackingAutoEvents.tsx`       |
| Form start hook             | `src/hooks/useFormStart.ts`                   |
| Lead submit (fires on success) | `src/hooks/useLeadSubmit.ts`              |
| Contact page view           | `src/components/tracking/ContactPageView.tsx` |
