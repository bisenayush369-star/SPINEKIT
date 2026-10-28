"use client"

/**
 * Spine — Privacy Policy
 *
 * One self-contained route file: drop it in as app/privacy/page.tsx.
 * Content, styles and components all live below — nothing else to wire up.
 *
 * IMPORTANT — READ BEFORE PUBLISHING:
 * This is a structured starting template, not legal advice. It follows a
 * standard SaaS privacy-policy outline and is grounded in what's publicly
 * true about how Spine works (anonymous free tier, AI-generated scaffolds,
 * optional accounts, Pro billing). Anything in [brackets] is a placeholder
 * that needs a real, verified answer from your team — most importantly:
 *   - Section 3: confirmed from page.tsx that generation calls Google's Gemini
 *     API — still need YOUR Gemini plan/terms re: training use, confirmed
 *   - Section 5: remaining sub-processors (hosting, payments, analytics)
 *   - Section 6: real data-retention windows
 *   - Section 14: your registered legal entity name + address
 * Have this reviewed by a lawyer before it goes live, especially if you
 * have EU/UK or California users (GDPR / CCPA).
 *
 * Needs nothing beyond what the rest of your site already has:
 *  - lucide-react
 *  - shadcn Card                  (@/components/ui/card)
 *  - your existing Navbar         (@/components/ui/Navbar)
 *
 * Make it yours:
 *  - LAST_UPDATED and SECTIONS are plain content. Block types: p, h3, list, note
 *  - Anything in [square brackets] is shown as a highlighted placeholder, so it can't slip through unnoticed
 *  - Email addresses in the text turn into mailto links on their own
 *  - Colours and motion live in the --pv-* tokens at the top of the CSS block
 *  - Size: on mouse-driven screens the page is drawn at 90% (see the first rule in the CSS block)
 *
 * This is a client component (the contents list follows your scroll), and a client file cannot export
 * `metadata`. The original had none either. For a page title and Open Graph tags, add a small layout.tsx
 * next to this file that exports `metadata`.
 * The page sets its own colours and never relies on your shadcn theme, light or dark.
 */

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"
import Link from "next/link"
import { ChevronDown, Info, Link2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/ui/Navbar"

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ")

/* ════════════════════════════════════════════════════════════════
   CONTENT — edit freely, this is plain data
   ════════════════════════════════════════════════════════════════ */
type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
type Section = { id: string; title: string; blocks: Block[] }

const LAST_UPDATED = "August 8, 2026"

const FOOTER_LINKS = [
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "GitHub", href: "https://github.com" },
]
const THIS_PAGE = "/privacy"

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "1. Overview",
    blocks: [
      { type: "p", text: `This Privacy Policy explains how Spine collects, uses, and shares information when you use our website, our command-line tool, and related services (together, the Service). It covers information you give us and information we collect automatically — it does not cover the source code Spine generates for you once it's downloaded to your machine or pushed to your own repository, which is yours to do with as you like.` },
      { type: "p", text: `By using the Service, you agree to the collection and use of information as described here. If you don't agree with this policy, please don't use the Service.` },
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    blocks: [
      { type: "h3", text: "Information you provide" },
      {
        type: "list",
        items: [
          `The prompts you write describing the backend you want generated.`,
          `Account details, if you create one — email address and, optionally, a display name.`,
          `Payment details, if you subscribe to Pro. These are handled directly by our payment processor [name your processor, e.g. Stripe]; we don't store full card numbers ourselves.`,
          `Anything you send us directly, like support requests or feedback on GitHub.`,
        ],
      },
      { type: "h3", text: "Information collected automatically" },
      {
        type: "list",
        items: [
          `Usage data — which stack you generated, how many generations you've run, timestamps.`,
          `Standard log data — IP address, browser and device type, pages visited, referring URLs.`,
          `Cookies and similar technologies (see Section 8).`,
        ],
      },
      { type: "h3", text: "Information from third parties" },
      { type: "p", text: `If you sign in using a third-party provider [e.g. GitHub OAuth, if applicable], we receive the basic profile information that provider shares with us, such as your name, email, and avatar.` },
    ],
  },
  {
    id: "prompts-and-ai",
    title: "3. How Your Prompts and Generated Code Are Handled",
    blocks: [
      { type: "p", text: `When you generate a scaffold, your description is sent to Google's Gemini API, which we use to process your prompt and produce the files, schema, and routes you download. Free, anonymous generations are not linked to an account unless you're signed in.` },
      { type: "p", text: `If you save a template while signed in, that prompt and its output are stored to your account so you can reuse it, and remain there until you delete it or close your account.` },
      { type: "note", text: `Placeholder — confirm before publishing: your Gemini API tier and terms with Google determine whether prompts can be used to improve Google's models — this varies by plan and account configuration, so confirm your actual setup rather than assuming. Separately confirm whether Spine itself logs or reuses prompts/output beyond generating the response.` },
    ],
  },
  {
    id: "how-we-use-information",
    title: "4. How We Use Information",
    blocks: [
      {
        type: "list",
        items: [
          `To operate the Service — running generations, producing downloads, maintaining your account.`,
          `To process Pro subscription payments and manage billing.`,
          `To communicate with you — service notices, security alerts, and, only with your consent, product updates.`,
          `To improve and secure the product — debugging, understanding usage patterns, and preventing abuse of the daily generation limit.`,
          `To comply with legal obligations and enforce our terms.`,
        ],
      },
    ],
  },
  {
    id: "how-we-share-information",
    title: "5. How We Share Information",
    blocks: [
      { type: "p", text: `We don't sell your personal information. We share it only in these circumstances:` },
      {
        type: "list",
        items: [
          `With service providers who help us run Spine — including Google (Gemini API) to process generation prompts, and [list your other actual sub-processors: hosting/infrastructure, payment processor, email delivery, analytics].`,
          `When required by law, or to respond to valid legal requests.`,
          `To protect the rights, safety, or property of Spine, our users, or the public.`,
          `In connection with a merger, acquisition, or sale of assets, with notice to you where required.`,
          `With your consent, or at your direction.`,
        ],
      },
    ],
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    blocks: [
      { type: "p", text: `We keep account information for as long as your account is active, plus [XX days/months] afterward in case you want to reactivate it. Saved templates persist until you delete them or close your account. Anonymous usage and log data is retained for [XX days] for security and abuse-prevention purposes, then deleted or aggregated.` },
      { type: "p", text: `You can ask us to delete your data earlier — see Your Rights and Choices below.` },
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Rights and Choices",
    blocks: [
      { type: "h3", text: "General" },
      { type: "p", text: `You can access, correct, export, or delete your saved templates and account details at any time from your dashboard, or by contacting us directly.` },
      { type: "h3", text: "If you're in the European Economic Area or UK" },
      { type: "p", text: `Under GDPR, you have the right to access, rectify, erase, or restrict processing of your personal data; to receive a copy in a portable format; to object to certain processing; and to lodge a complaint with your local data protection authority.` },
      { type: "h3", text: "If you're a California resident" },
      { type: "p", text: `Under the CCPA/CPRA, you have the right to know what personal information we collect, request its deletion or correction, and opt out of the sale or sharing of personal information — which, as noted above, we don't do. Exercising these rights won't result in discriminatory treatment.` },
      { type: "p", text: `To exercise any of these rights, contact us at privacy@spine.io.` },
    ],
  },
  {
    id: "cookies",
    title: "8. Cookies and Similar Technologies",
    blocks: [
      { type: "p", text: `We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how the Service is used [list actual tools, e.g. an analytics provider, if you use one]. Most browsers let you block or delete cookies through their settings; doing so may affect parts of the Service that require you to be signed in.` },
    ],
  },
  {
    id: "security",
    title: "9. Data Security",
    blocks: [
      { type: "p", text: `We use reasonable technical and organizational measures — such as encryption in transit and access controls — to protect your information. No method of transmission or storage is 100% secure, so we can't guarantee absolute security.` },
    ],
  },
  {
    id: "international-transfers",
    title: "10. International Data Transfers",
    blocks: [
      { type: "p", text: `Your information may be processed in countries other than the one you live in, including [list relevant countries/regions], which may have different data protection laws. Where required, we use appropriate safeguards, such as standard contractual clauses, for these transfers.` },
    ],
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    blocks: [
      { type: "p", text: `Spine isn't directed at children under 13 (or 16, where local law requires), and we don't knowingly collect personal information from them. If you believe a child has provided us with personal information, contact us and we'll delete it.` },
    ],
  },
  {
    id: "third-party-links",
    title: "12. Third-Party Links",
    blocks: [
      { type: "p", text: `The Service may link to third-party sites, like GitHub or our documentation host. We aren't responsible for the privacy practices of sites we don't operate, and we encourage you to review their policies.` },
    ],
  },
  {
    id: "changes",
    title: "13. Changes to This Policy",
    blocks: [
      { type: "p", text: `We may update this policy from time to time. If we make material changes, we'll update the date at the top of this page and, where appropriate, notify you directly [describe how, e.g. by email or an in-product notice].` },
    ],
  },
  {
    id: "contact",
    title: "14. Contact Us",
    blocks: [
      { type: "p", text: `Questions about this policy or your data? Reach out at privacy@spine.io.` },
      { type: "p", text: `[Company Legal Name], [Registered Address], [Jurisdiction / Governing Law]` },
    ],
  },
]

