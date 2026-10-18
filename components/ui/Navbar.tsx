"use client"

import Link from "next/link"

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
]

const SPINE_BARS = [5, 8, 11, 8, 5]

function SpineBadge() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#8BE6A2] bg-[#0b0b0b]"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-[3px]">
        {SPINE_BARS.map((width, index) => (
          <div
            key={index}
            className="rounded-full bg-[#8BE6A2]"
            style={{ width, height: 2 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  return (
    <header className="w-full bg-[#050505] text-white">
      <nav aria-label="Primary" className="mx-auto max-w-[1280px] px-5 py-3 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Spinekit home" className="flex items-center gap-3">
            <SpineBadge />
            <span className="text-[1.1rem] font-black uppercase tracking-[0.12em] text-white md:text-[1.35rem]">
              SPINEKIT
            </span>
          </Link>

          <div className="flex items-center justify-center gap-8 md:gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active ? "text-[#8BE6A2]" : "text-white hover:text-[#c9f3d4]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-[12px] border border-[#8BE6A2] bg-transparent px-4 py-2 text-sm font-medium text-[#eafbf0] transition-colors hover:bg-[#8BE6A2] hover:text-[#050505] md:px-5"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  )
}