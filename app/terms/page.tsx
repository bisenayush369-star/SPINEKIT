/**
 * Spine — Terms page
 *
 * One self-contained route file: drop it in as app/terms/page.tsx.
 * It stays a Server Component, so your `metadata` (title, Open Graph, Twitter) keeps working.
 * Every effect is plain CSS, so the page ships no client JavaScript of its own.
 *
 * Needs nothing beyond what the rest of your site already has:
 *  - lucide-react
 *  - shadcn Card                  (@/components/ui/card)
 *  - your existing Navbar         (@/components/ui/Navbar)
 *
 * Make it yours:
 *  - CLAUSES holds the wording. The sentences are exactly the ones you had; the short titles above
 *    them are labels added for navigation and deep links (/terms#generated-code)
 *  - Colours and motion live in the --tm-* tokens at the top of the CSS block
 *  - Size: on mouse-driven screens the page is drawn at 90% (see the first rule in the CSS block)
 *
 * The page sets its own colours and never relies on your shadcn theme, light or dark.
 */

import type { Metadata } from "next"
import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/ui/Navbar"

const TITLE = "Terms — SPINEKIT"
const DESCRIPTION = "Terms and conditions for using the Spine backend generation platform."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://spinekit.com/terms",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

/* ════════════════════════════════════════════════════════════════
   CONTENT — edit freely, this is plain data
   ════════════════════════════════════════════════════════════════ */
const CLAUSES: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "responsible-use",
    title: "Responsible use",
    body: "By using Spine, you agree to use the platform responsibly and not to infringe on the rights of others or the integrity of generated code or content.",
  },
  {
    id: "generated-code",
    title: "Generated code",
    body: "Generated code is provided as a starting point. You remain responsible for review, testing, deployment, and legal compliance for the applications you build.",
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    body: (
      <>
        Subscription plans may be cancelled at any time, and paid usage is billed according to the applicable plan
        terms visible in the <Link href="/pricing" className="tm-link">pricing page</Link>.
      </>
    ),
  },
]

const ALSO = [
  { href: "/privacy", title: "Privacy", hint: "What we collect and why" },
  { href: "/pricing", title: "Pricing", hint: "Free and Pro plans" },
  { href: "/faq", title: "FAQ", hint: "Quick answers" },
]

const FOOTER_LINKS = [
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "GitHub", href: "https://github.com" },
]
const THIS_PAGE = "/terms"

/* ════════════════════════════════════════════════════════════════
   STYLES — scoped under .tm-root, token-driven.
   Prefixed with .tm-root so they win over utility classes on the shadcn Card.
   ════════════════════════════════════════════════════════════════ */
