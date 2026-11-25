import { Wordmark } from "@/components/Wordmark";
import {
  Countdown,
  Faq,
  MotionInit,
  StickyBar,
  TimeCollapse,
  VideoFrame,
} from "@/components/Interactive";
import { CtaBlock, CtaButton, WaitlistForm, WaitlistProvider } from "@/components/Waitlist";
import {
  bridge,
  contact,
  faq,
  finalCta,
  get,
  hero,
  promise,
  sample,
  steps,
  tried,
  whatsappLink,
} from "@/lib/content";

export default function Page() {
  return (
    <WaitlistProvider>
      <MotionInit />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Bridge />
        <Tried />
        <BetterWay />
        <WhatYouGet />
        <Steps />
        <Promise />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
    </WaitlistProvider>
  );
}

/* ================================================================== */

function Header() {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Misanti — back to top">
        <Wordmark className="brand-mark" />
        <span className="brand-sub">Under 1M List</span>
      </a>
      <div className="header-right">
        <span className="header-date">
          <i className="pulse" aria-hidden="true" /> List drops 6 December
        </span>
        <CtaButton source="header" className="btn btn-fill btn-sm" />
      </div>
    </header>
  );
}

/* ================================================================== */

const dms = [
  { h: "lensbytolu", m: "Hi! How much is your wedding package?", s: "Seen 3d" },
  { h: "frames.of.adaeze", m: "Please, what's your price for Dec?", s: "Price on request" },
  { h: "kayodestudios", m: "Hello, are you free on the 14th?", s: "Seen 1w" },
  { h: "the.vow.films", m: "Good evening, rates please 🙏", s: "Sent" },
  { h: "goldenhour.ng", m: "Hi, do you have a price list?", s: "“Please DM”" },
];

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="iconfield" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="reveal">
            <span className="strike">DMing 20 photographers on IG</span> just to know their price is a{" "}
            <em>waste of time.</em>
          </h1>
          <p className="lead reveal">{hero.body}</p>
          <p className="hero-promise reveal">
            {hero.promise} <TimeCollapse from={hero.from} to={hero.to} />
          </p>
          <div className="reveal">
            <CtaBlock source="hero" align="left" />
          </div>
        </div>

        <div className="hero-visual reveal" aria-hidden="true">
          <div className="inbox">
            <div className="inbox-head">
              <span>Messages</span>
              <span className="inbox-count">
                <b>20</b> sent · <b className="crimson">0</b> prices
              </span>
            </div>
            <ul>
              {dms.map((d, i) => (
                <li key={d.h} style={{ ["--i" as string]: i }}>
                  <span className="avatar">{d.h[0].toUpperCase()}</span>
                  <span className="dm-body">
                    <b>@{d.h}</b>
                    <small>{d.m}</small>
                  </span>
                  <span className="dm-status">{d.s}</span>
                </li>
              ))}
              <li className="typing" style={{ ["--i" as string]: dms.length }}>
                <span className="avatar">+</span>
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="dm-status">15 more…</span>
              </li>
            </ul>
          </div>

          <div className="listcard">
            <span className="listcard-tag">Misanti</span>
            <b>7 vendors</b>
            <span>Prices · free dates · portfolio · booking</span>
            <span className="listcard-under">All under ₦1,000,000</span>
          </div>
        </div>
      </div>
      <div className="scrollcue" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    "Every vendor priced below ₦1,000,000",
    "Photographers",
    "Videographers",
    "Content creators",
    "Lagos",
    "Prices up front",
    "Free dates listed",
    "Book directly",
  ];
  const row = (
    <div className="marquee-row">
      {words.map((w) => (
        <span key={w}>
          {w}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

/* ================================================================== */

function Bridge() {
  return (
    <section className="bridge">
      <div className="wrap narrow c">
        <span className="eyebrow reveal">Under ₦1,000,000. Every one.</span>
        <h2 className="reveal">{bridge.title}</h2>
        <div className="rule c reveal" />
        <p className="lead reveal">{bridge.body}</p>
      </div>
      <div className="wrap video-wrap">
        <VideoFrame />
        <div className="reveal">
          <CtaBlock source="after-video" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */

function Tried() {
  return (
    <section className="tried">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow reveal">{tried.eyebrow}</span>
          <h2 className="reveal">{tried.title}</h2>
        </div>
        <ol className="tried-list">
          {tried.items.map((it, i) => (
            <li className="tried-row reveal" key={it.title}>
              <span className="tried-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>
                {it.title}
              </h3>
              <p>{it.body}</p>
              <span className="tried-x" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BetterWay() {
  return (
    <section className="better">
      <div className="iconfield ondark" aria-hidden="true" />
      <div className="wrap narrow c">
        <p className="better-pre reveal">{tried.outro1.split(" But now")[0]}</p>
        <p className="big reveal">
          But now, we are giving you <span className="gold-shimmer">a better way.</span>
        </p>
        <div className="rule c reveal" />
        <p className="reveal">{tried.outro2}</p>
      </div>
    </section>
  );
}

/* ================================================================== */

const featureIcons: Record<string, React.ReactNode> = {
  prices: (
    <svg viewBox="0 0 48 48">
      <path d="M8 26 24 10h14v14L22 40z" />
      <circle cx="31" cy="17" r="2.5" />
    </svg>
  ),
  dates: (
    <svg viewBox="0 0 48 48">
      <rect x="8" y="11" width="32" height="29" rx="1" />
      <path d="M8 19h32M16 7v8M32 7v8" />
      <path d="m19 29 4 4 7-8" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 48 48">
      <path d="M6 16h8l3-5h14l3 5h8v22H6z" />
      <circle cx="24" cy="26" r="7" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 48 48">
      <path d="M10 38l2.5-7A14 14 0 1 1 18 36z" />
      <path d="M19 19c0 5 5 10 10 10l2-3-3-2-2 1c-2-1-3-2-4-4l1-2-2-3z" />
    </svg>
  ),
};

function WhatYouGet() {
  return (
    <section className="get">
      <div className="iconfield" aria-hidden="true" />
      <div className="wrap">
        <div className="get-grid">
          <div className="get-copy">
            <span className="eyebrow reveal">{get.eyebrow}</span>
            <h2 className="reveal">
              <span className="big-7">7</span> {get.title.replace(/^Seven /, "")}
            </h2>
            <p className="reveal muted">{get.intro}</p>
            <ul className="features">
              {get.features.map((f) => (
                <li className="feature reveal" key={f.key}>
                  <span className="feature-icon" aria-hidden="true">
                    {featureIcons[f.key]}
                  </span>
                  <span>
                    <b>{f.title}</b>
                    <span>{f.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <SampleEntry />
        </div>
        <p className="get-outro reveal">
          {get.outro.replace(" We remove the search.", "")} <em>We remove the search.</em>
        </p>
      </div>
    </section>
  );
}

function SampleEntry() {
  return (
    <div className="sample-wrap reveal">
      <span className="sample-label">{sample.label}</span>
      <article className="sample" aria-label="Sample vendor entry">
        <header>
          <span className="redact">
            <span>Name hidden</span>
          </span>
          <p className="sample-cat">{sample.category}</p>
          <p className="sample-from">{sample.from}</p>
        </header>

        {sample.groups.map((g) => (
          <div className="sample-group" key={g.title}>
            <h4>{g.title}</h4>
            {g.rows.map((r, i) => (
              <div className="sample-row draw" key={r.name} style={{ transitionDelay: `${0.15 + i * 0.1}s` }}>
                <span>
                  {r.name}
                  <small>{r.note}</small>
                </span>
                <b>{r.price}</b>
              </div>
            ))}
          </div>
        ))}

        <p className="sample-foot">{sample.footnote}</p>
        <dl className="sample-meta">
          {sample.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}

/* ================================================================== */

function Steps() {
  return (
    <section className="steps">
      <div className="wrap">
        <div className="section-head c">
          <span className="eyebrow reveal">{steps.eyebrow}</span>
          <h2 className="reveal">
            Four steps. <em>One minute</em> today.
          </h2>
        </div>
        <ol className="timeline">
          <span className="timeline-line" aria-hidden="true">
            <span />
          </span>
          {steps.items.map((s, i) => (
            <li className="step reveal" key={s.title}>
              <span className="step-dot">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="reveal">
          <CtaBlock source="steps" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */

function Promise() {
  return (
    <section className="promise">
      <div className="iconfield ondark" aria-hidden="true" />
      <div className="wrap promise-grid">
        <div className="seal reveal" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="seal-ring">
            <defs>
              <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <circle cx="100" cy="100" r="92" className="seal-track" />
            <circle cx="100" cy="100" r="92" className="seal-fill" />
            <text>
              <textPath href="#circ" textLength="486" lengthAdjust="spacing">
                OUR 72-HOUR PROMISE · FULL REFUND · OUR 72-HOUR PROMISE · FULL REFUND ·
              </textPath>
            </text>
          </svg>
          <div className="seal-center">
            <b>72</b>
            <span>hours</span>
          </div>
        </div>
        <div className="promise-copy">
          <span className="eyebrow gold reveal">{promise.eyebrow}</span>
          <h2 className="reveal">{promise.lead}</h2>
          <p className="reveal">{promise.body}</p>
          <p className="reveal small">
            To request a refund, send a message to{" "}
            <a href={`mailto:${contact.email}`} className="gold-link">
              {contact.email}
            </a>{" "}
            {promise.how}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */

function FaqSection() {
  return (
    <section className="faq-sec">
      <div className="wrap faq-grid">
        <div className="section-head sticky">
          <span className="eyebrow reveal">FAQ</span>
          <h2 className="reveal">
            Questions, <em>answered.</em>
          </h2>
          <p className="reveal muted">
            Anything else? WhatsApp{" "}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="ink-link">
              {contact.whatsappDisplay}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${contact.email}`} className="ink-link">
              {contact.email}
            </a>
            .
          </p>
        </div>
        <Faq items={faq} />
      </div>
    </section>
  );
}

/* ================================================================== */

function FinalCta() {
  return (
    <section className="final" id="join">
      <div className="iconfield ondark" aria-hidden="true" />
      <div className="final-glow" aria-hidden="true" />
      <div className="wrap final-grid">
        <div className="final-copy">
          <span className="eyebrow gold reveal">Final call</span>
          <h2 className="reveal">{finalCta.title}</h2>
          <p className="reveal">{finalCta.body}</p>
          <div className="reveal">
            <span className="cd-title">The list is ready in</span>
            <Countdown />
          </div>
        </div>
        <div className="final-form reveal">
          <h3>Join the waitlist</h3>
          <WaitlistForm source="final" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Wordmark className="footer-mark" />
      <p className="footer-sub">Agency</p>
      <p className="footer-links">
        <a href={whatsappLink()} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <span>·</span>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </p>
      <p className="footer-fine">© {new Date().getFullYear()} Misanti Agency · Lagos, Nigeria</p>
    </footer>
  );
}
