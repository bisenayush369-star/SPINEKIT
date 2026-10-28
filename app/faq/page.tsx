"use client"

/**
 * Spine — FAQ page
 *
 * One self-contained route file: drop it in as app/faq/page.tsx.
 * Content, styles and components all live below — nothing else to wire up.
 *
 * Needs nothing beyond what the original page already imported:
 *  - lucide-react
 *  - shadcn Button, Input         (@/components/ui/*)
 *  - your existing Navbar         (@/components/ui/Navbar)
 * The question list is a built-in accordion, so there is no extra shadcn component to install.
 *
 * Make it yours:
 *  - SUPPORT_EMAIL / GITHUB_URL / CLI_COMMAND / FOOTER_LINKS just below
 *  - FAQ_CATEGORIES + FAQ_ITEMS are plain content — add, remove or reorder freely
 *  - Colours and motion live in the --spf-* tokens at the top of the CSS block
 *  - Size: on mouse-driven screens the page is drawn at 90% (see the first rule in the CSS block)
 *
 * Nav and footer markup are kept from the landing page so this still reads as part of the same site.
 * The page sets its own colours and never relies on your shadcn theme, light or dark.
 */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react"
import {
  Search, X, Link2, Route, Terminal, Database, Zap, CreditCard,
  FileCode, ShieldCheck, Copy, Check, ChevronDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/ui/Navbar"

const SUPPORT_EMAIL = "support@spine.io"
const GITHUB_URL = "https://github.com"
const CLI_COMMAND = "npx create-spine@latest"

const FOOTER_LINKS = [
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "GitHub", href: GITHUB_URL },
]

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ")

/* ════════════════════════════════════════════════════════════════
   CONTENT
   ════════════════════════════════════════════════════════════════ */
type Category = { id: string; label: string; icon: LucideIcon }
type FaqItem = { id: number; category: string; q: string; a: string; hasChip?: boolean }

const FAQ_CATEGORIES: Category[] = [
  { id: "getting-started", label: "Getting Started", icon: Route },
  { id: "cli", label: "CLI & Installation", icon: Terminal },
  { id: "stacks", label: "Stacks & Templates", icon: Database },
  { id: "usage", label: "Usage & Limits", icon: Zap },
  { id: "billing", label: "Pricing & Billing", icon: CreditCard },
  { id: "code", label: "Generated Code", icon: FileCode },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
]

const FAQ_ITEMS: FaqItem[] = [
  { id: 1, category: "getting-started", q: "What is Spine?", a: "Spine turns a plain-English description of your backend into a downloadable, production-ready scaffold. Instead of picking a stack and wiring up boilerplate by hand, you describe what you're building — Spine generates the schema, routes, and config to match." },
  { id: 2, category: "getting-started", q: "How do I generate my first scaffold?", a: "Head to the homepage, describe your backend in the prompt box, choose a baseline stack, and hit generate. No account needed — you'll get a ZIP with the full project in seconds." },
  { id: 3, category: "getting-started", q: "Do I need to create an account?", a: "No. Free generations are fully anonymous. An account only matters if you want to save templates, keep usage history, or unlock Pro features like unlimited generations." },
  { id: 4, category: "cli", q: "How do I install the CLI?", a: "Run this in your terminal — nothing to install globally. It walks you through the same prompt-and-stack flow as the website, then scaffolds the project straight into a local folder.", hasChip: true },
  { id: 5, category: "cli", q: "Does the CLI need any setup, like Node or a config file?", a: "Just Node.js and npx, which most environments already have. There's no config file to write first — the CLI asks for your prompt and stack choice interactively." },
  { id: 6, category: "stacks", q: "Which stacks does Spine support?", a: "Four baseline stacks: Next.js Fullstack, MERN, a standalone Microservice, and a Hono Edge API. Your description gets adapted to whichever one you pick, so the same prompt produces idiomatic code for that stack." },
  { id: 7, category: "stacks", q: "What's actually inside a generated scaffold?", a: "Typically a Prisma schema modeled from the entities in your prompt, REST API routes, auth scaffolding, Stripe webhook handlers if you mention payments, a README explaining the structure, and a starter .env file." },
  { id: 8, category: "stacks", q: "Can I request a new stack or template?", a: "Spine is in open beta (v0.1.0) and the template list is actively growing. Open an issue on GitHub with what you'd like to see — beta feedback directly shapes what gets added next." },
  { id: 9, category: "usage", q: "How many generations do I get for free?", a: "5 AI generations a day, no account required. The counter resets daily at midnight UTC; Pro removes the daily cap entirely." },
  { id: 10, category: "usage", q: "What if a generation doesn't come out the way I expected?", a: "Refine your prompt and generate again — being specific about entities, relationships, and auth requirements up front usually gets you closer on the first try. Each attempt does count toward your daily limit." },
  { id: 11, category: "billing", q: "What's the difference between Free and Pro?", a: "Free covers 5 generations a day across all 4 stacks, plus the CLI — genuinely usable long-term. Pro is $9/month and adds unlimited generations, private saved templates, custom stack presets, and team sharing." },
  { id: 12, category: "billing", q: "Can I cancel Pro anytime?", a: "Yes — Pro is a monthly subscription you can cancel anytime from your account settings. You'll keep Pro access through the end of the billing period you've already paid for." },
  { id: 13, category: "code", q: "Can I customize the code after downloading?", a: "Completely. Everything Spine generates is plain source you own outright — no hidden runtime dependency on Spine, no lock-in. Edit, extend, or delete anything you don't need." },
  { id: 14, category: "code", q: "Is the generated code production-ready?", a: "It's built to be a strong, working starting point — real routes, real schema, real auth — but treat it like any scaffold: review it, add your own tests, and adapt it to your team's conventions before shipping." },
  { id: 15, category: "privacy", q: "Do you store my prompts or generated code?", a: "Anonymous free generations aren't tied to an account. If you sign in and save a template, that's stored to your account so you can reuse it later — you can delete any saved template anytime from your dashboard." },
  { id: 16, category: "privacy", q: "Is Spine open source?", a: "The CLI and core generator are part of the open beta — check the GitHub repo for the current license and source, and to follow what's changing." },
]

