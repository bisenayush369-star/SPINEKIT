/**
 * Oshunt — Refund policy
 *
 * One self-contained route file: drop it in as app/refund/page.tsx (or wherever your original lived).
 * It stays a Server Component, so your `metadata` keeps working. Every effect is plain CSS or your own
 * <Reveal>, so the page adds no client JavaScript of its own.
 *
 * Needs nothing beyond what your original already imported:
 *  - lucide-react
 *  - shadcn Card, Table           (@/components/ui/*)
 *  - your Navbar and <Reveal>     (@/components/ui/Navbar, @/components/reveal)
 *
 * Make it yours:
 *  - quickFacts, sectionIndex, shippingRows and the section text further down are plain content.
 *    A section's number and title live once, in sectionIndex, and feed both the contents list and the headings
 *  - BRAND and EMAIL just below, plus the [bracketed placeholders], which are shown highlighted so none slips through
 *  - Colours and motion live in the --rf-* tokens at the top of the CSS block
 *  - Size: on mouse-driven screens the page is drawn at 90% (see the first rule in the CSS block)
 *
 * The page keeps its own cream, green and gold look and never relies on your shadcn theme, light or dark.
 * Fonts (Fraunces, Inter) come from Google Fonts through <link> tags; React hoists them into <head>.
 */

import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ChevronDown, Link2 } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Reveal } from "@/components/reveal"

export const metadata: Metadata = {
  title: "Refund Policy — Oshunt",
  description: "Oshunt's returns, refunds, and exchange policy.",
}

/* ════════════════════════════════════════════════════════════════
   CONTENT — edit freely, this is plain data
   ════════════════════════════════════════════════════════════════ */
const BRAND = "Oshunt"
const EMAIL = "returns@oshunt.com"
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"

const quickFacts = [
  { num: "30", label: "days to request a return" },
  { num: "5–7", label: "business days to process" },
  { num: "100%", label: "refund on eligible items" },
]

const shippingRows = [
  { reason: "Changed your mind, wrong size/shade", payer: "Customer" },
  { reason: "Damaged, defective, or incorrect item shipped", payer: BRAND },
]

const sectionIndex = [
  { id: "returns-window", num: "01", title: "Returns window" },
  { id: "not-returnable", num: "02", title: "What can't be returned" },
  { id: "start-a-return", num: "03", title: "How to start a return" },
  { id: "refunds", num: "04", title: "Refunds" },
  { id: "damaged-items", num: "05", title: "Damaged, defective, or incorrect items" },
  { id: "exchanges", num: "06", title: "Exchanges" },
  { id: "late-refunds", num: "07", title: "Late or missing refunds" },
  { id: "sale-items", num: "08", title: "Sale items" },
  { id: "shipping-costs", num: "09", title: "Shipping costs for returns" },
]

/* ════════════════════════════════════════════════════════════════
   STYLES — scoped under .rf-root, token-driven.
   Prefixed with .rf-root so they win over utility classes on the shadcn parts (Card, Table).
   ════════════════════════════════════════════════════════════════ */
