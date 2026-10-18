"use client"

/**
 * Spine — Privacy Policy
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
 */

import { ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/ui/Navbar"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

/* ════════════════════════════════════════════════════════════════
   CONTENT — edit freely, this is plain data
   ════════════════════════════════════════════════════════════════ */
const LAST_UPDATED = "August 8, 2026"

const SECTIONS = [
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
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */
function TocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block text-xs text-zinc-500 hover:text-emerald-400 transition-colors py-1.5 pl-3 border-l-2 border-transparent hover:border-emerald-800"
    >
      {children}
    </a>
  )
}

function Block({ block }: { block: { type: string; text?: string; items?: string[] } }) {
  if (block.type === "p") {
    return <p className="text-sm text-zinc-400 leading-relaxed mb-4">{block.text}</p>
  }
  if (block.type === "h3") {
    return <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">{block.text}</h3>
  }
  if (block.type === "list") {
    return (
      <ul className="flex flex-col gap-2 mb-4">
        {(block.items ?? []).map((item, j) => (
          <li key={j} className="text-sm text-zinc-400 leading-relaxed flex gap-2.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (block.type === "note") {
    return (
      <div className="flex gap-3 bg-amber-950/30 border border-amber-900 rounded-lg px-4 py-3 mb-4">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">{block.text}</p>
      </div>
    )
  }
  return null
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black min-h-screen text-zinc-50 font-sans antialiased">
      <Navbar />

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="max-w-3xl mx-auto px-5 md:px-12 pt-16 md:pt-20 pb-10 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 tracking-widest uppercase mb-4">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">Privacy Policy</h1>
        <p className="text-xs text-zinc-600 font-mono mb-5">Last updated {LAST_UPDATED}</p>
        <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-lg">
          This page explains what information Spine collects, why, and what control you have over it. If anything here is unclear, Section 14 has how to reach us.
        </p>
      </header>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-5 md:px-12 py-12 md:py-16">
        <details className="group lg:hidden mb-10 border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
          <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-medium text-zinc-200 hover:bg-zinc-800/30 transition-colors">
            Table of contents
            <ChevronDown className="w-4 h-4 text-zinc-500 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <nav className="px-4 pb-4 pt-1 flex flex-col gap-0.5 border-t border-zinc-800">
            {SECTIONS.map((s) => <TocLink key={s.id} href={`#${s.id}`}>{s.title}</TocLink>)}
          </nav>
        </details>

        <div className="flex gap-12">
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-20 flex flex-col gap-0.5 border-l border-zinc-800">
              {SECTIONS.map((s) => <TocLink key={s.id} href={`#${s.id}`}>{s.title}</TocLink>)}
            </nav>
          </aside>

          <div className="flex-1 min-w-0 max-w-2xl">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="mb-12 scroll-mt-20">
                <h2 className="text-lg font-bold tracking-tight text-zinc-100 mb-4">{s.title}</h2>
                {s.blocks.map((b, i) => <Block key={i} block={b} />)}
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 md:px-12 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <span className="text-xs text-zinc-600">Spine · spine.io © {new Date().getFullYear()}</span>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: "Templates", href: "/#templates" },
              { label: "Pricing", href: "/#pricing" },
              { label: "FAQ", href: "/faq" },
              { label: "Privacy", href: "/privacy" },
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