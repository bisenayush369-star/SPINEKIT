import type { Metadata } from "next"
import PricingClient from "./pricing-client"

export const metadata: Metadata = {
  title: "Pricing — Spine",
  description:
    "Free forever with 5 AI generations a day, or go Pro for ₹499/month with unlimited generations, custom presets, and team sharing.",
  openGraph: {
    title: "Pricing — Spine",
    description: "Simple, transparent pricing. Free to try, no card required.",
    type: "website",
    url: "https://spine.io/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Spine",
    description: "Simple, transparent pricing. Free to try, no card required.",
  },
}

export default function Page() {
  return <PricingClient />
}