const CSS = `
/* Size. On mouse-driven screens the page is drawn at 90%, which is what 90% browser zoom looks like.
   Every size here is in rem, so lowering the root size scales all of it, your Navbar's rem sizes included.
   The rule exists only while this page is mounted. Touch screens stay at 100% to keep 44px tap targets.
   Want it on every page instead? Put  html { font-size: 90%; }  in globals.css and delete this rule. */
@media (hover: hover) and (pointer: fine) {
  html:has(.tm-root) { font-size: 90%; }
}
html:has(.tm-root) { background-color: #000; } /* rubber-band overscroll shows the page colour, not the app's */

.tm-root {
  --tm-line: #27272a;
  --tm-line-strong: #3f3f46;
  --tm-text: #f4f4f5;
  --tm-body: #d4d4d8;
  --tm-muted: #a1a1aa;
  --tm-accent: #34d399;
  --tm-accent-deep: #10b981;
  --tm-accent-edge: #059669;
  --tm-surface: rgba(9, 9, 11, 0.72);
  --tm-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  color-scheme: dark; /* native bits (focus, scrollbars) stay dark even if the app theme is light */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}
.tm-root > main { flex: 1 0 auto; } /* short page: the footer still sits at the bottom of the screen */

/* ── hero ─────────────────────────────────────────────── */
.tm-root .tm-hero { position: relative; isolation: isolate; overflow: hidden; padding: 3.5rem 1.25rem 2.5rem; }
@media (min-width: 768px) { .tm-root .tm-hero { padding: 5.5rem 3rem 3.5rem; } }
.tm-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.tm-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px; background-position: left top;
  -webkit-mask-image: radial-gradient(ellipse 60% 110% at max(0px, calc(50% - 23rem)) 0%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 60% 110% at max(0px, calc(50% - 23rem)) 0%, #000 20%, transparent 75%);
}
.tm-glow { /* centred on the left edge of the text column */
  position: absolute; left: max(-12rem, calc(50% - 49rem)); top: -11rem; width: min(52rem, 150vw); height: 28rem;
  background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.05) 45%, transparent 70%);
}
.tm-hero-inner { position: relative; z-index: 1; max-width: 46rem; margin: 0 auto; }
.tm-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; margin: 0 0 1.1rem; font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tm-accent); }
.tm-glyph { width: 7px; height: 14px; border-radius: 3px; background: linear-gradient(to bottom, var(--tm-accent), var(--tm-accent-deep)); box-shadow: 0 0 12px rgba(52, 211, 153, 0.5); }
.tm-root .tm-h1 { margin: 0 0 1rem; font-size: clamp(2.25rem, 1.2rem + 4.4vw, 3.75rem); line-height: 1.04; letter-spacing: -0.04em; font-weight: 800; text-wrap: balance; }
.tm-root .tm-lede { margin: 0; max-width: 34rem; color: var(--tm-muted); font-size: clamp(0.95rem, 0.9rem + 0.25vw, 1.0625rem); line-height: 1.65; text-wrap: pretty; }

/* entrance: the hero rises in, then the spine draws itself down the clauses */
.tm-rise { animation: tm-rise 0.75s var(--tm-ease-out) backwards; animation-delay: var(--d, 0ms); }
@keyframes tm-rise { from { opacity: 0; transform: translateY(14px); } }
@keyframes tm-draw { from { transform: scaleY(0); } }
@keyframes tm-pop { from { opacity: 0; transform: scale(0.4); } }

/* ── the document ─────────────────────────────────────── */
.tm-wrap { max-width: 52rem; margin: 0 auto; padding: 0 1.25rem 3rem; }
@media (min-width: 768px) { .tm-wrap { padding: 0 3rem 4rem; } }
.tm-root .tm-doc { gap: 0; padding: 0; border: 1px solid var(--tm-line); border-radius: 1.25rem; background: var(--tm-surface); color: inherit; box-shadow: none; }
.tm-root .tm-doc-in { padding: 1.75rem 1.25rem; }
@media (min-width: 768px) { .tm-root .tm-doc-in { padding: 2.5rem 2.5rem 2.5rem 2.25rem; } }

.tm-clauses { margin: 0; padding: 0; list-style: none; }
.tm-clause { --node-y: 0.8125rem; position: relative; padding: 0 0 2.25rem 2.5rem; scroll-margin-top: 6.5rem; }
.tm-clause:last-child { padding-bottom: 0; }
@media (min-width: 640px) { .tm-clause { padding-left: 3.25rem; } }

/* a vertebra per clause, joined by the spine */
.tm-node {
  position: absolute; left: 0.25rem; top: calc(var(--node-y) - 7px); width: 7px; height: 14px;
  border-radius: 3px; border: 1px solid var(--tm-accent-edge); background: #065f46;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.4s var(--tm-ease-out);
  animation: tm-pop 0.5s calc(0.35s + var(--i, 0) * 0.35s) cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
.tm-clause:not(:last-child)::before {
  content: ""; position: absolute; left: calc(0.25rem + 3px); top: var(--node-y); bottom: calc(var(--node-y) * -1); width: 1px;
  background: linear-gradient(to bottom, var(--tm-accent-edge), var(--tm-line-strong));
  transform-origin: top;
  animation: tm-draw 0.6s calc(0.45s + var(--i, 0) * 0.35s) var(--tm-ease-out) backwards;
}
.tm-clause > h2, .tm-clause > p { animation: tm-rise 0.7s calc(0.2s + var(--i, 0) * 0.1s) var(--tm-ease-out) backwards; }

.tm-root .tm-h2 { display: flex; align-items: baseline; gap: 0.75rem; margin: 0; font-size: 1.25rem; line-height: 1.3; font-weight: 650; letter-spacing: -0.02em; color: var(--tm-text); }
.tm-num { font: 500 0.8125rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; color: var(--tm-muted); transition: color 0.3s; }
.tm-root .tm-p { margin: 0.75rem 0 0; max-width: 62ch; color: var(--tm-body); font-size: 1.0625rem; line-height: 1.75; text-wrap: pretty; }

/* a link to /terms#generated-code lights up that clause */
.tm-clause:target .tm-node { background: var(--tm-accent); border-color: var(--tm-accent); transform: scale(1.18); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.14), 0 0 14px rgba(52, 211, 153, 0.55); }
.tm-clause:target .tm-num { color: var(--tm-accent); }

.tm-link { color: var(--tm-accent); text-decoration: underline; text-decoration-color: rgba(52, 211, 153, 0.4); text-underline-offset: 3px; border-radius: 0.2rem; transition: text-decoration-color 0.2s; }
.tm-link:hover { text-decoration-color: currentColor; }

/* ── also see ─────────────────────────────────────────── */
.tm-also { max-width: 52rem; margin: 0 auto; padding: 0 1.25rem 4.5rem; }
@media (min-width: 768px) { .tm-also { padding: 0 3rem 6rem; } }
.tm-also h2 { margin: 0 0 0.9rem; font-size: 1.125rem; line-height: 1.3; font-weight: 650; letter-spacing: -0.02em; color: var(--tm-text); }
.tm-also ul { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.75rem; }
@media (min-width: 640px) { .tm-also ul { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.tm-root .tm-tile { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 4rem; padding: 0.85rem 1.1rem; border: 1px solid var(--tm-line); border-radius: 0.875rem; background: var(--tm-surface); transition: border-color 0.2s, background-color 0.2s; }
.tm-tile-title { display: block; font-size: 0.9375rem; font-weight: 600; line-height: 1.3; color: var(--tm-text); }
.tm-tile-hint { display: block; margin-top: 0.15rem; font-size: 0.8125rem; line-height: 1.4; color: var(--tm-muted); }
.tm-tile svg { flex: none; color: var(--tm-muted); transition: color 0.2s, transform 0.25s var(--tm-ease-out); }
@media (hover: hover) {
  .tm-root .tm-tile:hover { border-color: var(--tm-line-strong); background: rgba(24, 24, 27, 0.8); }
  .tm-root .tm-tile:hover svg { color: var(--tm-accent); transform: translateX(3px); }
}
.tm-root .tm-tile:focus-visible, .tm-root .tm-link:focus-visible, .tm-root .tm-foot a:focus-visible { outline: 2px solid var(--tm-accent); outline-offset: 2px; }

/* ── footer ───────────────────────────────────────────── */
.tm-foot { border-top: 1px solid var(--tm-line); }
.tm-foot-in { max-width: 66rem; margin: 0 auto; padding: 1.5rem 1.25rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 0.75rem; font-size: 0.75rem; color: var(--tm-muted); }
@media (min-width: 768px) { .tm-foot-in { flex-direction: row; align-items: center; padding: 1.5rem 3rem; } }
.tm-foot ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; column-gap: 1.5rem; }
@media (max-width: 639.98px) { .tm-foot ul { display: grid; grid-template-columns: repeat(3, max-content); } } /* phones: a tidy 3 × 2 grid, not one orphaned link */
.tm-foot a { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; min-height: 1.75rem; border-radius: 0.25rem; color: var(--tm-muted); transition: color 0.2s; }
@media (pointer: coarse) { .tm-foot a { min-height: 2.75rem; } }
.tm-foot a:hover, .tm-foot a[aria-current="page"] { color: var(--tm-body); }

@media (prefers-reduced-motion: reduce) {
  .tm-root *, .tm-root *::before, .tm-root *::after {
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
    <div className="tm-root bg-black text-zinc-50 font-sans antialiased">
      <style>{CSS}</style>
      <Navbar />

      <main>
        <section className="tm-hero">
          <div className="tm-hero-bg" aria-hidden="true">
            <div className="tm-grid" />
            <div className="tm-glow" />
          </div>
          <div className="tm-hero-inner">
            <p className="tm-eyebrow tm-rise">
              <span className="tm-glyph" aria-hidden="true" />
              Terms
            </p>
            <h1 className="tm-h1 tm-rise" style={{ "--d": "70ms" } as CSSProperties}>Terms and conditions</h1>
            <p className="tm-lede tm-rise" style={{ "--d": "140ms" } as CSSProperties}>{DESCRIPTION}</p>
          </div>
        </section>

        <div className="tm-wrap">
          <Card className="tm-doc tm-rise" style={{ "--d": "200ms" } as CSSProperties}>
            <CardContent className="tm-doc-in">
              <ol className="tm-clauses" role="list">
                {CLAUSES.map((clause, i) => (
                  <li key={clause.id} id={clause.id} className="tm-clause" style={{ "--i": i } as CSSProperties}>
                    <span className="tm-node" aria-hidden="true" />
                    <h2 className="tm-h2">
                      <span className="tm-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      {clause.title}
                    </h2>
                    <p className="tm-p">{clause.body}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <nav className="tm-also" aria-labelledby="tm-also-title">
          <h2 id="tm-also-title">Also see</h2>
          <ul>
            {ALSO.map(({ href, title, hint }) => (
              <li key={href}>
                <Link href={href} className="tm-tile">
                  <span>
                    <span className="tm-tile-title">{title}</span>
                    <span className="tm-tile-hint">{hint}</span>
                  </span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <footer className="tm-foot">
        <div className="tm-foot-in">
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