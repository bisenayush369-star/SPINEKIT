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
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
]

const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
]

const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://x.com", Icon: XIcon },
  { label: "GitHub",      href: "https://github.com", Icon: GithubIcon },
]

/* Shared site footer for the SPINEKIT website. */
export function SiteFooter() {
  const footerLinks = [
    { label: "Pricing", href: "/pricing" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund" },
  ]

  return (
    <footer className="border-t border-zinc-800 bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-10 md:py-7">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#8BE6A2] bg-[#0b0b0b]">
                <div className="flex flex-col items-center gap-[3px]">
                  {[5, 8, 11, 8, 5].map((width, index) => (
                    <div key={index} className="rounded-full bg-[#8BE6A2]" style={{ width, height: 2 }} />
                  ))}
                </div>
              </div>
              <span className="text-[1.15rem] font-black uppercase tracking-[0.12em] text-white md:text-[1.4rem]">
                SPINEKIT
              </span>
            </div>

            <p className="max-w-[24rem] text-[1.05rem] leading-[1.5] text-zinc-300">
              Rewrites your AI prompts instantly so you get better answers every time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 md:gap-x-14 md:gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-5">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} SPINEKIT. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <a
              href="https://x.com"
              aria-label="X"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}