/* ════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════ */
const IDS = SECTIONS.map((s) => s.id)

// "3. How Your Prompts…" → number "03" for the margin, label for everything else. A title without a number stays whole.
const splitTitle = (title: string) => {
  const m = /^(\d+)\.\s+(.*)$/.exec(title)
  return m ? { num: m[1].padStart(2, "0"), label: m[2] } : { num: "", label: title }
}
const TOC = SECTIONS.map((s) => ({ id: s.id, ...splitTitle(s.title) }))

const scrollBehavior = (): ScrollBehavior =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"

const setHash = (hash: string | null) => {
  try {
    window.history.replaceState(null, "", hash ? `#${hash}` : window.location.pathname + window.location.search)
  } catch { /* history unavailable (sandboxed frame) */ }
}

/**
 * Which section is in view: the last one whose top has passed just under the nav.
 * `lock` pins a clicked section while the smooth-scroll to it is still in flight.
 */
function useScrollSpy(ids: string[]) {
  const idsKey = ids.join("|")
  const [active, setActive] = useState<string>(ids[0] ?? "")
  const lockUntil = useRef(0)
  const pinned = useRef<string | null>(null)
  const recompute = useRef<() => void>(() => {})
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const list = idsKey ? idsKey.split("|") : []
    let raf = 0
    const run = () => {
      raf = 0
      if (list.length === 0 || Date.now() < lockUntil.current) return
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const line = rem * 8 // just under the nav (matches the 6.5rem scroll margin)
      const top = (id: string) => document.getElementById(id)?.getBoundingClientRect().top ?? Infinity
      let current = list[0]
      for (const id of list) if (top(id) <= line) current = id
      // Short last sections can never reach the line. At the very bottom, keep the section that was
      // just clicked if it is on screen; otherwise the last one in view wins.
      const atBottom = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (!atBottom) pinned.current = null
      else if (pinned.current && list.includes(pinned.current) && top(pinned.current) < window.innerHeight) current = pinned.current
      else for (const id of list) if (top(id) < window.innerHeight) current = id
      setActive(current)
    }
    const schedule = () => { if (!raf) raf = window.requestAnimationFrame(run) }
    recompute.current = schedule
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [idsKey])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const lock = useCallback((id: string) => {
    pinned.current = id
    lockUntil.current = Date.now() + 1200
    setActive(id)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => recompute.current(), 1250)
  }, [])

  return [active, lock] as const
}

