# Misanti — The Under 1M Media Vendor List

Standalone landing site for the Under 1M Media Vendor List, styled on the main Misanti
site (same colour tokens, Cormorant Garamond + Jost, grain + gold icon field).

## Run

    npm install
    npm run dev        # http://localhost:3100

## Pages

- `/` — landing page (hero, video, what you've tried, what you get + sample entry,
  how to get the list, 72-hour promise, FAQ, final CTA with live countdown)
- `/thank-you` — shown after joining; personalised with first name/email and a
  prefilled WhatsApp message

## Editing

- All copy, prices, dates and contact details: `lib/content.ts`
- Release date for the countdown: `RELEASE_DATE_ISO` in `lib/content.ts`
- Styles: `app/globals.css`

## Environment (see `.env.example`)

- `WAITLIST_WEBHOOK_URL` — signups are POSTed here as JSON (Google Sheet via Apps
  Script, Zapier, Make…). Without it, signups go to `data/waitlist.jsonl`, which only
  works locally — set the webhook before deploying to Vercel.
- `NEXT_PUBLIC_VIDEO_URL` — YouTube/Vimeo embed URL or .mp4 for the video block.
