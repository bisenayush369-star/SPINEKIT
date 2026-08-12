import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Refund Policy — Oshunt",
  description: "Oshunt's returns, refunds, and exchange policy.",
};

const quickFacts = [
  { num: "30", label: "days to request a return" },
  { num: "5–7", label: "business days to process" },
  { num: "100%", label: "refund on eligible items" },
];

const shippingRows = [
  { reason: "Changed your mind, wrong size/shade", payer: "Customer" },
  { reason: "Damaged, defective, or incorrect item shipped", payer: "Oshunt" },
];

const sectionIndex = [
  { id: "returns-window", num: "01", title: "Returns window" },
  { id: "not-returnable", num: "02", title: "What can't be returned" },
  { id: "start-a-return", num: "03", title: "How to start a return" },
  { id: "refunds", num: "04", title: "Refunds" },
  { id: "damaged-items", num: "05", title: "Damaged, defective, or incorrect items" },
  { id: "exchanges", num: "06", title: "Exchanges" },
  { id: "late-refunds", num: "07", title: "Late or missing refunds" },
  { id: "sale-items", num: "08", title: "Sale items" },
  { id: "shipping-costs", num: "09", title: "Shipping costs for returns" },
];

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#FAF8F2] text-[#12201D] font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; font-optical-sizing: auto; }
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

        @keyframes gentle-breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
        .ambient-ring { animation: gentle-breathe 9s ease-in-out infinite; }
        .ambient-ring-slow { animation: gentle-breathe 12s ease-in-out infinite; animation-delay: 1.2s; }

        @media (prefers-reduced-motion: reduce) {
          .ambient-ring, .ambient-ring-slow { animation: none; }
        }
      `}</style>

      {/* Very faint paper-grain — reinforces the print/editorial feel without weighing the page down */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0E2E2B] px-6 pb-14 pt-18 text-[#FBF6E9] sm:pb-16 sm:pt-24">
        <div
          aria-hidden
          className="ambient-ring pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="ambient-ring-slow pointer-events-none absolute -bottom-10 right-2 h-44 w-44 rounded-full border border-white/10"
        />
        <Reveal className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[#F0DFA8]">
            Oshunt · customer care
          </p>
          <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-[44px]">
            Refund policy
          </h1>
          <p className="mt-4 max-w-lg text-[16.5px] text-[#FBF6E9]/80">
            We want you to love what you ordered. If something isn&apos;t
            right, here&apos;s exactly how returns, refunds, and exchanges
            work.
          </p>
          <p className="mt-7 text-[13px] text-[#FBF6E9]/60">
            Last updated:{" "}
            <span className="rounded bg-[#B9862E]/25 px-1.5 py-0.5 text-[#F0DFA8]">
              [Month DD, YYYY]
            </span>
          </p>
        </Reveal>
      </section>

      <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-12">
        {/* Quick facts — kept as one seamless bar with hairline dividers rather than
            three separate cards; that was already the right call for this row. */}
        <Reveal>
          <Card className="mb-6 overflow-hidden border-[#DCD4BE] p-0 shadow-none">
            <div className="grid grid-cols-1 gap-px bg-[#DCD4BE] sm:grid-cols-3">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="bg-white px-5 py-6 transition-colors hover:bg-[#FBF6E9]/60">
                  <span className="block font-serif text-2xl text-[#153F3A]">
                    {fact.num}
                  </span>
                  <span className="text-[13px] text-[#4C5B57]">
                    {fact.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        {/* On this page */}
        <Reveal delay={80}>
          <Card className="mb-14 border-[#DCD4BE] bg-white shadow-none">
            <CardContent className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#4C5B57]">
                On this page
              </p>
              <nav className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {sectionIndex.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-sm text-sm text-[#4C5B57] transition-colors hover:text-[#B9862E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9862E]"
                  >
                    {s.num}. {s.title}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </Reveal>

        <PolicySection id="returns-window" index="01" title="Returns window">
          <p>
            You have <strong>30 calendar days</strong> from the delivery date
            to request a return. After 30 days, we&apos;re unable to offer a
            refund or exchange.
          </p>
          <p>
            To be eligible, your item must be unused, in its original
            condition, and in the original packaging. We may ask for proof of
            purchase, such as your order number or receipt.
          </p>
        </PolicySection>

        <PolicySection id="not-returnable" index="02" title="What can't be returned">
          <p>
            For hygiene and safety reasons, the following items can&apos;t be
            returned unless they arrive damaged or defective:
          </p>
          <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-[#B9862E]">
            <li>Opened or used skincare, haircare, or beauty products</li>
            <li>Items with a broken seal or removed hygiene sticker</li>
            <li>Gift cards</li>
            <li>Final sale or clearance items, marked as such at checkout</li>
          </ul>
        </PolicySection>

        <PolicySection id="start-a-return" index="03" title="How to start a return">
          <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-[#B9862E]">
            <li>
              Email{" "}
              <span className="rounded bg-[#B9862E]/15 px-1.5 py-0.5 text-[#7A5717]">
                [returns@oshunt.com]
              </span>{" "}
              with your order number and the reason for your return.
            </li>
            <li>
              We&apos;ll confirm eligibility and send you a return shipping
              label and instructions.
            </li>
            <li>
              Pack the item securely in its original packaging and drop it
              off at the specified carrier.
            </li>
          </ul>
          <p>
            Items sent back without first requesting a return may not be
            accepted.
          </p>
        </PolicySection>

        <PolicySection id="refunds" index="04" title="Refunds">
          <p>
            Once we receive and inspect your return, we&apos;ll notify you by
            email whether it&apos;s approved. Approved refunds are issued to
            your original payment method within{" "}
            <strong>5–7 business days</strong>. Your bank or card provider
            may take a few additional days to post the refund.
          </p>
          <div className="my-4 rounded-r-xl border-l-2 border-[#B9862E] bg-[#FBF6E9] px-5 py-4">
            <p className="text-[14.5px] text-[#0E2E2B]">
              Original shipping fees are non-refundable, unless the return is
              due to our error (wrong or defective item).
            </p>
          </div>
        </PolicySection>

        <PolicySection id="damaged-items" index="05" title="Damaged, defective, or incorrect items">
          <p>
            If your order arrives damaged, defective, or different from what
            you ordered, contact us within{" "}
            <strong>7 days of delivery</strong> with a photo of the item.
            We&apos;ll cover return shipping and send a replacement or full
            refund, whichever you prefer.
          </p>
        </PolicySection>

        <PolicySection id="exchanges" index="06" title="Exchanges">
          <p>
            The fastest way to get a different size, shade, or product is to
            return the original item and place a new order. If you&apos;d
            rather exchange directly, mention this when you email us and
            we&apos;ll do our best to accommodate it, subject to stock.
          </p>
        </PolicySection>

        <PolicySection id="late-refunds" index="07" title="Late or missing refunds">
          <p>
            If it&apos;s been longer than 10 business days since your refund
            was approved:
          </p>
          <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-[#B9862E]">
            <li>Check your bank account again</li>
            <li>Contact your card provider — posting times vary</li>
            <li>
              If it&apos;s still missing, reach out to us at{" "}
              <span className="rounded bg-[#B9862E]/15 px-1.5 py-0.5 text-[#7A5717]">
                [returns@oshunt.com]
              </span>
            </li>
          </ul>
        </PolicySection>

        <PolicySection id="sale-items" index="08" title="Sale items">
          <p>
            Only regular-priced items are eligible for a refund. Items
            purchased on sale or with a discount code are final sale, unless
            the item arrived damaged or defective.
          </p>
        </PolicySection>

        <PolicySection id="shipping-costs" index="09" title="Shipping costs for returns">
          <Card className="mb-5 mt-4 overflow-hidden border-[#DCD4BE] p-0 shadow-none">
            <Table>
              <TableHeader>
                <TableRow className="border-[#DCD4BE] hover:bg-transparent">
                  <TableHead className="bg-[#FBF6E9] font-semibold text-[#153F3A]">
                    Reason for return
                  </TableHead>
                  <TableHead className="bg-[#FBF6E9] font-semibold text-[#153F3A]">
                    Who pays return shipping
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingRows.map((row) => (
                  <TableRow key={row.reason} className="border-[#DCD4BE] hover:bg-[#FBF6E9]/60">
                    <TableCell className="text-[#4C5B57]">{row.reason}</TableCell>
                    <TableCell className="text-[#4C5B57]">{row.payer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </PolicySection>

        {/* Contact card */}
        <Reveal>
          <Card className="mt-14 border-none bg-[#153F3A] shadow-none">
            <CardContent className="p-8 text-[#FBF6E9]">
              <h2 className="mb-3 font-serif text-xl font-medium text-[#F0DFA8]">
                Need a hand?
              </h2>
              <p className="mb-2 text-[#FBF6E9]/80">
                Our team is happy to help with any return, refund, or order
                question.
              </p>
              <p className="text-[#FBF6E9]/80">
                Email{" "}
                <a
                  href="mailto:returns@oshunt.com"
                  className="border-b border-[#F0DFA8]/40 text-[#F0DFA8] no-underline transition-colors hover:border-[#F0DFA8] hover:text-[#FBF6E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0DFA8] rounded-sm"
                >
                  returns@oshunt.com
                </a>{" "}
                or visit our{" "}
                <span className="rounded bg-[#B9862E]/25 px-1.5 py-0.5">
                  [Contact Us page]
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </Reveal>
      </main>

      <footer className="relative px-6 pb-10 pt-7 text-center text-[12.5px] text-[#4C5B57]">
        This page is a template and should be reviewed against your actual
        shipping, fulfillment, and local consumer-protection requirements
        before publishing. It is not legal advice.
      </footer>
    </div>
  );
}

function PolicySection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-11 scroll-mt-8">
      <h2 className="mb-3.5 flex items-baseline gap-2.5 font-serif text-xl font-medium text-[#153F3A]">
        <span className="font-sans text-sm font-semibold text-[#B9862E]">
          {index}
        </span>
        {title}
      </h2>
      <div className="space-y-3 text-[15.5px] leading-relaxed text-[#4C5B57]">
        {children}
      </div>
    </section>
  );
}