/* ════════════════════════════════════════════════════════════════
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */
// Reads the clock on the client only, never during prerender, so the page also builds under
// Next's `cacheComponents` (which rejects `new Date()` in a client render). The server and the
// hydration pass use FALLBACK_YEAR; the real year replaces it as soon as the page is interactive.
const FALLBACK_YEAR = 2026
const noopSubscribe = () => () => {}
function CurrentYear() {
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => FALLBACK_YEAR)
  return <>{year}</>
}

// Text with two kinds of marked-up pieces: [placeholders] to fill in, and email addresses.
const TOKEN_RE = /(\[[^\]]+\]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN_RE).map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>
        return part.startsWith("[") ? (
          <mark key={i} className="pv-ph" title="Placeholder: fill this in before publishing">{part}</mark>
        ) : (
          <a key={i} href={`mailto:${part}`} className="pv-link">{part}</a>
        )
      })}
    </>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="pv-p"><Rich text={block.text} /></p>
    case "h3":
      return <h3 className="pv-h3">{block.text}</h3>
    case "list":
      return (
        <ul className="pv-list" role="list">
          {block.items.map((item, i) => <li key={i}><Rich text={item} /></li>)}
        </ul>
      )
    case "note":
      return (
        <div className="pv-note" role="note">
          <Info className="h-4 w-4" aria-hidden="true" />
          <p><Rich text={block.text} /></p>
        </div>
      )
  }
}