/* ════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════ */
const slugify = (s: string) =>
  s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64).replace(/-+$/, "")

// Every question gets a readable anchor, e.g. /faq#how-do-i-install-the-cli
const SLUG_BY_ID = new Map<number, string>(FAQ_ITEMS.map((i) => [i.id, slugify(i.q)]))
const SLUGS = new Set<string>(SLUG_BY_ID.values())
const slugOf = (item: FaqItem) => SLUG_BY_ID.get(item.id) ?? String(item.id)
/** The topic a link points at: the topic itself, or the topic of the question it names. */
const topicOfHash = (hash: string) =>
  FAQ_CATEGORIES.some((c) => c.id === hash) ? hash : FAQ_ITEMS.find((i) => slugOf(i) === hash)?.category

const FAQ_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
}).replace(/</g, "\\u003c")

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const scrollBehavior = (): ScrollBehavior =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"

const setHash = (hash: string | null) => {
  try {
    window.history.replaceState(null, "", hash ? `#${hash}` : window.location.pathname + window.location.search)
  } catch { /* history unavailable (sandboxed frame) */ }
}

function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable (insecure context or permission denied) */ }
  }, [])
  return [copied, copy] as const
}

/**
 * Which topic is in view: the last section whose top has passed just under the nav.
 * `lock` pins a clicked topic while the smooth-scroll to it is still in flight.
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
      // Short last sections can never reach the line. At the very bottom, keep the topic that was
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
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>
  const re = new RegExp(`(${[...tokens].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`, "ig")
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? <mark key={i} className="spf-mark">{part}</mark> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}

// Reads the clock on the client only, never during prerender, so the page also builds under
// Next's `cacheComponents` (which rejects `new Date()` in a client render). The server and the
// hydration pass use FALLBACK_YEAR; the real year replaces it as soon as the page is interactive.
const FALLBACK_YEAR = 2026
const noopSubscribe = () => () => {}
function CurrentYear() {
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => FALLBACK_YEAR)
  return <>{year}</>
}

function CliChip() {
  const [copied, copy] = useCopy()
  return (
    <div className="spf-cli">
      <span className="spf-cli-prompt" aria-hidden="true">$</span>
      <code className="spf-cli-cmd">{CLI_COMMAND}</code>
      <button type="button" onClick={() => copy(CLI_COMMAND)} className="spf-icon-btn" aria-label={copied ? "Command copied" : "Copy command"}>
        {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  )
}

function FaqRow({
  item, open, onToggle, tokens, answerOnly,
}: {
  item: FaqItem
  open: boolean
  onToggle: () => void
  tokens: string[]
  answerOnly: boolean
}) {
  const slug = slugOf(item)
  const panelId = `faq-panel-${item.id}`
  const state = open ? "open" : "closed"
  const [linkCopied, copyLink] = useCopy()

  // Arrow keys, Home and End move between questions (WAI-ARIA accordion pattern).
  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return
    const all = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-spf-trigger]"))
    const i = all.indexOf(e.currentTarget)
    if (i < 0) return
    e.preventDefault()
    const next =
      e.key === "ArrowDown" ? all[(i + 1) % all.length]
      : e.key === "ArrowUp" ? all[(i - 1 + all.length) % all.length]
      : e.key === "Home" ? all[0]
      : all[all.length - 1]
    next?.focus()
  }

  return (
    <div id={slug} className="spf-row spf-anchor" data-state={state}>
      <h3>
        <button
          type="button"
          data-spf-trigger=""
          data-state={state}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="spf-trigger"
        >
          <span className="spf-q">
            <Highlight text={item.q} tokens={tokens} />
            {answerOnly && <span className="spf-hint">Matches in the answer</span>}
          </span>
          <ChevronDown className="spf-chev" aria-hidden="true" />
        </button>
      </h3>
      <div id={panelId} className="spf-panel" data-state={state}>
        <div className="spf-panel-inner">
          <div className="spf-panel-body">
            <p className="spf-a"><Highlight text={item.a} tokens={tokens} /></p>
            {item.hasChip && <CliChip />}
            <button
              type="button"
              className="spf-link-btn"
              onClick={() => copyLink(`${window.location.origin}${window.location.pathname}#${slug}`)}
            >
              {linkCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
              {linkCopied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type TopicItem = { cat: Category; count: number }

/** Desktop: the spine — a vertical rail of vertebrae that doubles as scroll progress. */
function TopicRail({ items, activeId, onSelect }: { items: TopicItem[]; activeId: string; onSelect: (id: string) => void }) {
  const activeIndex = Math.max(0, items.findIndex((t) => t.cat.id === activeId))
  const progress = items.length > 1 ? activeIndex / (items.length - 1) : 0
  return (
    <nav aria-label="Topics" className="spf-rail" style={{ "--n": items.length, "--spf-p": progress } as CSSProperties}>
      <div className="spf-rail-line" aria-hidden="true"><span className="spf-rail-fill" /></div>
      <ol>
        {items.map(({ cat, count }, i) => {
          const Icon = cat.icon
          const active = cat.id === activeId
          return (
            <li key={cat.id}>
              <button
                type="button"
                disabled={count === 0}
                onClick={() => onSelect(cat.id)}
                aria-current={active ? "location" : undefined}
                className={cx("spf-rail-item", active && "is-active", i < activeIndex && "is-passed")}
                style={{ "--i": i } as CSSProperties}
              >
                <span className="spf-node" aria-hidden="true" />
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{cat.label}</span>
                <span className="spf-count">{count}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Phones and tablets: the same topics as a swipeable chip row. */
function TopicChips({ items, activeId, onSelect }: { items: TopicItem[]; activeId: string; onSelect: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scroller = ref.current
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return
    const chip = scroller.querySelector<HTMLElement>('[aria-current="location"]')
    if (!chip) return
    scroller.scrollTo({ left: chip.offsetLeft - (scroller.clientWidth - chip.offsetWidth) / 2, behavior: scrollBehavior() })
  }, [activeId])
  return (
    <nav aria-label="Topics" className="spf-chips-nav">
      <div ref={ref} className="spf-chips">
        {items.map(({ cat, count }) => {
          const Icon = cat.icon
          const active = cat.id === activeId
          return (
            <button
              key={cat.id}
              type="button"
              disabled={count === 0}
              onClick={() => onSelect(cat.id)}
              aria-current={active ? "location" : undefined}
              className={cx("spf-chip", active && "is-active")}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {cat.label}
              <span className="spf-chip-count">{count}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 border border-dashed border-zinc-800 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
        <Search className="w-4 h-4 text-zinc-400" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-zinc-200 mb-1">No answers match “{query}”</p>
      <p className="text-sm text-zinc-400 mb-6 max-w-xs">Try fewer or different words, or ask us directly.</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <Button
          variant="outline"
          onClick={onClear}
          className="h-11 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Clear search
        </Button>
        <Button
          onClick={() => { window.location.href = `mailto:${SUPPORT_EMAIL}` }}
          className="h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6"
        >
          Contact support
        </Button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   STYLES — scoped under .spf-root, token-driven.
   Prefixed with .spf-root so they win over utility classes on the shadcn parts (Button, Input).
   ════════════════════════════════════════════════════════════════ */
const CSS = `
/* Size. On mouse-driven screens the page is drawn at 90%, which is what 90% browser zoom looks like.
   Every size here is in rem, so lowering the root size scales all of it, your Navbar's rem sizes included.
   The rule exists only while this page is mounted. Touch screens stay at 100% to keep 44px tap targets.
   Want it on every page instead? Put  html { font-size: 90%; }  in globals.css and delete this rule. */
@media (hover: hover) and (pointer: fine) {
  html:has(.spf-root) { font-size: 90%; }
}
html:has(.spf-root) { background-color: #000; } /* rubber-band overscroll shows the page colour, not the app's */

.spf-root {
  --spf-line: #27272a;
  --spf-line-strong: #3f3f46;
  --spf-text: #f4f4f5;
  --spf-muted: #a1a1aa;
  --spf-accent: #34d399;
  --spf-accent-deep: #10b981;
  --spf-accent-edge: #059669;
  --spf-surface: rgba(9, 9, 11, 0.72);
  --spf-surface-hi: rgba(24, 24, 27, 0.8);
  --spf-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --spf-ease-in: cubic-bezier(0.4, 0, 1, 1);
  color-scheme: dark; /* native bits (autofill, scrollbars) stay dark even if the app theme is light */
  min-height: 100vh;
  min-height: 100dvh;
}
.spf-root button:not(:disabled) { cursor: pointer; }
.spf-root .spf-anchor { scroll-margin-top: 6.5rem; }
.spf-root .spf-foot-link { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; min-height: 1.75rem; } /* 24px+ target even at 90% */
@media (pointer: coarse) { .spf-root .spf-foot-link { min-height: 2.75rem; } }
.spf-root .spf-foot-link[aria-current="page"] { color: #d4d4d8; } /* the page you are on, same as the other pages' footers */
@media (max-width: 639.98px) { .spf-root .spf-foot-list { display: grid; grid-template-columns: repeat(3, max-content); } } /* phones: a tidy 3 × 2 grid, not one orphaned link */

/* ── hero ─────────────────────────────────────────────── */
.spf-root .spf-hero { position: relative; isolation: isolate; overflow: hidden; text-align: center; border-bottom: 1px solid var(--spf-line); padding: 4rem 1.25rem 3.25rem; }
@media (min-width: 768px) { .spf-root .spf-hero { padding: 6rem 3rem 4.5rem; } }
.spf-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.spf-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px; background-position: center top;
  -webkit-mask-image: radial-gradient(ellipse 65% 85% at 50% 0%, #000 25%, transparent 78%);
  mask-image: radial-gradient(ellipse 65% 85% at 50% 0%, #000 25%, transparent 78%);
}
.spf-glow {
  position: absolute; left: 50%; top: -9rem; width: min(70rem, 150vw); height: 26rem; transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.17) 0%, rgba(16, 185, 129, 0.05) 42%, transparent 70%);
}
.spf-hero-inner { position: relative; z-index: 1; max-width: 42rem; margin: 0 auto; }
.spf-root .spf-h1 { margin: 0 0 1rem; font-size: clamp(2.25rem, 1.2rem + 4.4vw, 4rem); line-height: 1.04; letter-spacing: -0.04em; font-weight: 800; text-wrap: balance; }
.spf-root .spf-sub { margin: 0 auto 2rem; max-width: 34rem; color: var(--spf-muted); font-size: clamp(0.95rem, 0.9rem + 0.25vw, 1.0625rem); line-height: 1.65; text-wrap: pretty; }

/* the one orchestrated moment: hero rises in, the spine draws itself */
.spf-rise { animation: spf-rise 0.75s var(--spf-ease-out) backwards; animation-delay: var(--d, 0ms); }
@keyframes spf-rise { from { opacity: 0; transform: translateY(14px); } }

/* ── search ───────────────────────────────────────────── */
.spf-search { position: relative; max-width: 32rem; margin: 0 auto; border-radius: 0.75rem; transition: box-shadow 0.25s var(--spf-ease-out); }
.spf-search:focus-within { box-shadow: 0 0 0 1px rgba(52, 211, 153, 0.55), 0 0 0 5px rgba(16, 185, 129, 0.14), 0 12px 40px -14px rgba(16, 185, 129, 0.4); }
.spf-search-icon { position: absolute; left: 1rem; top: 50%; width: 1.1rem; height: 1.1rem; margin-top: -0.55rem; color: var(--spf-muted); pointer-events: none; transition: color 0.2s; }
.spf-search:focus-within .spf-search-icon { color: var(--spf-accent); }
.spf-search-end { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); display: flex; align-items: center; }
.spf-search input[type="search"]::-webkit-search-cancel-button,
.spf-search input[type="search"]::-webkit-search-decoration { -webkit-appearance: none; appearance: none; }
.spf-kbd { margin-right: 0.35rem; padding: 0.1rem 0.5rem; border: 1px solid var(--spf-line-strong); border-bottom-width: 2px; border-radius: 0.375rem; background: #0a0a0b; color: var(--spf-muted); font: 500 0.75rem/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
@media (hover: none) { .spf-kbd { display: none; } }
.spf-clear { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; color: var(--spf-muted); transition: color 0.2s, background-color 0.2s; }
.spf-clear:hover { color: var(--spf-text); background: rgba(255, 255, 255, 0.06); }

/* ── layout ───────────────────────────────────────────── */
.spf-wrap { max-width: 66rem; margin: 0 auto; padding: 2.25rem 1.25rem 4rem; }
@media (min-width: 768px) { .spf-wrap { padding: 3.5rem 3rem 6rem; } }
.spf-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; }
.spf-aside { min-width: 0; }
@media (min-width: 1024px) {
  .spf-layout { grid-template-columns: 15.5rem minmax(0, 1fr); gap: 3.5rem; }
  .spf-aside { position: sticky; top: 6rem; align-self: start; }
}
.spf-main { min-width: 0; }
.spf-section + .spf-section { margin-top: 2.75rem; }
.spf-root .spf-h2 { margin: 0 0 1rem; font-size: 1.125rem; line-height: 1.3; font-weight: 650; letter-spacing: -0.02em; color: var(--spf-text); }
.spf-results-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--spf-muted); }
.spf-results-bar button { min-height: 2.25rem; padding: 0 0.6rem; border-radius: 0.5rem; color: var(--spf-accent); font-weight: 500; }
.spf-results-bar button:hover { background: rgba(16, 185, 129, 0.1); }

/* ── topic chips (below 1024px) ───────────────────────── */
.spf-chips-nav { display: block; }
.spf-chips {
  position: relative; display: flex; gap: 0.5rem; margin: 0 -1.25rem; padding: 0.25rem 1.25rem;
  overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: none; overscroll-behavior-x: contain;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 1.25rem, #000 calc(100% - 1.25rem), transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, #000 1.25rem, #000 calc(100% - 1.25rem), transparent 100%);
}
.spf-chips::-webkit-scrollbar { display: none; }
@media (min-width: 640px) {
  .spf-chips { flex-wrap: wrap; justify-content: center; margin: 0; padding: 0; overflow: visible; -webkit-mask-image: none; mask-image: none; }
}
.spf-chip { display: inline-flex; align-items: center; gap: 0.4rem; flex: none; min-height: 2.75rem; padding: 0 1rem; border: 1px solid var(--spf-line); border-radius: 9999px; color: var(--spf-muted); font-size: 0.8125rem; font-weight: 500; white-space: nowrap; scroll-snap-align: center; transition: color 0.2s, border-color 0.2s, background-color 0.2s; }
.spf-chip:disabled { opacity: 0.4; }
.spf-chip:hover:not(:disabled) { color: var(--spf-text); border-color: var(--spf-line-strong); }
.spf-chip.is-active { color: var(--spf-accent); border-color: #065f46; background: #022c22; }
.spf-chip-count { font-variant-numeric: tabular-nums; opacity: 0.75; }
.spf-root .spf-chip:focus-visible, .spf-root .spf-rail-item:focus-visible, .spf-root .spf-link-btn:focus-visible, .spf-root .spf-icon-btn:focus-visible, .spf-root .spf-clear:focus-visible, .spf-root .spf-results-bar button:focus-visible { outline: 2px solid var(--spf-accent); outline-offset: 2px; }

/* ── the spine rail (1024px and up) ───────────────────── */
.spf-rail { --row: 2.75rem; position: relative; display: none; }
@media (min-width: 1024px) { .spf-chips-nav { display: none; } .spf-rail { display: block; } }
.spf-rail ol { margin: 0; padding: 0; list-style: none; }
.spf-rail li { height: var(--row); }
.spf-rail-line { position: absolute; left: 0.5rem; top: calc(var(--row) / 2); width: 1px; height: calc(var(--row) * (var(--n) - 1)); background: var(--spf-line); transform-origin: top; animation: spf-draw 0.9s 0.25s var(--spf-ease-out) backwards; }
.spf-rail-fill { position: absolute; inset: 0; background: linear-gradient(to bottom, var(--spf-accent-deep), var(--spf-accent)); transform: scaleY(var(--spf-p, 0)); transform-origin: top; transition: transform 0.5s var(--spf-ease-out); }
@keyframes spf-draw { from { transform: scaleY(0); } }
.spf-rail-item { position: relative; display: flex; align-items: center; gap: 0.65rem; width: 100%; height: 100%; padding: 0 0.5rem 0 1.85rem; border-radius: 0.5rem; color: var(--spf-muted); font-size: 0.875rem; font-weight: 500; text-align: left; transition: color 0.2s, background-color 0.2s; }
@media (hover: hover) { .spf-rail-item:hover:not(:disabled) { color: var(--spf-text); background: rgba(255, 255, 255, 0.03); } }
.spf-rail-item:disabled { opacity: 0.4; }
.spf-rail-item.is-active { color: var(--spf-text); }
.spf-rail-item.is-active svg { color: var(--spf-accent); }
.spf-count { margin-left: auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; color: var(--spf-muted); }
.spf-rail-item.is-active .spf-count { color: var(--spf-accent); }
.spf-node { position: absolute; left: calc(0.5rem - 3px); top: 50%; width: 7px; height: 14px; margin-top: -7px; border-radius: 3px; border: 1px solid var(--spf-line-strong); background: #09090b; transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.4s var(--spf-ease-out); animation: spf-pop 0.5s calc(0.3s + var(--i, 0) * 45ms) cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
@keyframes spf-pop { from { opacity: 0; transform: scale(0.4); } }
.spf-rail-item.is-passed .spf-node { background: #065f46; border-color: var(--spf-accent-edge); }
.spf-rail-item.is-active .spf-node { background: var(--spf-accent); border-color: var(--spf-accent); transform: scale(1.18); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.14), 0 0 14px rgba(52, 211, 153, 0.55); }

/* ── question list (built-in accordion) ───────────────── */
.spf-root .spf-group { overflow: hidden; overflow: clip; border: 1px solid var(--spf-line); border-radius: 0.875rem; background: var(--spf-surface); }
.spf-root .spf-row { position: relative; border-bottom: 0; transition: background-color 0.25s; }
.spf-root .spf-row + .spf-row { border-top: 1px solid var(--spf-line); }
.spf-root .spf-row::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; z-index: 1; background: linear-gradient(to bottom, var(--spf-accent), var(--spf-accent-deep)); transform: scaleY(0); transform-origin: top; transition: transform 0.2s var(--spf-ease-in); }
.spf-root .spf-row[data-state="open"] { background: var(--spf-surface-hi); }
.spf-root .spf-row[data-state="open"]::before { transform: scaleY(1); transition: transform 0.35s var(--spf-ease-out); }
.spf-root .spf-row > h3 { margin: 0; }

.spf-root .spf-trigger { display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; min-height: 3.5rem; margin: 0; padding: 1rem 1.1rem; border: 0; border-radius: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; scroll-margin-top: 6.5rem; scroll-margin-bottom: 2rem; transition: background-color 0.2s; }
@media (min-width: 640px) { .spf-root .spf-trigger { padding: 1.1rem 1.4rem; } }
@media (hover: hover) { .spf-root .spf-trigger:hover { background: rgba(255, 255, 255, 0.025); } .spf-root .spf-trigger:hover .spf-q { color: #fff; } }
.spf-root .spf-trigger:focus-visible { outline: 2px solid var(--spf-accent); outline-offset: -2px; }
.spf-root .spf-chev { flex: none; width: 1rem; height: 1rem; color: var(--spf-muted); transition: color 0.2s, transform 0.3s var(--spf-ease-out); }
.spf-root .spf-trigger[data-state="open"] .spf-chev { color: var(--spf-accent); transform: rotate(180deg); }
.spf-q { display: block; font-size: 0.9375rem; font-weight: 500; line-height: 1.45; color: #e4e4e7; transition: color 0.2s; }
@media (min-width: 640px) { .spf-q { font-size: 1rem; } }
.spf-hint { display: block; margin-top: 0.15rem; font-size: 0.75rem; font-weight: 400; color: var(--spf-muted); }
.spf-mark { padding: 0 0.12em; border-radius: 0.2rem; background: rgba(52, 211, 153, 0.18); color: #a7f3d0; box-shadow: inset 0 0 0 1px rgba(52, 211, 153, 0.25); }

/* answer panel: a grid row that goes 0fr → 1fr, so the height animates without being measured.
   Opens slower than it closes. Closed panels are visibility:hidden (out of tab order and the accessibility tree);
   the delay on that switch lets the close animation finish first. */
.spf-root .spf-panel { display: grid; grid-template-rows: 0fr; opacity: 0; visibility: hidden; transition: grid-template-rows 0.2s var(--spf-ease-in), opacity 0.2s var(--spf-ease-in), visibility 0s linear 0.2s; }
.spf-root .spf-panel[data-state="open"] { grid-template-rows: 1fr; opacity: 1; visibility: visible; transition: grid-template-rows 0.32s var(--spf-ease-out), opacity 0.32s var(--spf-ease-out), visibility 0s; }
.spf-root .spf-panel-inner { min-height: 0; overflow: hidden; }
.spf-panel-body { padding: 0 1.1rem 1.25rem; }
@media (min-width: 640px) { .spf-panel-body { padding: 0 1.4rem 1.4rem; } }
.spf-a { margin: 0; max-width: 62ch; color: var(--spf-muted); font-size: 0.9375rem; line-height: 1.75; text-wrap: pretty; }

.spf-cli { display: flex; align-items: center; gap: 0.5rem; max-width: 22rem; min-height: 2.75rem; margin-top: 0.9rem; padding: 0 0.4rem 0 0.9rem; border: 1px solid var(--spf-line); border-radius: 0.6rem; background: #050506; }
.spf-cli-prompt { color: var(--spf-accent); font: 0.8125rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.spf-cli-cmd { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #d4d4d8; font: 0.8125rem/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background: none; padding: 0; }
.spf-icon-btn { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; color: var(--spf-muted); transition: color 0.2s, background-color 0.2s; }
.spf-icon-btn:hover { color: var(--spf-text); background: rgba(255, 255, 255, 0.06); }
.spf-link-btn { display: inline-flex; align-items: center; gap: 0.4rem; min-height: 2.25rem; margin: 0.6rem 0 -0.5rem -0.6rem; padding: 0 0.6rem; border-radius: 0.5rem; color: var(--spf-muted); font-size: 0.8125rem; font-weight: 500; transition: color 0.2s, background-color 0.2s; }
.spf-link-btn:hover { color: var(--spf-accent); background: rgba(16, 185, 129, 0.08); }
@media (pointer: coarse) { .spf-link-btn { min-height: 2.75rem; } }

@media (prefers-reduced-motion: reduce) {
  .spf-root *, .spf-root *::before, .spf-root *::after {
    animation-duration: 0.01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; transition-delay: 0ms !important; scroll-behavior: auto !important;
  }
}
`

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function FaqPage() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmed = query.trim()
  const tokens = useMemo(() => trimmed.toLowerCase().split(/\s+/).filter(Boolean), [trimmed])
  const searching = tokens.length > 0

  // Every word must appear in the question or the answer.
  const results = useMemo(
    () =>
      FAQ_ITEMS.map((item) => {
        const inQuestion = tokens.every((t) => item.q.toLowerCase().includes(t))
        const inEither = tokens.every((t) => `${item.q} ${item.a}`.toLowerCase().includes(t))
        return { item, inEither, answerOnly: searching && inEither && !inQuestion }
      }).filter((r) => r.inEither),
    [tokens, searching],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>()
    FAQ_CATEGORIES.forEach((c) => map.set(c.id, []))
    results.forEach((r) => map.get(r.item.category)?.push(r))
    return map
  }, [results])

  const topics: TopicItem[] = FAQ_CATEGORIES.map((cat) => ({ cat, count: grouped.get(cat.id)?.length ?? 0 }))
  const visibleIds = topics.filter((t) => t.count > 0).map((t) => t.cat.id)

  const [spyId, lockSpy] = useScrollSpy(visibleIds)
  const activeId = visibleIds.includes(spyId) ? spyId : (visibleIds[0] ?? "") // nothing selected when there are no results

  // Several questions can be open at once. Opening one puts it in the URL, so it can be shared.
  const toggle = (slug: string) => {
    const wasOpen = open.includes(slug)
    setOpen(wasOpen ? open.filter((s) => s !== slug) : [...open, slug])
    if (!wasOpen) setHash(slug)
    else if (window.location.hash === `#${slug}`) setHash(null)
  }

  const goTo = (id: string) => {
    lockSpy(id)
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" })
    setHash(id)
  }

  const clearSearch = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  // "/" jumps to search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      e.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Deep links: /faq#how-do-i-install-the-cli opens and scrolls to that question.
  useEffect(() => {
    let timer: number | undefined
    const apply = () => {
      const raw = window.location.hash.slice(1)
      if (!raw) return
      let hash = raw
      try { hash = decodeURIComponent(raw) } catch { /* keep raw */ }
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (SLUGS.has(hash)) setOpen((prev) => (prev.includes(hash) ? prev : [...prev, hash]))
        document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" })
        // Keep the linked topic selected even when the page ends before it can reach the top.
        const topic = topicOfHash(hash)
        if (topic) lockSpy(topic)
      }, 60)
    }
    apply()
    window.addEventListener("hashchange", apply)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("hashchange", apply)
    }
  }, [lockSpy])

  const onSearchKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (query) setQuery("")
      else e.currentTarget.blur()
    } else if (e.key === "ArrowDown") {
      const first = document.querySelector<HTMLButtonElement>("[data-spf-trigger]")
      if (first) { e.preventDefault(); first.focus() }
    }
  }

  const announce = !searching
    ? ""
    : results.length === 0
      ? `No answers match “${trimmed}”`
      : `${results.length} ${results.length === 1 ? "answer" : "answers"} for “${trimmed}”`

  return (
    <div className="spf-root bg-black text-zinc-50 font-sans antialiased">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />

      <Navbar />

      <main>
        {/* ── HERO + SEARCH ───────────────────────────────────── */}
        <section className="spf-hero">
          <div className="spf-hero-bg" aria-hidden="true">
            <div className="spf-grid" />
            <div className="spf-glow" />
          </div>
          <div className="spf-hero-inner">
            <h1 className="spf-h1 spf-rise">Frequently asked questions</h1>
            <p className="spf-sub spf-rise" style={{ "--d": "90ms" } as CSSProperties}>
              Everything you need to know about generating, customizing, and shipping with Spine. Can&apos;t find it here? Reach out below.
            </p>
            <div role="search" className="spf-search spf-rise" style={{ "--d": "180ms" } as CSSProperties}>
              <Search className="spf-search-icon" aria-hidden="true" />
              <Input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKeyDown}
                placeholder="Search questions..."
                aria-label="Search questions"
                aria-controls="faq-results"
                aria-keyshortcuts="/"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                className="h-12 w-full rounded-xl border-zinc-800 bg-zinc-950/80 pl-11 pr-14 text-base md:text-base text-zinc-50 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-emerald-500/60"
              />
              <div className="spf-search-end">
                {query ? (
                  <button type="button" onClick={clearSearch} className="spf-clear" aria-label="Clear search">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <kbd className="spf-kbd" aria-hidden="true">/</kbd>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── TOPICS + QUESTIONS ──────────────────────────────── */}
        <div className="spf-wrap">
          <div className="spf-layout">
            <aside className="spf-aside">
              <TopicChips items={topics} activeId={activeId} onSelect={goTo} />
              <TopicRail items={topics} activeId={activeId} onSelect={goTo} />
            </aside>

            <div id="faq-results" className="spf-main">
              <p className="sr-only" role="status" aria-live="polite">{announce}</p>

              {searching && results.length > 0 && (
                <div className="spf-results-bar">
                  <span aria-hidden="true">{announce}</span>
                  <button type="button" onClick={clearSearch}>Clear</button>
                </div>
              )}

              {results.length === 0 ? (
                <EmptyState query={trimmed} onClear={clearSearch} />
              ) : (
                FAQ_CATEGORIES.filter((c) => (grouped.get(c.id)?.length ?? 0) > 0).map((cat) => (
                  <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} className="spf-section spf-anchor">
                    <h2 id={`${cat.id}-title`} className="spf-h2">{cat.label}</h2>
                    <div className="spf-group">
                      {grouped.get(cat.id)!.map(({ item, answerOnly }) => {
                        const slug = slugOf(item)
                        return (
                          <FaqRow
                            key={item.id}
                            item={item}
                            open={open.includes(slug)}
                            onToggle={() => toggle(slug)}
                            tokens={tokens}
                            answerOnly={answerOnly}
                          />
                        )
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 md:px-12 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <span className="text-xs text-zinc-400">Spine · spine.io © <CurrentYear /></span>
          <nav aria-label="Footer">
            <ul className="spf-foot-list flex flex-wrap gap-x-6">
              {FOOTER_LINKS.map(({ label, href }) => {
                const cls = "spf-foot-link text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                return (
                  <li key={label}>
                    {href.startsWith("http") ? (
                      <a href={href} className={cls}>{label}</a>
                    ) : (
                      <Link href={href} className={cls} aria-current={href === "/faq" ? "page" : undefined}>{label}</Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}