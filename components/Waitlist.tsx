"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { joinWaitlist, type WaitlistResult } from "@/lib/actions";
import { cta } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Context — any CTA on the page opens the same waitlist dialog      */
/* ------------------------------------------------------------------ */

type Ctx = { open: (source: string) => void };
const WaitlistCtx = createContext<Ctx>({ open: () => {} });

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<string | null>(null);
  const open = useCallback((s: string) => setSource(s), []);
  return (
    <WaitlistCtx.Provider value={{ open }}>
      {children}
      <WaitlistDialog source={source} onClose={() => setSource(null)} />
    </WaitlistCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA block — the repeated "JOIN THE WAITLIST" box from the copy    */
/* ------------------------------------------------------------------ */

export function CtaBlock({
  source,
  tone = "light",
  align = "center",
}: {
  source: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  const { open } = useContext(WaitlistCtx);
  return (
    <div className={`cta-block ${tone} ${align}`}>
      <button type="button" className="btn btn-fill btn-shine" onClick={() => open(source)}>
        <span>{cta.label}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      <p className="cta-line">
        <strong>{cta.line1}</strong>
        <br />
        {cta.line2}
      </p>
    </div>
  );
}

export function CtaButton({
  source,
  className = "btn btn-fill",
  children,
}: {
  source: string;
  className?: string;
  children?: ReactNode;
}) {
  const { open } = useContext(WaitlistCtx);
  return (
    <button type="button" className={className} onClick={() => open(source)}>
      {children ?? cta.label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Form                                                              */
/* ------------------------------------------------------------------ */

export function WaitlistForm({ source, autoFocus }: { source: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<WaitlistResult | null, FormData>(joinWaitlist, null);
  const err = state?.status === "error" ? state : null;

  useEffect(() => {
    if (state?.status === "ok") {
      try {
        sessionStorage.setItem(
          "misanti-waitlist",
          JSON.stringify({ firstName: state.firstName, email: state.email }),
        );
      } catch {
        /* storage unavailable — thank-you page falls back gracefully */
      }
      router.push("/thank-you");
    }
  }, [state, router]);

  return (
    <form action={action} className="wl-form" noValidate>
      <input type="hidden" name="source" value={source} />
      <div className="hp" aria-hidden="true">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        name="firstName"
        label="First name"
        autoComplete="given-name"
        error={err?.fields?.firstName}
        defaultValue={err?.values?.firstName}
        autoFocus={autoFocus}
      />
      <Field
        name="whatsapp"
        label="WhatsApp number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+234"
        error={err?.fields?.whatsapp}
        defaultValue={err?.values?.whatsapp}
      />
      <Field
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        error={err?.fields?.email}
        defaultValue={err?.values?.email}
      />

      {err && !err.fields && <p className="wl-error" role="alert">{err.message}</p>}

      <button type="submit" className="btn btn-fill btn-shine wl-submit" disabled={pending}>
        {pending ? <span className="spinner" aria-hidden="true" /> : null}
        <span>{pending ? "Saving your spot…" : "Join the waitlist"}</span>
      </button>
      <p className="wl-fine">
        It takes a minute and costs nothing. {cta.line1} {cta.line2}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  error,
  ...rest
}: {
  name: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <input name={name} placeholder=" " required aria-invalid={!!error} {...rest} />
      <span className="field-label">{label}</span>
      <span className="field-line" aria-hidden="true" />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Dialog                                                            */
/* ------------------------------------------------------------------ */

function WaitlistDialog({ source, onClose }: { source: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (source && !d.open) {
      d.showModal();
      document.documentElement.classList.add("lock");
    }
    if (!source && d.open) d.close();
  }, [source]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handle = () => {
      document.documentElement.classList.remove("lock");
      onClose();
    };
    d.addEventListener("close", handle);
    return () => d.removeEventListener("close", handle);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="wl-dialog"
      aria-labelledby="wl-title"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="wl-card">
        <button type="button" className="wl-close" aria-label="Close" onClick={() => ref.current?.close()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
        <span className="eyebrow">The Under 1M Media Vendor List</span>
        <h2 id="wl-title">Save your spot.</h2>
        <div className="rule" />
        {source && <WaitlistForm source={source} autoFocus />}
      </div>
    </dialog>
  );
}