type GoHandler = (id: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => void
type TocProps = { activeId: string; onGo: GoHandler }

/** Desktop: the spine — a vertical rail of vertebrae that fills as you read. */
function TocRail({ activeId, onGo }: TocProps) {
  const activeIndex = Math.max(0, TOC.findIndex((t) => t.id === activeId))
  return (
    <nav aria-label="Table of contents" className="pv-rail">
      <ol role="list">
        {TOC.map((t, i) => (
          <li key={t.id} className={cx("pv-rail-li", i < activeIndex && "is-passed", i === activeIndex && "is-active")} style={{ "--i": i } as CSSProperties}>
            <a href={`#${t.id}`} onClick={onGo(t.id)} aria-current={i === activeIndex ? "location" : undefined} className="pv-rail-item">
              <span className="pv-node" aria-hidden="true" />
              <span className="pv-rail-num">{t.num}</span>
              <span>{t.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Phones and tablets: the same list, folded away until it is wanted. */
function TocFold({ activeId, onGo }: TocProps) {
  const ref = useRef<HTMLDetailsElement>(null)
  return (
    <Card className="pv-toc-card">
      <details ref={ref} className="pv-toc">
        <summary className="pv-toc-sum">
          Table of contents
          <span className="pv-toc-meta">{TOC.length} sections</span>
          <ChevronDown className="pv-chev" aria-hidden="true" />
        </summary>
        <nav aria-label="Table of contents">
          <ol role="list">
            {TOC.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  aria-current={t.id === activeId ? "location" : undefined}
                  onClick={(e) => {
                    if (ref.current) ref.current.open = false // fold first, so the scroll below measures the final layout
                    onGo(t.id)(e)
                  }}
                >
                  <span className="pv-toc-num">{t.num}</span>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
    </Card>
  )
}

function SectionView({ section, active, onGo }: { section: Section; active: boolean; onGo: GoHandler }) {
  const { num, label } = splitTitle(section.title)
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className={cx("pv-sec", active && "is-active")}>
      <h2 id={`${section.id}-title`} className="pv-h2">
        {/* mouse-only shortcut to this section's link; keyboard and screen-reader users have the contents list */}
        <a href={`#${section.id}`} onClick={onGo(section.id)} className="pv-anchor" aria-hidden="true" tabIndex={-1}>
          <Link2 className="h-4 w-4" />
        </a>
        {num && <span className="pv-num">{num}</span>}
        {label}
      </h2>
      {section.blocks.map((block, i) => <BlockView key={i} block={block} />)}
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   STYLES — scoped under .pv-root, token-driven.
   Prefixed with .pv-root so they win over utility classes on the shadcn Card.
   ════════════════════════════════════════════════════════════════ */
const CSS = `
/* Size. On mouse-driven screens the page is drawn at 90%, which is what 90% browser zoom looks like.
   Every size here is in rem, so lowering the root size scales all of it, your Navbar's rem sizes included.
   The rule exists only while this page is mounted. Touch screens stay at 100% to keep 44px tap targets.
   Want it on every page instead? Put  html { font-size: 90%; }  in globals.css and delete this rule. */
@media (hover: hover) and (pointer: fine) {
  html:has(.pv-root) { font-size: 90%; }
}
html:has(.pv-root) { background-color: #000; } /* rubber-band overscroll shows the page colour, not the app's */

.pv-root {
  --pv-line: #27272a;
  --pv-line-strong: #3f3f46;
  --pv-text: #f4f4f5;
  --pv-body: #d4d4d8;
  --pv-muted: #a1a1aa;
  --pv-accent: #34d399;
  --pv-accent-deep: #10b981;
  --pv-accent-edge: #059669;
  --pv-surface: rgba(9, 9, 11, 0.72);
  --pv-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  color-scheme: dark; /* native bits (focus, scrollbars) stay dark even if the app theme is light */
  min-height: 100vh;
  min-height: 100dvh;
}

/* reading progress: a hairline along the top edge, driven by scroll with no script (where the browser supports it) */
.pv-progress { position: fixed; z-index: 60; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, var(--pv-accent-deep), var(--pv-accent)); transform: scaleX(0); transform-origin: left; pointer-events: none; }
@supports (animation-timeline: scroll()) {
  .pv-progress { animation: pv-progress linear both; animation-timeline: scroll(root block); }
  @keyframes pv-progress { to { transform: scaleX(1); } }
}

/* ── hero ─────────────────────────────────────────────── */
.pv-root .pv-hero { position: relative; isolation: isolate; overflow: hidden; padding: 3.5rem 1.25rem 2.5rem; }
@media (min-width: 768px) { .pv-root .pv-hero { padding: 5.5rem 3rem 3.5rem; } }
.pv-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.pv-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px; background-position: left top;
  -webkit-mask-image: radial-gradient(ellipse 60% 110% at max(0px, calc(50% - 30rem)) 0%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 60% 110% at max(0px, calc(50% - 30rem)) 0%, #000 20%, transparent 75%);
}
.pv-glow { /* centred on the left edge of the page column */
  position: absolute; left: max(-12rem, calc(50% - 56rem)); top: -11rem; width: min(52rem, 150vw); height: 28rem;
  background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.05) 45%, transparent 70%);
}
.pv-hero-inner { position: relative; z-index: 1; max-width: 60rem; margin: 0 auto; } /* = the page column below: 66rem less its side padding */
.pv-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; margin: 0 0 1.1rem; font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--pv-accent); }
.pv-glyph { width: 7px; height: 14px; border-radius: 3px; background: linear-gradient(to bottom, var(--pv-accent), var(--pv-accent-deep)); box-shadow: 0 0 12px rgba(52, 211, 153, 0.5); }
.pv-root .pv-h1 { margin: 0 0 1rem; font-size: clamp(2.25rem, 1.2rem + 4.4vw, 3.75rem); line-height: 1.04; letter-spacing: -0.04em; font-weight: 800; text-wrap: balance; }
.pv-updated { display: inline-flex; margin: 0 0 1.25rem; padding: 0.3rem 0.75rem; border: 1px solid var(--pv-line); border-radius: 9999px; background: rgba(9, 9, 11, 0.6); font: 0.75rem/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: var(--pv-muted); }
.pv-root .pv-lede { display: block; margin: 0; max-width: 34rem; color: var(--pv-muted); font-size: clamp(0.95rem, 0.9rem + 0.25vw, 1.0625rem); line-height: 1.65; text-wrap: pretty; }

/* entrance: the hero rises in, then the vertebrae pop onto the rail */
.pv-rise { animation: pv-rise 0.75s var(--pv-ease-out) backwards; animation-delay: var(--d, 0ms); }
@keyframes pv-rise { from { opacity: 0; transform: translateY(14px); } }
@keyframes pv-pop { from { opacity: 0; transform: scale(0.4); } }

/* ── layout ───────────────────────────────────────────── */
.pv-wrap { max-width: 66rem; margin: 0 auto; padding: 0.5rem 1.25rem 4rem; }
@media (min-width: 768px) { .pv-wrap { padding: 1rem 3rem 6rem; } }
.pv-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; }
.pv-aside { display: none; min-width: 0; }
@media (min-width: 1024px) {
  .pv-layout { grid-template-columns: 15.5rem minmax(0, 1fr); gap: 3.5rem; }
  .pv-aside {
    display: block; position: sticky; top: 6rem; align-self: start;
    max-height: calc(100vh - 7.5rem); max-height: calc(100dvh - 7.5rem); /* a short window scrolls the list instead of cutting it off */
    margin: -0.25rem; padding: 0.25rem; overflow-y: auto; overscroll-behavior: contain;
    scrollbar-width: thin; scrollbar-color: var(--pv-line-strong) transparent;
  }
  .pv-mobile-toc { display: none; }
}
.pv-mobile-toc { margin-bottom: 2rem; }
.pv-main { min-width: 0; max-width: 42rem; }
@media (max-width: 1023.98px) { /* no rail: one centred reading column, hero included */
  .pv-hero-inner { max-width: 42rem; }
  .pv-wrap { max-width: 48rem; }
}

/* ── contents: the spine rail (1024px and up) ─────────── */
.pv-rail ol, .pv-toc ol { margin: 0; padding: 0; list-style: none; }
.pv-rail-li { --rx: 0.5rem; --ny: 1.1rem; position: relative; background: linear-gradient(var(--pv-line), var(--pv-line)) no-repeat var(--rx) 0 / 1px 100%; }
.pv-rail-li:first-child { background-position: var(--rx) 100%; background-size: 1px calc(100% - var(--ny)); }
.pv-rail-li:last-child { background-size: 1px var(--ny); }
/* the fill: two segments per item, one arriving at its node and one leaving toward the next */
.pv-rail-li::before, .pv-rail-li::after { content: ""; position: absolute; left: var(--rx); width: 1px; background: linear-gradient(to bottom, var(--pv-accent-deep), var(--pv-accent)); transform: scaleY(0); transform-origin: top; transition: transform 0.4s var(--pv-ease-out); pointer-events: none; }
.pv-rail-li::before { top: 0; height: var(--ny); }
.pv-rail-li::after { top: var(--ny); bottom: 0; }
.pv-rail-li:first-child::before, .pv-rail-li:last-child::after { display: none; }
.pv-rail-li.is-passed::before, .pv-rail-li.is-passed::after, .pv-rail-li.is-active::before { transform: scaleY(1); }

.pv-root .pv-rail-item { position: relative; display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.45rem 0.5rem 0.45rem 1.85rem; border-radius: 0.5rem; color: var(--pv-muted); font-size: 0.875rem; font-weight: 500; line-height: 1.3rem; transition: color 0.2s, background-color 0.2s; }
@media (hover: hover) { .pv-root .pv-rail-item:hover { color: var(--pv-text); background: rgba(255, 255, 255, 0.03); } }
.pv-rail-num { flex: none; width: 1.3rem; font: 500 0.75rem/1.3rem ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; color: #8b8b94; transition: color 0.2s; }
.pv-rail-li.is-active .pv-rail-item { color: var(--pv-text); }
.pv-rail-li.is-active .pv-rail-num { color: var(--pv-accent); }
.pv-node { position: absolute; left: calc(var(--rx) - 3px); top: calc(var(--ny) - 7px); width: 7px; height: 14px; border-radius: 3px; border: 1px solid var(--pv-line-strong); background: #09090b; transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.4s var(--pv-ease-out); animation: pv-pop 0.5s calc(0.3s + var(--i, 0) * 45ms) cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
.pv-rail-li.is-passed .pv-node { background: #065f46; border-color: var(--pv-accent-edge); }
.pv-rail-li.is-active .pv-node { background: var(--pv-accent); border-color: var(--pv-accent); transform: scale(1.18); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.14), 0 0 14px rgba(52, 211, 153, 0.55); }

/* ── contents: folded list (below 1024px) ─────────────── */
.pv-root .pv-toc-card { gap: 0; padding: 0; overflow: hidden; overflow: clip; border: 1px solid var(--pv-line); border-radius: 0.875rem; background: var(--pv-surface); color: inherit; box-shadow: none; }
.pv-toc-sum { display: flex; align-items: center; gap: 0.75rem; min-height: 3.25rem; padding: 0.5rem 1.1rem; list-style: none; cursor: pointer; font-size: 0.9375rem; font-weight: 600; color: var(--pv-text); transition: background-color 0.2s; -webkit-tap-highlight-color: transparent; }
.pv-toc-sum::-webkit-details-marker { display: none; }
@media (hover: hover) { .pv-toc-sum:hover { background: rgba(255, 255, 255, 0.025); } }
.pv-toc-meta { margin-left: auto; font-size: 0.8125rem; font-weight: 400; color: var(--pv-muted); }
.pv-root .pv-chev { flex: none; width: 1rem; height: 1rem; color: var(--pv-muted); transition: color 0.2s, transform 0.3s var(--pv-ease-out); }
.pv-toc[open] .pv-chev { color: var(--pv-accent); transform: rotate(180deg); }
.pv-toc nav { border-top: 1px solid var(--pv-line); padding: 0.25rem 0.5rem 0.6rem; }
.pv-toc a { display: flex; align-items: baseline; gap: 0.75rem; min-height: 2.75rem; padding: 0.55rem 0.6rem; border-radius: 0.5rem; color: var(--pv-body); font-size: 0.9375rem; line-height: 1.35; transition: color 0.2s, background-color 0.2s; }
.pv-toc a[aria-current="location"] { color: var(--pv-accent); background: rgba(16, 185, 129, 0.08); }
.pv-toc-num { flex: none; width: 1.4rem; font: 500 0.75rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; color: #8b8b94; }
.pv-toc a[aria-current="location"] .pv-toc-num { color: var(--pv-accent); }
@media (hover: hover) { .pv-toc a:hover { color: var(--pv-text); background: rgba(255, 255, 255, 0.04); } }

/* ── the policy text ──────────────────────────────────── */
.pv-sec { position: relative; scroll-margin-top: 6.5rem; }
.pv-sec + .pv-sec { margin-top: 2.25rem; padding-top: 2.25rem; border-top: 1px solid var(--pv-line); }
.pv-root .pv-h2 { position: relative; display: flex; align-items: baseline; gap: 0.75rem; margin: 0 0 1rem; font-size: 1.375rem; line-height: 1.3; font-weight: 700; letter-spacing: -0.025em; color: var(--pv-text); }
.pv-num { flex: none; font: 500 0.8125rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; color: #8b8b94; transition: color 0.3s; }
.pv-sec.is-active .pv-num, .pv-sec:target .pv-num { color: var(--pv-accent); }
.pv-anchor { display: none; position: absolute; right: 100%; top: 0.1em; margin-right: 0.6rem; width: 1.5rem; height: 1.5rem; align-items: center; justify-content: center; border-radius: 0.35rem; color: var(--pv-muted); opacity: 0; transition: opacity 0.2s, color 0.2s; }
@media (hover: hover) and (min-width: 1024px) {
  .pv-anchor { display: inline-flex; }
  .pv-h2:hover .pv-anchor { opacity: 1; }
  .pv-anchor:hover { color: var(--pv-accent); }
}
.pv-root .pv-h3 { margin: 1.75rem 0 0.5rem; font-size: 0.9375rem; line-height: 1.4; font-weight: 650; color: var(--pv-text); }
.pv-root .pv-p { margin: 0 0 1rem; color: var(--pv-body); font-size: 1rem; line-height: 1.75; text-wrap: pretty; }
.pv-list { margin: 0 0 1rem; padding: 0; list-style: none; display: grid; gap: 0.6rem; }
.pv-list li { position: relative; padding-left: 1.35rem; color: var(--pv-body); font-size: 1rem; line-height: 1.7; text-wrap: pretty; }
.pv-list li::before { content: ""; position: absolute; left: 0.2rem; top: calc(0.85em - 5px); width: 4px; height: 10px; border-radius: 2px; background: linear-gradient(to bottom, var(--pv-accent), var(--pv-accent-deep)); }
.pv-note { display: flex; gap: 0.75rem; margin: 0 0 1rem; padding: 0.9rem 1rem; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 0.75rem; background: rgba(245, 158, 11, 0.07); color: #fde68a; }
.pv-note svg { flex: none; margin-top: 0.2rem; color: #fbbf24; }
.pv-root .pv-note p { margin: 0; font-size: 0.9rem; line-height: 1.65; }
.pv-ph { padding: 0.05em 0.35em; border-radius: 0.3rem; background: rgba(245, 158, 11, 0.14); color: #fcd34d; box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.3); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.pv-link { color: var(--pv-accent); text-decoration: underline; text-decoration-color: rgba(52, 211, 153, 0.4); text-underline-offset: 3px; border-radius: 0.2rem; transition: text-decoration-color 0.2s; }
.pv-link:hover { text-decoration-color: currentColor; }
.pv-sec:target .pv-h2 { color: #fff; }

.pv-root .pv-rail-item:focus-visible, .pv-root .pv-toc a:focus-visible, .pv-root .pv-link:focus-visible, .pv-root .pv-foot a:focus-visible { outline: 2px solid var(--pv-accent); outline-offset: 2px; }
.pv-root .pv-toc-sum:focus-visible { outline: 2px solid var(--pv-accent); outline-offset: -2px; }

/* ── footer ───────────────────────────────────────────── */
.pv-foot { border-top: 1px solid var(--pv-line); }
.pv-foot-in { max-width: 66rem; margin: 0 auto; padding: 1.5rem 1.25rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 0.75rem; font-size: 0.75rem; color: var(--pv-muted); }
@media (min-width: 768px) { .pv-foot-in { flex-direction: row; align-items: center; padding: 1.5rem 3rem; } }
.pv-foot ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; column-gap: 1.5rem; }
@media (max-width: 639.98px) { .pv-foot ul { display: grid; grid-template-columns: repeat(3, max-content); } } /* phones: a tidy 3 × 2 grid, not one orphaned link */
.pv-foot a { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; min-height: 1.75rem; border-radius: 0.25rem; color: var(--pv-muted); transition: color 0.2s; }
@media (pointer: coarse) { .pv-foot a { min-height: 2.75rem; } }
.pv-foot a:hover, .pv-foot a[aria-current="page"] { color: var(--pv-body); }

@media (prefers-reduced-motion: reduce) {
  .pv-root *:not(.pv-progress), .pv-root *::before, .pv-root *::after {
    animation-duration: 0.01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; transition-delay: 0ms !important; scroll-behavior: auto !important;
  }
}
`

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function PrivacyPolicyPage() {
  const [activeId, lockSpy] = useScrollSpy(IDS)

  // Contents links scroll smoothly and keep the clicked section selected on the way. Modified clicks
  // (new tab, new window) and the no-script case fall back to the plain #anchor.
  const onGo = useCallback<GoHandler>(
    (id) => (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      lockSpy(id)
      document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" })
      setHash(id)
    },
    [lockSpy],
  )

  // Arriving on /privacy#cookies (or following a #link on the page) selects that section,
  // even one near the end that the page is too short to scroll up to the top.
  useEffect(() => {
    const apply = () => {
      let hash = window.location.hash.slice(1)
      try { hash = decodeURIComponent(hash) } catch { /* keep raw */ }
      if (IDS.includes(hash)) lockSpy(hash)
    }
    apply()
    window.addEventListener("hashchange", apply)
    return () => window.removeEventListener("hashchange", apply)
  }, [lockSpy])

  return (
    <div className="pv-root bg-black text-zinc-50 font-sans antialiased">
      <style>{CSS}</style>
      <div className="pv-progress" aria-hidden="true" />
      <Navbar />

      <main>
        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="pv-hero">
          <div className="pv-hero-bg" aria-hidden="true">
            <div className="pv-grid" />
            <div className="pv-glow" />
          </div>
          <div className="pv-hero-inner">
            <p className="pv-eyebrow pv-rise">
              <span className="pv-glyph" aria-hidden="true" />
              Legal
            </p>
            <h1 className="pv-h1 pv-rise" style={{ "--d": "70ms" } as CSSProperties}>Privacy Policy</h1>
            <p className="pv-updated pv-rise" style={{ "--d": "140ms" } as CSSProperties}>Last updated {LAST_UPDATED}</p>
            <p className="pv-lede pv-rise" style={{ "--d": "200ms" } as CSSProperties}>
              This page explains what information Spine collects, why, and what control you have over it. If anything here is unclear,{" "}
              <a href="#contact" onClick={onGo("contact")} className="pv-link">Section 14</a> has how to reach us.
            </p>
          </div>
        </section>

        {/* ── CONTENTS + POLICY ───────────────────────────────── */}
        <div className="pv-wrap">
          <div className="pv-mobile-toc">
            <TocFold activeId={activeId} onGo={onGo} />
          </div>
          <div className="pv-layout">
            <aside className="pv-aside">
              <TocRail activeId={activeId} onGo={onGo} />
            </aside>
            <article className="pv-main">
              {SECTIONS.map((section) => (
                <SectionView key={section.id} section={section} active={section.id === activeId} onGo={onGo} />
              ))}
            </article>
          </div>
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="pv-foot">
        <div className="pv-foot-in">
          <span>Spine · spine.io © <CurrentYear /></span>
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