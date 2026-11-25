"use client";

import { useEffect, useState } from "react";
import { Countdown, MotionInit } from "@/components/Interactive";
import { Wordmark } from "@/components/Wordmark";
import { contact, thankYou, whatsappLink } from "@/lib/content";

export function ThankYou() {
  const [who, setWho] = useState<{ firstName: string; email: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const raw = sessionStorage.getItem("misanti-waitlist");
      if (raw) setWho(JSON.parse(raw));
    } catch {
      /* no storage — generic copy is shown */
    }
  }, []);

  const name = who?.firstName?.trim();
  const message = `Hello Misanti, I joined the waitlist for the Under 1M Media Vendor List.${
    name ? ` My name is ${name}.` : ""
  }`;

  return (
    <main className="ty">
      <MotionInit />
      <div className="iconfield" aria-hidden="true" />
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <i key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="ty-card">
        <a href="/" className="ty-brand" aria-label="Back to the Misanti landing page">
          <Wordmark className="ty-mark" />
        </a>

        <div className="ty-check reveal" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="24" />
            <path d="M15 27l7 7 15-16" />
          </svg>
        </div>

        <h1 className="reveal">
          {name ? (
            <>
              {name}, <em>you are on the list.</em>
            </>
          ) : (
            thankYou.heading
          )}
        </h1>
        <p className="ty-sub reveal">{thankYou.sub}</p>

        <div className="reveal">
          <a className="btn btn-wa btn-shine" href={whatsappLink(message)} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"
              />
            </svg>
            {thankYou.button}
          </a>
          <p className="ty-note">
            So our message reaches you on 6 December, and so you can ask us anything before then.
            {who?.email ? (
              <>
                {" "}
                Prefer email? We will also write to you at <b>{who.email}</b>.
              </>
            ) : (
              " Prefer email? We will also write to you at the address you gave us."
            )}
          </p>
        </div>

        <div className="ty-block reveal">
          <span className="eyebrow">What happens next</span>
          <ol className="ty-steps">
            {thankYou.next.map((s, i) => (
              <li key={s} className={i === 0 ? "now" : ""}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Countdown compact />
        </div>

        <div className="ty-block reveal">
          <span className="eyebrow">Questions?</span>
          <p>
            WhatsApp{" "}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="ink-link">
              {contact.whatsappDisplay}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${contact.email}`} className="ink-link">
              {contact.email}
            </a>
            . We reply within 24 hours.
          </p>
        </div>

        <a href="/" className="ty-back">
          ← Back to the list page
        </a>
      </div>
    </main>
  );
}
