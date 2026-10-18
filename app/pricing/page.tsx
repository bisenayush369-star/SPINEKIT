import type { Metadata } from "next"
import Navbar from "../../components/ui/Navbar"

export const metadata: Metadata = {
  title: "Pricing — SPINEKIT",
  description:
    "Simple pricing for backend generation and starter app scaffolding.",
  openGraph: {
    title: "Pricing — SPINEKIT",
    description: "Simple, transparent pricing for backend starter generation.",
    type: "website",
    url: "https://spinekit.com/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — SPINEKIT",
    description: "Simple, transparent pricing for backend starter generation.",
  },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 text-zinc-100">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">Pricing</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Simple pricing for shipping better backends</h1>
          <p className="mt-3 max-w-xl text-zinc-400">
            Free tier gives you five AI generations per day. Go Pro for unlimited scaffold generation,
            saved templates, and team collaboration.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-6">
              <p className="text-lg font-semibold">Free</p>
              <p className="mt-3 text-3xl font-bold">$0</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>• 5 generations per day</li>
                <li>• 4 starter stacks</li>
                <li>• Downloadable generated code</li>
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6">
              <p className="text-lg font-semibold text-emerald-400">Pro</p>
              <p className="mt-3 text-3xl font-bold">₹499<span className="text-base text-zinc-400">/month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                <li>• Unlimited generations</li>
                <li>• Saved templates and presets</li>
                <li>• Team sharing and collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}