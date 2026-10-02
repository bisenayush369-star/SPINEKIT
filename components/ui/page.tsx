import { Separator } from "@/components/ui/separator"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const PRODUCT_LINKS = [
  { label: "Templates", href: "/#templates" },
  { label: "Pricing",   href: "/pricing" },
  { label: "FAQ",       href: "/pricing#faq" },
]

const LEGAL_LINKS = [
  { label: "Terms",          href: "/terms" },
  { label: "Privacy Policy", href: "#" },
  { label: "Refund Policy",  href: "#" },
]

const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://x.com", Icon: XIcon },
  { label: "GitHub",      href: "https://github.com", Icon: GithubIcon },
]

/**
 * Site-wide footer, shared across every route.
 * Placeholder hrefs ("#"): Privacy Policy and Refund Policy — no pages exist
 * for these yet, so they're left as visible-but-inert like "Docs" was before.
 * Build those pages and swap the href in LEGAL_LINKS above.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          {/* Brand + tagline */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="1" x2="12" y2="23" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="5" x2="18" y2="3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="12" y1="5" x2="6" y2="3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
                <line x1="12" y1="11" x2="18" y2="9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="12" y1="11" x2="6" y2="9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
                <line x1="12" y1="17" x2="18" y2="15" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="12" y1="17" x2="6" y2="15" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
              </svg>
              <span className="font-display font-bold text-base tracking-tight text-zinc-50">Spine</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Describe your backend in plain English. Spine generates a production-ready, full-stack scaffold in seconds.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-10 sm:gap-x-16">
            <div className="flex flex-col gap-3">
              {PRODUCT_LINKS.map(l => (
                <a key={l.label} href={l.href} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {LEGAL_LINKS.map(l => (
                <a key={l.label} href={l.href} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800 mb-6" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs text-zinc-400">© {new Date().getFullYear()} Spine. All rights reserved.</span>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}