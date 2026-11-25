"use client";

import { useEffect, useState } from "react";
import { RELEASE_DATE_ISO } from "@/lib/content";
import { CtaButton } from "./Waitlist";

/* ------------------------------------------------------------------ */
/*  Scroll reveal + header state + progress bar + parallax            */
/*  (same reveal mechanics as misanti.html: IO, 0.12s sibling stagger) */
/* ------------------------------------------------------------------ */

export function MotionInit() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const all = document.querySelectorAll<HTMLElement>(".reveal, .draw");

    if (reduced) {
      all.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const sibs = el.parentElement
              ? Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"))
              : [];
            const i = Math.max(0, sibs.indexOf(el));
            if (!el.style.transitionDelay) el.style.transitionDelay = `${Math.min(i, 6) * 0.12}s`;
            el.classList.add("in");
            io.unobserve(el);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      all.forEach((el) => io.observe(el));
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = root.scrollHeight - window.innerHeight;
        root.style.setProperty("--progress", String(max > 0 ? y / max : 0));
        root.classList.toggle("scrolled", y > 40);
        if (!reduced) root.style.setProperty("--sy", String(y));

        // Timeline fill for "How to get the list"
        const tl = document.querySelector<HTMLElement>(".timeline");
        if (tl) {
          const r = tl.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
          tl.style.setProperty("--fill", String(p));
          tl.querySelectorAll<HTMLElement>(".step").forEach((s) => {
            const sr = s.getBoundingClientRect();
            s.classList.toggle("lit", sr.top < window.innerHeight * 0.65);
          });
        }
        // Sticky mobile bar: hide when the final CTA is on screen
        const final = document.getElementById("join");
        if (final) {
          const fr = final.getBoundingClientRect();
          root.classList.toggle("final-visible", fr.top < window.innerHeight && fr.bottom > 0);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="progress" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Live countdown to the list release                                 */
/* ------------------------------------------------------------------ */

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor(ms / 3_600_000) % 24,
    m: Math.floor(ms / 60_000) % 60,
    s: Math.floor(ms / 1000) % 60,
    done: ms === 0,
  };
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const target = new Date(RELEASE_DATE_ISO).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);
  useEffect(() => {
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (t?.done) return <div className="countdown done">The list is ready.</div>;

  const cells: [string, number | undefined][] = [
    ["Days", t?.d],
    ["Hours", t?.h],
    ["Mins", t?.m],
    ["Secs", t?.s],
  ];
  return (
    <div className={`countdown ${compact ? "compact" : ""}`} aria-label="Time until the list is ready">
      {cells.map(([label, v]) => (
        <div className="cd-cell" key={label}>
          <span className="cd-num" key={v}>{v === undefined ? "––" : String(v).padStart(2, "0")}</span>
          <span className="cd-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  "3 weeks → 1 hour" — the hero's time-collapse moment              */
/* ------------------------------------------------------------------ */

export function TimeCollapse({ from, to }: { from: string; to: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOn(true), 1600);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <span className={`collapse ${on ? "on" : ""}`}>
      <span className="collapse-from">{from}</span>
      {" "}
      <span className="collapse-to">
        to <em>{to}</em>.
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ accordion                                                      */
/* ------------------------------------------------------------------ */

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className="reveal" key={it.q}>
          <div className={`faq-item ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="faq-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="faq-text">{it.q}</span>
              <span className="faq-icon" aria-hidden="true" />
            </button>
            <div className="faq-a" id={`faq-${i}`} role="region">
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Video frame — plays NEXT_PUBLIC_VIDEO_URL when set                 */
/* ------------------------------------------------------------------ */

export function VideoFrame() {
  const url = process.env.NEXT_PUBLIC_VIDEO_URL ?? "";
  const [playing, setPlaying] = useState(false);
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(url);

  return (
    <div className="reveal video-reveal">
    <div className={`video ${playing ? "playing" : ""}`}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      {playing && url ? (
        isFile ? (
          <video src={url} controls autoPlay playsInline />
        ) : (
          <iframe
            src={`${url}${url.includes("?") ? "&" : "?"}autoplay=1`}
            title="The Under 1M Media Vendor List"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )
      ) : (
        <button
          type="button"
          className="video-poster"
          onClick={() => url && setPlaying(true)}
          aria-label={url ? "Play video" : "Video coming soon"}
        >
          <span className="play">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="video-cap">{url ? "Watch · 1 min" : "Video coming soon"}</span>
        </button>
      )}
    </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky mobile CTA                                                  */
/* ------------------------------------------------------------------ */

export function StickyBar() {
  return (
    <div className="sticky-bar">
      <div>
        <strong>₦24,000</strong>
        <span>Pay only on 6 Dec</span>
      </div>
      <CtaButton source="sticky" className="btn btn-fill btn-sm" />
    </div>
  );
}

