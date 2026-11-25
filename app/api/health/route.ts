/**
 * Tiny keep-alive endpoint. An uptime monitor (UptimeRobot, cron-job.org…) pings
 * this every few minutes so Render's free instance never goes to sleep.
 * Cheaper than loading the full page and doesn't count as a page view.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("ok", {
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
  });
}

export function HEAD() {
  return new Response(null, { headers: { "Cache-Control": "no-store" } });
}