const CSS = `
/* Size. On mouse-driven screens the page is drawn at 90%, which is what 90% browser zoom looks like.
   Every size here is in rem, so lowering the root size scales all of it, your Navbar's rem sizes included.
   The rule exists only while this page is mounted. Touch screens stay at 100% to keep 44px tap targets.
   Want it on every page instead? Put  html { font-size: 90%; }  in globals.css and delete this rule. */
@media (hover: hover) and (pointer: fine) {
  html:has(.rf-root) { font-size: 90%; }
}
html:has(.rf-root) { scroll-behavior: smooth; } /* contents links glide; switched off for reduced motion below */
html:has(.rf-root) { background-color: #faf8f2; } /* = --rf-bg; rubber-band overscroll shows the page colour, not the app's */

.rf-root {
  --rf-serif: "Fraunces", ui-serif, Georgia, "Times New Roman", serif;
  --rf-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --rf-bg: #faf8f2;
  --rf-ink: #12201d;
  --rf-forest: #0e2e2b;
  --rf-green: #153f3a;
  --rf-body: #4c5b57;
  --rf-line: #dcd4be;
  --rf-sand: #fbf6e9;
  --rf-gold: #b9862e;
  --rf-gold-ink: #8a6112; /* the gold, darkened until small text on cream reads at 5:1 */
  --rf-gold-soft: #f0dfa8;
  --rf-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  background: var(--rf-bg);
  color: var(--rf-ink);
  font-family: var(--rf-sans);
  color-scheme: light; /* native bits (scrollbars, focus) stay light even if the app theme is dark */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* reading progress: a hairline along the top edge, driven by scroll with no script (where the browser supports it) */
.rf-progress { position: fixed; z-index: 60; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, var(--rf-gold), var(--rf-gold-soft)); transform: scaleX(0); transform-origin: left; pointer-events: none; }
@supports (animation-timeline: scroll()) {
  .rf-progress { animation: rf-progress linear both; animation-timeline: scroll(root block); }
  @keyframes rf-progress { to { transform: scaleX(1); } }
}

/* ── hero ─────────────────────────────────────────────── */
.rf-root .rf-hero { position: relative; isolation: isolate; overflow: hidden; padding: 4rem 1.25rem 6.25rem; background: var(--rf-forest); color: var(--rf-sand); }
@media (min-width: 768px) { .rf-root .rf-hero { padding: 6rem 3rem 7.5rem; } }
.rf-hero::before { content: ""; position: absolute; z-index: -1; left: -10rem; top: -13rem; width: min(46rem, 150vw); height: 30rem; background: radial-gradient(ellipse at center, rgba(185, 134, 46, 0.22), transparent 65%); pointer-events: none; }
.rf-hero::after { /* paper grain: static noise, no blend mode, so scrolling stays cheap */
  content: ""; position: absolute; inset: 0; z-index: -1; opacity: 0.09; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.rf-ring { position: absolute; z-index: -1; border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.1); pointer-events: none; animation: rf-breathe 9s ease-in-out infinite; }
.rf-ring-a { right: -4rem; bottom: -6rem; width: 16rem; height: 16rem; }
.rf-ring-b { right: 0.5rem; bottom: -2.5rem; width: 11rem; height: 11rem; animation-duration: 12s; animation-delay: 1.2s; }
@keyframes rf-breathe { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 0.85; } }

.rf-hero-inner { position: relative; max-width: 58rem; margin: 0 auto; }
.rf-eyebrow { margin: 0 0 1rem; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rf-gold-soft); }
.rf-root .rf-h1 { margin: 0; font-family: var(--rf-serif); font-weight: 500; font-size: clamp(2.5rem, 1.6rem + 3.6vw, 3.75rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--rf-sand); text-wrap: balance; }
.rf-lede { margin: 1.1rem 0 0; max-width: 34rem; font-size: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem); line-height: 1.65; color: rgba(251, 246, 233, 0.82); text-wrap: pretty; }
.rf-updated { margin: 1.75rem 0 0; font-size: 0.8125rem; color: rgba(251, 246, 233, 0.8); }

/* a [placeholder] to fill in: on cream, and on the dark panels */
.rf-ph { padding: 0.1em 0.45em; border-radius: 0.3rem; background: rgba(185, 134, 46, 0.16); color: #7a5717; font-weight: 500; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.rf-hero .rf-ph, .rf-contact .rf-ph { background: rgba(185, 134, 46, 0.28); color: var(--rf-gold-soft); }

/* ── quick facts: one card that floats over the hero's lower edge ── */
.rf-wrap { max-width: 64rem; margin: 0 auto; padding: 0 1.25rem 4rem; }
@media (min-width: 768px) { .rf-wrap { padding: 0 3rem 6rem; } }
.rf-facts-wrap { position: relative; z-index: 2; margin-top: -3.25rem; }
.rf-root .rf-facts { gap: 0; padding: 0; overflow: hidden; border: 1px solid var(--rf-line); border-radius: 1rem; background: #fff; color: inherit; box-shadow: 0 30px 50px -30px rgba(14, 46, 43, 0.5), 0 2px 6px rgba(14, 46, 43, 0.06); }
.rf-fact-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1px; margin: 0; padding: 0; list-style: none; background: var(--rf-line); }
@media (min-width: 640px) { .rf-fact-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rf-fact { display: flex; align-items: baseline; gap: 1rem; padding: 1.1rem 1.4rem; background: #fff; transition: background-color 0.25s; }
.rf-fact-num { flex: none; width: 4.75rem; font-family: var(--rf-serif); font-weight: 500; font-size: 1.75rem; line-height: 1.1; letter-spacing: -0.01em; color: var(--rf-green); transition: color 0.25s; }
.rf-fact-label { font-size: 0.8125rem; line-height: 1.45; color: var(--rf-body); }
@media (min-width: 640px) {
  .rf-fact { display: block; padding: 1.6rem 1.6rem 1.7rem; }
  .rf-fact::before { content: ""; display: block; width: 1.5rem; height: 2px; margin-bottom: 1rem; background: var(--rf-gold); transition: width 0.45s var(--rf-ease-out); }
  .rf-fact-num { display: block; width: auto; margin-bottom: 0.4rem; font-size: 2.25rem; }
}
@media (hover: hover) {
  .rf-fact:hover { background: var(--rf-sand); }
  .rf-fact:hover .rf-fact-num { color: var(--rf-gold-ink); }
  .rf-fact:hover::before { width: 3rem; }
}

/* ── layout: contents + policy ────────────────────────── */
.rf-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; margin-top: 2.5rem; }
@media (min-width: 768px) { .rf-layout { margin-top: 3.5rem; } }
.rf-aside { min-width: 0; }
.rf-toc { display: none; }
@media (min-width: 1024px) {
  .rf-layout { grid-template-columns: 14.5rem minmax(0, 1fr); gap: 3.5rem; }
  .rf-aside { position: sticky; top: 6rem; align-self: start; }
  .rf-toc { display: block; }
  .rf-fold { display: none; }
}
.rf-content { min-width: 0; max-width: 42rem; }
@media (max-width: 1023.98px) { /* no side list: one centred reading column, hero and facts included */
  .rf-hero-inner { max-width: 42rem; }
  .rf-wrap { max-width: 48rem; }
}

/* contents: a hairline with a gold mark beside the section you jumped to */
.rf-toc-title { margin: 0 0 0.9rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rf-gold-ink); }
.rf-toc ol, .rf-fold ol { margin: 0; padding: 0; list-style: none; }
.rf-toc ol { border-left: 1px solid var(--rf-line); }
.rf-root .rf-toc-link { display: flex; align-items: baseline; gap: 0.7rem; margin-left: -1px; padding: 0.45rem 0.5rem 0.45rem 1rem; border-left: 2px solid transparent; border-radius: 0 0.4rem 0.4rem 0; color: var(--rf-body); font-size: 0.875rem; line-height: 1.35; transition: color 0.2s, border-color 0.2s, background-color 0.2s; }
.rf-toc-num { flex: none; width: 1.3rem; font-size: 0.75rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--rf-gold-ink); }
@media (hover: hover) { .rf-root .rf-toc-link:hover { color: var(--rf-green); border-left-color: var(--rf-gold-soft); background: rgba(251, 246, 233, 0.7); } }
${sectionIndex.map(({ id }) => `.rf-root:has(#${id}:target) .rf-toc-link[href="#${id}"]`).join(",\n")} { color: var(--rf-green); font-weight: 600; border-left-color: var(--rf-gold); background: rgba(251, 246, 233, 0.9); }

/* contents, folded (below 1024px) */
.rf-fold { border: 1px solid var(--rf-line); border-radius: 0.875rem; background: #fff; overflow: hidden; overflow: clip; }
.rf-fold-sum { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 3.25rem; padding: 0.5rem 1.1rem; list-style: none; cursor: pointer; font-size: 0.9375rem; font-weight: 600; color: var(--rf-green); -webkit-tap-highlight-color: transparent; transition: background-color 0.2s; }
.rf-fold-sum::-webkit-details-marker { display: none; }
@media (hover: hover) { .rf-fold-sum:hover { background: var(--rf-sand); } }
.rf-root .rf-chev { flex: none; width: 1rem; height: 1rem; color: var(--rf-gold-ink); transition: transform 0.3s var(--rf-ease-out); }
.rf-fold[open] .rf-chev { transform: rotate(180deg); }
.rf-fold nav { padding: 0.25rem 0.5rem 0.6rem; border-top: 1px solid var(--rf-line); }
.rf-fold .rf-toc-link { min-height: 2.75rem; padding: 0.55rem 0.6rem; border-left-width: 0; border-radius: 0.5rem; font-size: 0.9375rem; align-items: baseline; }

/* ── the policy ───────────────────────────────────────── */
.rf-sec { position: relative; scroll-margin-top: 6.5rem; }
.rf-sec + .rf-sec { margin-top: 2.75rem; }
.rf-sec:target::before { content: ""; position: absolute; left: -0.9rem; top: 0.15rem; bottom: 0; width: 2px; background: var(--rf-gold); transform-origin: top; animation: rf-draw 0.6s var(--rf-ease-out) both; }
@media (min-width: 768px) { .rf-sec:target::before { left: -1.25rem; } }
@keyframes rf-draw { from { transform: scaleY(0); } }
.rf-root .rf-h2 { position: relative; display: flex; align-items: baseline; gap: 0.7rem; margin: 0 0 0.9rem; font-family: var(--rf-serif); font-weight: 500; font-size: clamp(1.35rem, 1.2rem + 0.6vw, 1.6rem); line-height: 1.25; letter-spacing: -0.01em; color: var(--rf-green); }
.rf-num { flex: none; font-family: var(--rf-sans); font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; color: var(--rf-gold-ink); }
.rf-anchor { display: none; position: absolute; right: 100%; top: 0.1em; margin-right: 0.7rem; width: 1.5rem; height: 1.5rem; align-items: center; justify-content: center; border-radius: 0.35rem; color: var(--rf-gold-ink); opacity: 0; transition: opacity 0.2s; }
@media (hover: hover) and (min-width: 1280px) {
  .rf-anchor { display: inline-flex; }
  .rf-h2:hover .rf-anchor { opacity: 1; }
}
.rf-prose { font-size: 1rem; line-height: 1.75; color: var(--rf-body); }
.rf-prose > * { margin: 0; }
.rf-prose > * + * { margin-top: 0.9rem; }
.rf-prose strong { font-weight: 600; color: var(--rf-green); }
.rf-prose ul { padding-left: 1.25rem; list-style: disc; display: grid; gap: 0.5rem; }
.rf-prose ul li::marker { color: var(--rf-gold); }
.rf-steps { padding: 0; list-style: none; display: grid; gap: 0.9rem; counter-reset: step; }
.rf-steps li { position: relative; padding-left: 2.6rem; counter-increment: step; }
.rf-steps li::before { content: counter(step); position: absolute; left: 0; top: 0.1rem; display: grid; place-items: center; width: 1.6rem; height: 1.6rem; border: 1px solid var(--rf-line); border-radius: 9999px; background: var(--rf-sand); color: var(--rf-gold-ink); font-size: 0.75rem; font-weight: 600; }
.rf-callout { padding: 1rem 1.25rem; border-left: 2px solid var(--rf-gold); border-radius: 0 0.75rem 0.75rem 0; background: var(--rf-sand); color: var(--rf-forest); font-size: 0.9375rem; line-height: 1.65; }

/* shipping table */
.rf-root .rf-table-card { gap: 0; padding: 0; overflow: hidden; border: 1px solid var(--rf-line); border-radius: 1rem; background: #fff; color: inherit; box-shadow: none; }
.rf-root .rf-th { height: auto; padding: 0.8rem 1.1rem; background: var(--rf-sand); color: var(--rf-green); font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.02em; white-space: normal; }
.rf-root .rf-td { padding: 1rem 1.1rem; vertical-align: top; white-space: normal; font-size: 0.9375rem; line-height: 1.5; color: var(--rf-body); }
.rf-root .rf-tr { border-color: var(--rf-line); }
.rf-root .rf-tr:hover { background: rgba(251, 246, 233, 0.6); }
.rf-root .rf-th:first-child, .rf-root .rf-td:first-child { width: 62%; }
.rf-pill { display: inline-flex; align-items: center; padding: 0.2rem 0.7rem; border: 1px solid var(--rf-line); border-radius: 9999px; background: var(--rf-sand); color: var(--rf-green); font-size: 0.8125rem; font-weight: 600; }
.rf-pill.is-brand { border-color: #b7d4cc; background: #e6f1ee; color: var(--rf-forest); }

/* contact */
.rf-contact-wrap { margin-top: 3.5rem; }
.rf-root .rf-contact { position: relative; overflow: hidden; gap: 0; padding: 0; border: 0; border-radius: 1.25rem; background: var(--rf-green); color: var(--rf-sand); box-shadow: none; }
.rf-contact::after { content: ""; position: absolute; right: -4rem; bottom: -5.5rem; width: 15rem; height: 15rem; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 9999px; pointer-events: none; animation: rf-breathe 12s ease-in-out infinite; }
.rf-root .rf-contact-in { position: relative; z-index: 1; padding: 2rem 1.5rem; }
@media (min-width: 768px) { .rf-root .rf-contact-in { padding: 2.5rem; } }
.rf-contact-title { margin: 0 0 0.75rem; font-family: var(--rf-serif); font-weight: 500; font-size: 1.5rem; line-height: 1.25; color: var(--rf-gold-soft); }
.rf-contact p { margin: 0; font-size: 1rem; line-height: 1.7; color: rgba(251, 246, 233, 0.82); }
.rf-contact p + p { margin-top: 0.5rem; }
.rf-mail { border-bottom: 1px solid rgba(240, 223, 168, 0.4); border-radius: 0.15rem; color: var(--rf-gold-soft); transition: color 0.2s, border-color 0.2s; }
.rf-mail:hover { border-bottom-color: var(--rf-gold-soft); color: var(--rf-sand); }

/* footer */
.rf-foot { max-width: 40rem; margin: 0 auto; padding: 0.5rem 1.25rem 2.75rem; text-align: center; font-size: 0.78125rem; line-height: 1.65; color: var(--rf-body); }

.rf-root .rf-toc-link:focus-visible, .rf-root .rf-fold-sum:focus-visible { outline: 2px solid var(--rf-gold-ink); outline-offset: 2px; }
.rf-root .rf-fold-sum:focus-visible { outline-offset: -2px; }
.rf-root .rf-mail:focus-visible { outline: 2px solid var(--rf-gold-soft); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  html:has(.rf-root) { scroll-behavior: auto; }
  .rf-root *:not(.rf-progress), .rf-root *::before, .rf-root *::after {
    animation-duration: 0.01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; transition-delay: 0ms !important; scroll-behavior: auto !important;
  }
}

/* printing: plain paper, the policy only */
@media print {
  .rf-root { background: #fff; }
  .rf-root > header, .rf-root > nav, .rf-progress, .rf-aside, .rf-ring, .rf-hero::before, .rf-hero::after, .rf-contact::after, .rf-anchor { display: none !important; }
  .rf-root .rf-hero { padding: 0 0 1rem; background: none; color: #000; }
  .rf-root .rf-hero * { color: #000 !important; }
  .rf-facts-wrap { margin-top: 0; }
  .rf-root .rf-facts, .rf-root .rf-contact { box-shadow: none; }
  .rf-root .rf-contact { border: 1px solid #000; background: none; }
  .rf-root .rf-contact * { color: #000 !important; }
  .rf-sec, .rf-fact, .rf-table-card { break-inside: avoid; }
}
`

/* ════════════════════════════════════════════════════════════════
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */
function Placeholder({ children }: { children: ReactNode }) {
  return <mark className="rf-ph" title="Placeholder: fill this in before publishing">{children}</mark>
}

function TocList() {
  return (
    <ol role="list">
      {sectionIndex.map(({ id, num, title }) => (
        <li key={id}>
          <a href={`#${id}`} className="rf-toc-link">
            <span className="rf-toc-num">{num}</span>
            {title}
          </a>
        </li>
      ))}
    </ol>
  )
}

function PolicySection({ id, children }: { id: string; children: ReactNode }) {
  const entry = sectionIndex.find((s) => s.id === id)
  if (!entry) return null
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="rf-sec">
      <h2 id={`${id}-title`} className="rf-h2">
        {/* mouse-only shortcut to this section's link; keyboard and screen-reader users have the contents list */}
        <a href={`#${id}`} className="rf-anchor" aria-hidden="true" tabIndex={-1}><Link2 className="h-4 w-4" /></a>
        <span className="rf-num">{entry.num}</span>
        {entry.title}
      </h2>
      <div className="rf-prose">{children}</div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function RefundPolicyPage() {
  return (
    <div className="rf-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_HREF} precedence="default" />
      <style>{CSS}</style>
      <div className="rf-progress" aria-hidden="true" />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="rf-hero">
          <div className="rf-ring rf-ring-a" aria-hidden="true" />
          <div className="rf-ring rf-ring-b" aria-hidden="true" />
          <Reveal className="rf-hero-inner">
            <p className="rf-eyebrow">{BRAND} · customer care</p>
            <h1 className="rf-h1">Refund policy</h1>
            <p className="rf-lede">
              We want you to love what you ordered. If something isn&apos;t right, here&apos;s exactly how returns,
              refunds, and exchanges work.
            </p>
            <p className="rf-updated">
              Last updated: <Placeholder>[Month DD, YYYY]</Placeholder>
            </p>
          </Reveal>
        </section>

        <div className="rf-wrap">
          {/* Quick facts */}
          <Reveal className="rf-facts-wrap">
            <Card className="rf-facts">
              <ul className="rf-fact-grid" role="list">
                {quickFacts.map((fact) => (
                  <li key={fact.label} className="rf-fact">
                    <span className="rf-fact-num">{fact.num}</span>
                    <span className="rf-fact-label">{fact.label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <div className="rf-layout">
            {/* On this page */}
            <aside className="rf-aside">
              <nav aria-label="On this page" className="rf-toc">
                <p className="rf-toc-title">On this page</p>
                <TocList />
              </nav>
              <details className="rf-fold">
                <summary className="rf-fold-sum">
                  On this page
                  <ChevronDown className="rf-chev" aria-hidden="true" />
                </summary>
                <nav aria-label="On this page">
                  <TocList />
                </nav>
              </details>
            </aside>

            <article className="rf-content">
              <PolicySection id="returns-window">
                <p>
                  You have <strong>30 calendar days</strong> from the delivery date to request a return. After 30
                  days, we&apos;re unable to offer a refund or exchange.
                </p>
                <p>
                  To be eligible, your item must be unused, in its original condition, and in the original packaging.
                  We may ask for proof of purchase, such as your order number or receipt.
                </p>
              </PolicySection>

              <PolicySection id="not-returnable">
                <p>
                  For hygiene and safety reasons, the following items can&apos;t be returned unless they arrive
                  damaged or defective:
                </p>
                <ul>
                  <li>Opened or used skincare, haircare, or beauty products</li>
                  <li>Items with a broken seal or removed hygiene sticker</li>
                  <li>Gift cards</li>
                  <li>Final sale or clearance items, marked as such at checkout</li>
                </ul>
              </PolicySection>

              <PolicySection id="start-a-return">
                <ol className="rf-steps" role="list">
                  <li>
                    Email <Placeholder>[{EMAIL}]</Placeholder> with your order number and the reason for your return.
                  </li>
                  <li>We&apos;ll confirm eligibility and send you a return shipping label and instructions.</li>
                  <li>Pack the item securely in its original packaging and drop it off at the specified carrier.</li>
                </ol>
                <p>Items sent back without first requesting a return may not be accepted.</p>
              </PolicySection>

              <PolicySection id="refunds">
                <p>
                  Once we receive and inspect your return, we&apos;ll notify you by email whether it&apos;s approved.
                  Approved refunds are issued to your original payment method within <strong>5–7 business days</strong>.
                  Your bank or card provider may take a few additional days to post the refund.
                </p>
                <p className="rf-callout" role="note">
                  Original shipping fees are non-refundable, unless the return is due to our error (wrong or defective
                  item).
                </p>
              </PolicySection>

              <PolicySection id="damaged-items">
                <p>
                  If your order arrives damaged, defective, or different from what you ordered, contact us within{" "}
                  <strong>7 days of delivery</strong> with a photo of the item. We&apos;ll cover return shipping and
                  send a replacement or full refund, whichever you prefer.
                </p>
              </PolicySection>

              <PolicySection id="exchanges">
                <p>
                  The fastest way to get a different size, shade, or product is to return the original item and place
                  a new order. If you&apos;d rather exchange directly, mention this when you email us and we&apos;ll
                  do our best to accommodate it, subject to stock.
                </p>
              </PolicySection>

              <PolicySection id="late-refunds">
                <p>If it&apos;s been longer than 10 business days since your refund was approved:</p>
                <ul>
                  <li>Check your bank account again</li>
                  <li>Contact your card provider — posting times vary</li>
                  <li>
                    If it&apos;s still missing, reach out to us at <Placeholder>[{EMAIL}]</Placeholder>
                  </li>
                </ul>
              </PolicySection>

              <PolicySection id="sale-items">
                <p>
                  Only regular-priced items are eligible for a refund. Items purchased on sale or with a discount code
                  are final sale, unless the item arrived damaged or defective.
                </p>
              </PolicySection>

              <PolicySection id="shipping-costs">
                <Card className="rf-table-card">
                  <Table>
                    <caption className="sr-only">Who pays return shipping, by reason for return</caption>
                    <TableHeader>
                      <TableRow className="rf-tr hover:bg-transparent">
                        <TableHead scope="col" className="rf-th">Reason for return</TableHead>
                        <TableHead scope="col" className="rf-th">Who pays return shipping</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shippingRows.map((row) => (
                        <TableRow key={row.reason} className="rf-tr">
                          <TableCell className="rf-td">{row.reason}</TableCell>
                          <TableCell className="rf-td">
                            <span className={row.payer === BRAND ? "rf-pill is-brand" : "rf-pill"}>{row.payer}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </PolicySection>

              {/* Contact card */}
              <Reveal className="rf-contact-wrap">
                <Card className="rf-contact">
                  <CardContent className="rf-contact-in">
                    <h2 className="rf-contact-title">Need a hand?</h2>
                    <p>Our team is happy to help with any return, refund, or order question.</p>
                    <p>
                      Email <a href={`mailto:${EMAIL}`} className="rf-mail">{EMAIL}</a> or visit our{" "}
                      <Placeholder>[Contact Us page]</Placeholder>.
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            </article>
          </div>
        </div>
      </main>

      <footer className="rf-foot">
        This page is a template and should be reviewed against your actual shipping, fulfillment, and local
        consumer-protection requirements before publishing. It is not legal advice.
      </footer>
    </div>
  )
}