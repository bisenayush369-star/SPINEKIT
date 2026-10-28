/**
 * Spine — Pricing page
 *
 * One self-contained route file: drop it in as app/pricing/page.tsx.
 * It stays a Server Component, so your `metadata` (title, Open Graph, Twitter) keeps working.
 * Every effect is plain CSS, so the page ships no client JavaScript of its own.
 *
 * Needs nothing beyond what the rest of your site already has:
 *  - lucide-react
 *  - shadcn Button, Card          (@/components/ui/*)
 *  - your existing Navbar         (@/components/ui/Navbar)
 *
 * Make it yours:
 *  - PLANS holds the copy and prices; CURRENCY is shown on both
 *  - START_HREF / UPGRADE_HREF are where the two buttons go
 *  - Colours and motion live in the --pr-* tokens at the top of the CSS block
 *  - Size: on mouse-driven screens the page is drawn at 90% (see the first rule in the CSS block)
 *
 * The page sets its own colours and never relies on your shadcn theme, light or dark.
 */

import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/ui/Navbar"

export const metadata: Metadata = {
  title: "Pricing — SPINEKIT",
  description:
    "Simple pricing for backend generation and starter app scaffolding.",
  openGraph: {
    title: "Pricing — SPINEKIT",
    description: "Simple, transparent pricing for backend starter generation.",
    type: "website",
    url: "https://spinekit.com/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — SPINEKIT",
    description: "Simple, transparent pricing for backend starter generation.",
  },
}

/* ════════════════════════════════════════════════════════════════
   CONTENT — edit freely, this is plain data
   ════════════════════════════════════════════════════════════════ */
const CURRENCY = "₹"
const START_HREF = "/"
const UPGRADE_HREF = "/login" // shortcut: no checkout route known, point this at it once it exists

// The meter shows each plan's daily limit as a row of vertebrae: Free lights 5, Pro lights all of them.
const CELLS = 18

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "",
    lit: 5,
    meterLabel: "5 per day",
    features: ["5 generations per day", "4 starter stacks", "Downloadable generated code"],
    cta: { label: "Start generating", href: START_HREF },
  },
  {
    id: "pro",
    name: "Pro",
    price: "499",
    period: "/month",
    lit: CELLS,
    meterLabel: "No daily cap",
    features: ["Unlimited generations", "Saved templates and presets", "Team sharing and collaboration"],
    cta: { label: "Go Pro", href: UPGRADE_HREF },
  },
]

// Both land on the matching answers on the FAQ page.
const QUESTIONS = [
  { q: "What's the difference between Free and Pro?", href: "/faq#whats-the-difference-between-free-and-pro" },
  { q: "Can I cancel Pro anytime?", href: "/faq#can-i-cancel-pro-anytime" },
]

const FOOTER_LINKS = [
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "GitHub", href: "https://github.com" },
]
const THIS_PAGE = "/pricing"

/* ════════════════════════════════════════════════════════════════
   STYLES — scoped under .pr-root, token-driven.
   Prefixed with .pr-root so they win over utility classes on the shadcn parts (Button, Card).
   ════════════════════════════════════════════════════════════════ */
