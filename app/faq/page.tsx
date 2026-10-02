"use client"

/**
 * Spine — FAQ page
 * Reuses the exact nav / footer / GithubIcon / CTA-card markup from the
 * landing page so this drops in as a real route (e.g. app/faq/page.tsx)
 * without looking like a separate site.
 *
 * To wire this up for real:
 *  - Swap "mailto:support@spine.io" for your real support address
 *  - Point the GitHub link at your actual repo
 *  - FAQ_ITEMS below is plain content — edit freely, add/remove items
 */

import { useState, useMemo } from "react"
import {
  Search, ChevronDown, Route, Terminal, Database, Zap, CreditCard,
  FileCode, ShieldCheck, Copy, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ")

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

/* ════════════════════════════════════════════════════════════════
   CONTENT
   ════════════════════════════════════════════════════════════════ */
const FAQ_CATEGORIES = [
  { id: "getting-started", label: "Getting Started", icon: Route },
  { id: "cli", label: "CLI & Installation", icon: Terminal },
  { id: "stacks", label: "Stacks & Templates", icon: Database },
  { id: "usage", label: "Usage & Limits", icon: Zap },
  { id: "billing", label: "Pricing & Billing", icon: CreditCard },
  { id: "code", label: "Generated Code", icon: FileCode },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
]

const FAQ_ITEMS = [
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
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */
function CliChip() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText("npx create-spine@latest").catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 mt-3 max-w-xs">
      <span className="text-emerald-400 font-mono text-xs">$</span>
      <span className="text-zinc-400 font-mono text-xs flex-1 truncate">npx create-spine@latest</span>
      <button onClick={copy} className="text-zinc-500 hover:text-zinc-200 transition-colors shrink-0" aria-label="Copy command">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { id: number; category: string; q: string; a: string; hasChip?: boolean }
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={cx("border rounded-lg bg-zinc-900 overflow-hidden transition-colors", isOpen ? "border-zinc-700" : "border-zinc-800")}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zinc-800/30 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-zinc-100">{item.q}</span>
        <ChevronDown className={cx("w-4 h-4 shrink-0 transition-transform duration-300", isOpen ? "rotate-180 text-emerald-400" : "text-zinc-500")} />
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isOpen ? 400 : 0, opacity: isOpen ? 1 : 0 }}>
        <div className="px-5 pb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
          {item.hasChip && <CliChip />}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 border border-dashed border-zinc-800 rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-3">
        <Search className="w-4 h-4 text-zinc-500" />
      </div>
      <p className="text-sm text-zinc-400 mb-1">No results for &quot;{query}&quot;</p>
      <p className="text-xs text-zinc-600">Try a different search, or browse by category below.</p>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function FaqPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())

  const toggle = (id: number) => {
    setOpenIds((prev: Set<number>) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const searching = query.trim().length > 0

  const filtered = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase()
      return FAQ_ITEMS.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q))
    }
    if (activeCategory !== "all") return FAQ_ITEMS.filter((i) => i.category === activeCategory)
    return FAQ_ITEMS
  }, [query, activeCategory, searching])

  const grouped = useMemo(() => {
    const map: Record<string, typeof FAQ_ITEMS> = {}
    FAQ_CATEGORIES.forEach((c) => { map[c.id] = [] })
    filtered.forEach((item) => { if (map[item.category]) map[item.category].push(item) })
    return map
  }, [filtered])

  return (
    <div className="bg-black min-h-screen text-zinc-50 font-sans antialiased">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-5 md:px-12 bg-black/85 backdrop-blur-md border-b border-zinc-800">
        <a href="/" className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="1" x2="12" y2="23" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="5" x2="18" y2="3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="12" y1="5" x2="6" y2="3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
            <line x1="12" y1="11" x2="18" y2="9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="12" y1="11" x2="6" y2="9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
            <line x1="12" y1="17" x2="18" y2="15" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="12" y1="17" x2="6" y2="15" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
          </svg>
          <span className="font-bold text-base tracking-tight">Spine</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          <a href="/#templates" className="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">Templates</a>
          <a href="/#pricing" className="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">Pricing</a>
          <span className="text-sm text-emerald-400">FAQ</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com" className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <GithubIcon className="w-4 h-4" />
          </a>
          <Button
            onClick={() => { window.location.href = "/" }}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs h-8"
          >
            Get started
          </Button>
        </div>
      </nav>

      {/* ── HERO + SEARCH ───────────────────────────────────── */}
      <section className="relative overflow-hidden text-center px-5 md:px-12 py-16 md:py-20 border-b border-zinc-800">
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none -z-10"
          style={{ width: 500, height: 260, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs text-zinc-500 tracking-widest uppercase mb-4">Support</p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">Frequently asked questions</h1>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-lg mx-auto mb-8">
            Everything you need to know about generating, customizing, and shipping with Spine. Can't find it here? Reach out below.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search questions"
              className="h-11 pl-10 bg-zinc-900 border-zinc-800 text-sm placeholder:text-zinc-600 focus-visible:ring-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES + LIST ───────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-5 md:px-12 py-14 md:py-20">
        {!searching && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory("all")}
              className={cx(
                "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
                activeCategory === "all"
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              All
            </button>
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cx(
                    "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    active
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  )}
                >
                  <Icon className="w-3 h-3" /> {cat.label}
                </button>
              )
            })}
          </div>
        )}

        {searching ? (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <EmptyState query={query.trim()} />
            ) : (
              filtered.map((item) => (
                <FaqItem key={item.id} item={item} isOpen={openIds.has(item.id)} onToggle={() => toggle(item.id)} />
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {FAQ_CATEGORIES.filter((c) => activeCategory === "all" || activeCategory === c.id).map((cat) => {
              const items = grouped[cat.id]
              if (!items || items.length === 0) return null
              const Icon = cat.icon
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-md bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tight text-zinc-100">{cat.label}</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <FaqItem key={item.id} item={item} isOpen={openIds.has(item.id)} onToggle={() => toggle(item.id)} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24">
        <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 500, height: 260, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
          />
          <CardContent className="p-10 md:p-16 text-center relative">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter mb-3 leading-tight">Still have questions?</h2>
            <p className="text-sm text-zinc-500 mb-8">Can't find the answer you're looking for? We're happy to help.</p>
            <div className="flex justify-center gap-2.5 flex-wrap">
              <Button
                onClick={() => { window.location.href = "mailto:support@spine.io" }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6"
              >
                Contact support
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
                className="border-zinc-700 text-zinc-400 gap-2"
              >
                <GithubIcon className="w-4 h-4" /> Ask on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 md:px-12 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <span className="text-xs text-zinc-600">Spine · spine.io © {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            {[
              { label: "Templates", href: "/#templates" },
              { label: "Pricing", href: "/#pricing" },
              { label: "FAQ", href: "/faq" },
              { label: "Docs", href: "#" },
              { label: "GitHub", href: "https://github.com" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}