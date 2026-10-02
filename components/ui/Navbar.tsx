"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
]

const SPINE_BARS = [5, 8, 11, 8, 5]

function SpineBadge() {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#9BE8B9] bg-[#090909] shadow-[inset_0_0_0_1px_rgba(155,232,185,0.15)]"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1">
        {SPINE_BARS.map((width, index) => (
          <div
            key={index}
            className="rounded-full bg-[#9BE8B9]"
            style={{ width, height: 2 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-[#050505] text-white">
      <nav aria-label="Primary" className="mx-auto max-w-[1280px] px-5 py-4 md:px-8">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" aria-label="Toravy home" className="flex items-center gap-3">
            <SpineBadge />
            <span className="text-[1.85rem] font-black uppercase tracking-[0.14em] text-[#F5F5F5]">
              TORAVY
            </span>
          </Link>

          <div className="hidden items-center justify-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active ? "text-[#9BE8B9]" : "text-white hover:text-[#c9f3d4]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-[14px] border border-[#9BE8B9] bg-transparent px-5 py-2 text-sm font-medium text-[#EAFBF0] transition-colors hover:bg-[#9BE8B9] hover:text-[#050505]"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="text-white md:hidden"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="flex flex-col gap-4 border-t border-emerald-500/30 px-2 pb-5 pt-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium ${
                  link.active ? "text-[#9BE8B9]" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="mt-1 inline-flex items-center justify-center rounded-[14px] border border-[#9BE8B9] px-5 py-2.5 text-sm font-medium text-[#EAFBF0]"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}