const CSS = `
/* Size. On mouse-driven screens the page is drawn at 90%, which is what 90% browser zoom looks like.
   Every size here is in rem, so lowering the root size scales all of it, your Navbar's rem sizes included.
   The rule exists only while this page is mounted. Touch screens stay at 100% to keep 44px tap targets.
   Want it on every page instead? Put  html { font-size: 90%; }  in globals.css and delete this rule. */
@media (hover: hover) and (pointer: fine) {
  html:has(.pr-root) { font-size: 90%; }
}
html:has(.pr-root) { background-color: #000; } /* rubber-band overscroll shows the page colour, not the app's */

.pr-root {
  --pr-line: #27272a;
  --pr-line-strong: #3f3f46;
  --pr-text: #f4f4f5;
  --pr-body: #d4d4d8;
  --pr-muted: #a1a1aa;
  --pr-accent: #34d399;
  --pr-accent-deep: #10b981;
  --pr-surface: rgba(9, 9, 11, 0.72);
  --pr-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  color-scheme: dark; /* native bits (focus, scrollbars) stay dark even if the app theme is light */
  min-height: 100vh;
  min-height: 100dvh;
}

/* ── hero ─────────────────────────────────────────────── */
.pr-root .pr-hero { position: relative; isolation: isolate; overflow: hidden; text-align: center; padding: 4.5rem 1.25rem 3rem; }
@media (min-width: 768px) { .pr-root .pr-hero { padding: 6rem 3rem 4rem; } }
.pr-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.pr-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px; background-position: center top;
  -webkit-mask-image: radial-gradient(ellipse 65% 85% at 50% 0%, #000 25%, transparent 78%);
  mask-image: radial-gradient(ellipse 65% 85% at 50% 0%, #000 25%, transparent 78%);
}
.pr-glow {
  position: absolute; left: 50%; top: -9rem; width: min(70rem, 150vw); height: 26rem; transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.17) 0%, rgba(16, 185, 129, 0.05) 42%, transparent 70%);
}
.pr-hero-inner { position: relative; z-index: 1; max-width: 50rem; margin: 0 auto; }
.pr-root .pr-h1 { margin: 0 0 1rem; font-size: clamp(2.25rem, 1.2rem + 4.4vw, 4rem); line-height: 1.04; letter-spacing: -0.04em; font-weight: 800; text-wrap: balance; }
.pr-root .pr-sub { margin: 0 auto; max-width: 34rem; color: var(--pr-muted); font-size: clamp(0.95rem, 0.9rem + 0.25vw, 1.0625rem); line-height: 1.65; text-wrap: pretty; }

/* the page's one orchestrated moment: the hero rises in, then the plan meters fill */
.pr-rise { animation: pr-rise 0.75s var(--pr-ease-out) backwards; animation-delay: var(--d, 0ms); }
@keyframes pr-rise { from { opacity: 0; transform: translateY(14px); } }

/* ── plans ────────────────────────────────────────────── */
.pr-wrap { max-width: 62rem; margin: 0 auto; padding: 0 1.25rem 3.5rem; }
@media (min-width: 768px) { .pr-wrap { padding: 0 3rem 4.5rem; } }
.pr-root .pr-panel { display: grid; gap: 0; padding: 0; overflow: hidden; border: 1px solid var(--pr-line); border-radius: 1.25rem; background: var(--pr-surface); color: inherit; box-shadow: none; }
@media (min-width: 768px) { .pr-root .pr-panel { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
.pr-root .pr-plan { padding: 1.75rem 1.5rem 2rem; }
@media (min-width: 768px) { .pr-root .pr-plan { display: flex; flex-direction: column; padding: 2.25rem 2.25rem 2.5rem; } }
.pr-root .pr-plan + .pr-plan { border-top: 1px solid var(--pr-line); }
@media (min-width: 768px) { .pr-root .pr-plan + .pr-plan { border-top: 0; border-left: 1px solid var(--pr-line); } }
.pr-root .pr-plan[data-plan="pro"] { background: linear-gradient(to bottom, rgba(16, 185, 129, 0.09), rgba(16, 185, 129, 0.015) 60%); }

.pr-name { margin: 0; font-size: 1.125rem; line-height: 1.3; font-weight: 650; letter-spacing: -0.02em; color: var(--pr-text); }
.pr-price { margin: 0.9rem 0 0; font-size: 3.25rem; line-height: 1; font-weight: 700; letter-spacing: -0.045em; font-variant-numeric: tabular-nums; color: var(--pr-text); }
.pr-cur { margin-right: 0.12em; font-size: 0.45em; font-weight: 600; letter-spacing: 0; vertical-align: 0.85em; color: var(--pr-muted); }
.pr-per { margin-left: 0.2rem; font-size: 1rem; font-weight: 450; letter-spacing: 0; color: var(--pr-muted); }

/* the meter: one vertebra per generation a day */
.pr-meter { display: flex; align-items: center; gap: 0.9rem; margin-top: 1.6rem; }
.pr-cells { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(${CELLS}, minmax(0, 1fr)); gap: 3px; height: 1.5rem; }
.pr-cells[data-plan="pro"] { -webkit-mask-image: linear-gradient(to right, #000 55%, transparent); mask-image: linear-gradient(to right, #000 55%, transparent); }
.pr-cell { border-radius: 3px; border: 1px solid var(--pr-line); background: #0c0c0e; }
.pr-cell[data-lit] {
  border-color: #059669; background: linear-gradient(to bottom, var(--pr-accent), var(--pr-accent-deep));
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.3);
  animation: pr-lit 0.5s calc(0.5s + var(--i, 0) * 55ms) var(--pr-ease-out) both;
}
@keyframes pr-lit { from { border-color: var(--pr-line); background: #0c0c0e; box-shadow: none; transform: scaleY(0.55); } }
.pr-meter-label { flex: none; min-width: 5.5rem; text-align: right; font-size: 0.8125rem; font-weight: 500; color: var(--pr-muted); }
.pr-plan[data-plan="pro"] .pr-meter-label { color: var(--pr-accent); }

.pr-list { margin: 1.75rem 0 0; padding: 0; list-style: none; display: grid; gap: 0.85rem; }
.pr-list li { display: flex; align-items: flex-start; gap: 0.7rem; font-size: 0.9375rem; line-height: 1.45; color: var(--pr-body); }
.pr-tick { flex: none; display: grid; place-items: center; width: 1.25rem; height: 1.25rem; margin-top: 0.05rem; border-radius: 0.35rem; background: #18181b; color: var(--pr-muted); }
.pr-plan[data-plan="pro"] .pr-tick { background: rgba(16, 185, 129, 0.14); color: var(--pr-accent); }

.pr-cta { margin-top: 2rem; }
@media (min-width: 768px) { .pr-cta { margin-top: auto; padding-top: 2rem; } }
.pr-root .pr-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; height: 2.75rem; padding: 0 1.25rem; border-radius: 0.75rem; font-size: 0.9375rem; font-weight: 600; box-shadow: none; transition: background-color 0.2s, border-color 0.2s, color 0.2s; }
.pr-root .pr-btn-free { border: 1px solid var(--pr-line-strong); background: transparent; color: var(--pr-text); }
.pr-root .pr-btn-free:hover { background: #18181b; border-color: #52525b; color: #fff; }
.pr-root .pr-btn-pro { border: 1px solid transparent; background: var(--pr-accent-deep); color: #022c22; }
.pr-root .pr-btn-pro:hover { background: var(--pr-accent); color: #022c22; }
.pr-root .pr-btn:focus-visible, .pr-root .pr-link:focus-visible, .pr-root .pr-qa-all:focus-visible, .pr-root .pr-foot a:focus-visible { outline: 2px solid var(--pr-accent); outline-offset: 2px; box-shadow: none; }

/* ── questions ────────────────────────────────────────── */
.pr-qa { max-width: 62rem; margin: 0 auto; padding: 0 1.25rem 5rem; }
@media (min-width: 768px) { .pr-qa { padding: 0 3rem 6.5rem; } }
.pr-qa-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; }
.pr-qa h2 { margin: 0; font-size: 1.125rem; line-height: 1.3; font-weight: 650; letter-spacing: -0.02em; color: var(--pr-text); }
.pr-qa-all { display: inline-flex; align-items: center; min-height: 1.75rem; margin-right: -0.25rem; padding: 0 0.25rem; font-size: 0.875rem; font-weight: 500; color: var(--pr-accent); border-radius: 0.25rem; }
@media (pointer: coarse) { .pr-qa-all { min-height: 2.75rem; } }
.pr-qa-all:hover { text-decoration: underline; text-underline-offset: 3px; }
.pr-qa ul { margin: 0; padding: 0; list-style: none; border-bottom: 1px solid var(--pr-line); }
.pr-root .pr-link { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 3.5rem; padding: 0.5rem 0.25rem; border-top: 1px solid var(--pr-line); color: #e4e4e7; font-size: 1rem; line-height: 1.4; transition: color 0.2s; }
.pr-root .pr-link svg { flex: none; color: var(--pr-muted); transition: color 0.2s, transform 0.25s var(--pr-ease-out); }
@media (hover: hover) { .pr-root .pr-link:hover { color: #fff; } .pr-root .pr-link:hover svg { color: var(--pr-accent); transform: translateX(3px); } }

/* ── footer ───────────────────────────────────────────── */
.pr-foot { border-top: 1px solid var(--pr-line); }
.pr-foot-in { max-width: 66rem; margin: 0 auto; padding: 1.5rem 1.25rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 0.75rem; font-size: 0.75rem; color: var(--pr-muted); }
@media (min-width: 768px) { .pr-foot-in { flex-direction: row; align-items: center; padding: 1.5rem 3rem; } }
.pr-foot ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; column-gap: 1.5rem; }
@media (max-width: 639.98px) { .pr-foot ul { display: grid; grid-template-columns: repeat(3, max-content); } } /* phones: a tidy 3 × 2 grid, not one orphaned link */
.pr-foot a { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; min-height: 1.75rem; border-radius: 0.25rem; color: var(--pr-muted); transition: color 0.2s; }
@media (pointer: coarse) { .pr-foot a { min-height: 2.75rem; } }
.pr-foot a:hover, .pr-foot a[aria-current="page"] { color: var(--pr-body); }

@media (prefers-reduced-motion: reduce) {
  .pr-root *, .pr-root *::before, .pr-root *::after {
    animation-duration: 0.01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; transition-delay: 0ms !important; scroll-behavior: auto !important;
  }
}
`

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <div className="pr-root bg-black text-zinc-50 font-sans antialiased">
      <style>{CSS}</style>
      <Navbar />

      <main>
        <section className="pr-hero">
          <div className="pr-hero-bg" aria-hidden="true">
            <div className="pr-grid" />
            <div className="pr-glow" />
          </div>
          <div className="pr-hero-inner">
            <h1 className="pr-h1 pr-rise">Simple pricing for shipping better backends</h1>
            <p className="pr-sub pr-rise" style={{ "--d": "90ms" } as CSSProperties}>
              Free tier gives you five AI generations per day. Go Pro for unlimited scaffold generation,
              saved templates, and team collaboration.
            </p>
          </div>
        </section>

        <div className="pr-wrap">
          <Card className="pr-panel pr-rise" style={{ "--d": "180ms" } as CSSProperties}>
            {PLANS.map((plan) => (
              <CardContent key={plan.id} className="pr-plan" data-plan={plan.id} role="group" aria-labelledby={`pr-${plan.id}`}>
                <h2 id={`pr-${plan.id}`} className="pr-name">{plan.name}</h2>
                <p className="pr-price">
                  <span className="pr-cur">{CURRENCY}</span>{plan.price}
                  {plan.period && <span className="pr-per">{plan.period}</span>}
                </p>

                <div className="pr-meter">
                  <div className="pr-cells" data-plan={plan.id} aria-hidden="true">
                    {Array.from({ length: CELLS }, (_, i) => (
                      <span key={i} className="pr-cell" data-lit={i < plan.lit ? "" : undefined} style={{ "--i": i } as CSSProperties} />
                    ))}
                  </div>
                  <span className="pr-meter-label">{plan.meterLabel}</span>
                </div>

                <ul className="pr-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="pr-tick" aria-hidden="true"><Check className="h-3 w-3" strokeWidth={3} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pr-cta">
                  <Button asChild className={`pr-btn pr-btn-${plan.id}`}>
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                </div>
              </CardContent>
            ))}
          </Card>
        </div>

        <section className="pr-qa" aria-labelledby="pr-qa-title">
          <div className="pr-qa-head">
            <h2 id="pr-qa-title">Questions about plans</h2>
            <Link href="/faq" className="pr-qa-all">All questions</Link>
          </div>
          <ul>
            {QUESTIONS.map(({ q, href }) => (
              <li key={href}>
                <Link href={href} className="pr-link">
                  <span>{q}</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="pr-foot">
        <div className="pr-foot-in">
          <span>Spine · spine.io</span>
          <nav aria-label="Footer">
            <ul>
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("http") ? (
                    <a href={href}>{label}</a>
                  ) : (
                    <Link href={href} aria-current={href === THIS_PAGE ? "page" : undefined}>{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}