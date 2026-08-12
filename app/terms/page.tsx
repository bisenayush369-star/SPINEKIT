import type { Metadata } from "next"
import TermsClient from "./terms-client"

export const metadata: Metadata = {
  title: "Terms and Conditions — Spine",
  description: "Terms and conditions for using Spine's AI-powered scaffold generator.",
  robots: { index: true, follow: true },
}

export default function Page() {
  return <TermsClient />
}