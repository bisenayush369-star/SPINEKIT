export default function TermsClient() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-zinc-100">
      <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">Terms</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Terms and conditions</h1>
        <div className="mt-6 space-y-4 text-zinc-300">
          <p>
            By using Spine, you agree to use the platform responsibly and not to infringe on the rights
            of others or the integrity of generated code or content.
          </p>
          <p>
            Generated code is provided as a starting point. You remain responsible for review, testing,
            deployment, and legal compliance for the applications you build.
          </p>
          <p>
            Subscription plans may be cancelled at any time, and paid usage is billed according to the
            applicable plan terms visible in the pricing page.
          </p>
        </div>
      </article>
    </main>
  )
}
