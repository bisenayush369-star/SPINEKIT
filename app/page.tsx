"use client"

import { useState, useEffect } from "react"
import {
  Copy, Check, Download, ArrowRight, ChevronRight, ChevronDown,
  Route, Database, KeyRound, ShieldCheck, FileText, Terminal, Loader2,
  Folder, FileCode,
} from "lucide-react"
import { Button } from "../components/button"
import { Badge } from "../components/badge"
import { Textarea } from "../components/textarea"
import { Card, CardContent } from "../components/card"
import { cn } from "../lib/utils"
import Navbar from ".././components/ui/Navbar"

/* ════════════════════════════════════════════════════════════════
   NATIVE ICONS
   ════════════════════════════════════════════════════════════════ */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

/* ════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════ */
type GenState = "idle" | "generating" | "done"
type LogLine  = { t: string; c: string }
type TreeNode = { name: string; type: "file" | "dir"; id?: string; children?: TreeNode[] }
type StackId  = "nextjs" | "mern" | "micro" | "hono"

/* ════════════════════════════════════════════════════════════════
   STATIC CONFIG
   ════════════════════════════════════════════════════════════════ */
const STACKS: { id: StackId; label: string; sub: string; cmd: string }[] = [
  { id: "nextjs", label: "Next.js Fullstack", sub: "Prisma + NextAuth",     cmd: "npx create-spine@latest --stack nextjs" },
  { id: "mern",   label: "MERN Stack",          sub: "Express + MongoDB",     cmd: "npx create-spine@latest --stack mern"   },
  { id: "micro",  label: "Microservice",        sub: "Express + Mongo",       cmd: "npx create-spine@latest --stack micro"  },
  { id: "hono",   label: "Hono Edge API",       sub: "Cloudflare Workers",    cmd: "npx create-spine@latest --stack hono"   },
]

const TREES: Record<StackId, TreeNode> = {
  nextjs: { name: "spine-app", type: "dir", children: [
    { name: "src", type: "dir", children: [
      { name: "app", type: "dir", children: [
        { name: "api", type: "dir", children: [
          { name: "auth", type: "dir", children: [{ name: "[...nextauth]", type: "dir", children: [{ name: "route.ts", type: "file", id: "nextauth" }] }] },
          { name: "tasks", type: "dir", children: [{ name: "route.ts", type: "file", id: "tasks" }] },
        ] },
        { name: "layout.tsx", type: "file", id: "layout" },
      ] },
      { name: "lib", type: "dir", children: [
        { name: "auth.ts", type: "file", id: "auth" },
        { name: "prisma.ts", type: "file", id: "prisma" },
      ] },
    ] },
    { name: "prisma", type: "dir", children: [{ name: "schema.prisma", type: "file", id: "schema" }] },
    { name: ".env.example", type: "file", id: "env" },
    { name: "README.md", type: "file", id: "readme" },
  ] },
  mern: { name: "spine-mern", type: "dir", children: [
    { name: "src", type: "dir", children: [
      { name: "models", type: "dir", children: [{ name: "User.model.ts", type: "file", id: "user-model" }, { name: "Task.model.ts", type: "file", id: "dyn-model" }] },
      { name: "routes", type: "dir", children: [{ name: "auth.router.ts", type: "file", id: "auth-route" }, { name: "tasks.router.ts", type: "file", id: "dyn-route" }] },
      { name: "index.ts", type: "file", id: "index" },
    ] },
    { name: ".env.example", type: "file", id: "env" },
    { name: "README.md", type: "file", id: "readme" },
  ] },
  micro: { name: "spine-micro", type: "dir", children: [
    { name: "src", type: "dir", children: [
      { name: "controllers", type: "dir", children: [{ name: "resource.ctrl.ts", type: "file", id: "ctrl" }] },
      { name: "models", type: "dir", children: [{ name: "resource.model.ts", type: "file", id: "model" }] },
      { name: "index.ts", type: "file", id: "index" },
    ] },
    { name: ".env.example", type: "file", id: "env" },
    { name: "README.md", type: "file", id: "readme" },
  ] },
  hono: { name: "spine-hono", type: "dir", children: [
    { name: "src", type: "dir", children: [
      { name: "routes", type: "dir", children: [{ name: "index.ts", type: "file", id: "routes" }] },
      { name: "index.ts", type: "file", id: "hono-index" },
    ] },
    { name: "wrangler.toml", type: "file", id: "wrangler" },
    { name: "README.md", type: "file", id: "readme" },
  ] },
}

const CODE: Record<string, string> = {
  schema: `// prisma/schema.prisma\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n}\n\nmodel Task {\n  id     String  @id @default(cuid())\n  title  String\n  done   Boolean @default(false)\n  userId String\n  user   User    @relation(fields: [userId], references: [id])\n}`,
  readme: `# Spine App\n\n> Generated by Spine\n\nRun:\n  npx prisma db push\n  npm run dev`,
  env: `DATABASE_URL=""\nNEXTAUTH_SECRET=""`,
}
const DEFAULT_CODE = (name: string) => `// ${name}\n// Production-ready placeholder.\n`

/* ════════════════════════════════════════════════════════════════
   MOCK AI ENGINE
   ════════════════════════════════════════════════════════════════ */
function parsePrompt(text: string) {
  const t = text.toLowerCase()
  const hasPayment   = /stripe|payment|billing|subscription/.test(t)
  const hasBlog      = /\bpost\b|blog|feed|article|cms/.test(t)
  const hasEcommerce = /product|shop|ecommerce|e-commerce|\bcart\b/.test(t)

  let entity = "Task", route = "tasks"
  if (hasEcommerce) { entity = "Product"; route = "products" }
  else if (hasBlog) { entity = "Post"; route = "posts" }

  const allEntities = ["User", entity]
  if (hasPayment || hasEcommerce) allEntities.push("Subscription")
  return { hasPayment, hasBlog, hasEcommerce, entity, route, allEntities }
}

function genSchema(entity: string, hasPayment: boolean, hasEcommerce: boolean): string {
  const fields: Record<string, string> = {
    Task:    "  title String\n  body  String?\n  done  Boolean @default(false)",
    Post:    "  title      String\n  content    String\n  slug       String   @unique\n  published Boolean @default(false)",
    Product: "  name        String\n  description String?\n  price       Float\n  stock       Int      @default(0)",
  }
  const modelFields = fields[entity] || "  name String"
  const relName: Record<string, string> = { Task: "tasks Task[]", Post: "posts Post[]", Product: "products Product[]" }
  const userRel = relName[entity] || "items Item[]"
  const subField = (hasPayment || hasEcommerce) ? "\n  subscription Subscription?" : ""
  const subModel = (hasPayment || hasEcommerce) ? `\n\nmodel Subscription {\n  id               String   @id @default(cuid())\n  userId           String   @unique\n  stripeCustomerId String   @unique\n  stripePriceId    String\n  currentPeriodEnd DateTime\n  user             User     @relation(fields: [userId], references: [id])\n}` : ""

  return `// prisma/schema.prisma\n// Detected entities: User, ${entity}${(hasPayment || hasEcommerce) ? ", Subscription" : ""}\n\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n  ${userRel}${subField}\n}\n\nmodel ${entity} {\n  id String @id @default(cuid())\n${modelFields}\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n}${subModel}`
}

function genRoute(entity: string, route: string): string {
  const ent = entity.toLowerCase()
  const destructure: Record<string, string> = {
    task: "const { title, body } = await req.json()",
    post: "const { title, content, slug } = await req.json()",
    product: "const { name, price, description } = await req.json()",
  }
  const fields = destructure[ent] || "const body = await req.json()"
  return `// src/app/api/${route}/route.ts\nimport { getServerSession } from "next-auth"\nimport { NextResponse } from "next/server"\nimport { prisma } from "@/lib/prisma"\nimport { authOptions } from "@/lib/auth"\n\nexport async function GET() {\n  const session = await getServerSession(authOptions)\n  if (!session?.user?.email)\n    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })\n\n  const items = await prisma.${ent}.findMany({\n    where: { user: { email: session.user.email } },\n    orderBy: { createdAt: "desc" },\n  })\n  return NextResponse.json(items)\n}\n\nexport async function POST(req: Request) {\n  const session = await getServerSession(authOptions)\n  if (!session?.user?.email)\n    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })\n\n  ${fields}\n  const item = await prisma.${ent}.create({ data: { ...req, userId: session.user.id } })\n  return NextResponse.json(item, { status: 201 })\n}`
}

function genStripeWebhook(): string {
  return `// src/app/api/stripe/webhook/route.ts\nimport Stripe from "stripe"\nimport { headers } from "next/headers"\nimport { NextResponse } from "next/server"\nimport { prisma } from "@/lib/prisma"\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })\n\nexport async function POST(req: Request) {\n  const body = await req.text()\n  const sig = headers().get("stripe-signature")!\n  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)\n\n  if (event.type === "checkout.session.completed") {\n    const sess = event.data.object as Stripe.Checkout.Session\n    await prisma.subscription.upsert({\n      where: { userId: sess.metadata!.userId },\n      create: { userId: sess.metadata!.userId, stripeCustomerId: sess.customer as string, stripePriceId: sess.metadata!.priceId, currentPeriodEnd: new Date() },\n      update: { currentPeriodEnd: new Date() },\n    })\n  }\n  return NextResponse.json({ received: true })\n}`
}

function genCheckout(): string {
  return `// src/app/api/checkout/route.ts\nimport Stripe from "stripe"\nimport { getServerSession } from "next-auth"\nimport { NextResponse } from "next/server"\nimport { authOptions } from "@/lib/auth"\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })\n\nexport async function POST(req: Request) {\n  const session = await getServerSession(authOptions)\n  if (!session?.user?.email)\n    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })\n\n  const { priceId } = await req.json()\n  const checkout = await stripe.checkout.sessions.create({\n    mode: "payment",\n    line_items: [{ price: priceId, quantity: 1 }],\n    success_url: process.env.NEXTAUTH_URL + "/success",\n    cancel_url: process.env.NEXTAUTH_URL + "/shop",\n    metadata: { userId: session.user.id },\n  })\n  return NextResponse.json({ url: checkout.url })\n}`
}

function genMERNModel(entity: string): string {
  const fieldDefs: Record<string, string> = {
    Task:    "    title: { type: String, required: true },\n    body: String,\n    done: { type: Boolean, default: false },",
    Post:    "    title: { type: String, required: true },\n    content: { type: String, required: true },\n    slug: { type: String, required: true, unique: true },",
    Product: "    name: { type: String, required: true },\n    price: { type: Number, required: true },\n    stock: { type: Number, default: 0 },",
  }
  const fields = fieldDefs[entity] || "    name: { type: String, required: true },"
  return `// src/models/${entity}.model.ts\nimport mongoose, { Schema, Document } from "mongoose"\n\nexport interface I${entity} extends Document {\n  userId: mongoose.Types.ObjectId\n}\n\nconst ${entity}Schema = new Schema<I${entity}>(\n  {\n${fields}\n    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },\n  },\n  { timestamps: true }\n)\n\nexport const ${entity} = mongoose.model<I${entity}>("${entity}", ${entity}Schema)`
}

function genEnv(hasPayment: boolean, hasEcommerce: boolean): string {
  const stripeBlock = (hasPayment || hasEcommerce)
    ? `\n\n# Stripe\nSTRIPE_SECRET_KEY=""\nSTRIPE_WEBHOOK_SECRET=""\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""`
    : ""
  return `# Database\nDATABASE_URL="postgresql://user:pass@localhost:5432/spine_app"\n\n# NextAuth\nNEXTAUTH_URL="http://localhost:3000"\nNEXTAUTH_SECRET=""\n\n# OAuth\nGITHUB_CLIENT_ID=""\nGITHUB_CLIENT_SECRET=""${stripeBlock}`
}

function genReadme(entity: string, route: string, hasPayment: boolean, hasEcommerce: boolean): string {
  const pay = (hasPayment || hasEcommerce) ? "- **Payments** — Stripe integration\n" : ""
  return `# Spine App\n\n> Generated by Spine\n\n## What was built\n\nA ${entity.toLowerCase()} management backend with:\n- **Auth** — NextAuth v5\n- **Database** — Prisma (User, ${entity}${(hasPayment || hasEcommerce) ? ", Subscription" : ""})\n${pay}- **API** — /api/${route}\n\n## Quick start\n\n  cp .env.example .env.local\n  npx prisma db push\n  npm run dev`
}

function buildDynamicTree(stack: StackId, entity: string, route: string, hasPayment: boolean, hasEcommerce: boolean): TreeNode {
  if (stack === "mern" || stack === "micro" || stack === "hono") {
    return TREES[stack]
  }
  
  const apiChildren: TreeNode[] = [
    { name: "auth", type: "dir", children: [{ name: "[...nextauth]", type: "dir", children: [{ name: "route.ts", type: "file", id: "auth" }] }] },
    { name: route, type: "dir", children: [{ name: "route.ts", type: "file", id: "dyn-route" }] },
  ]
  if (hasPayment || hasEcommerce) apiChildren.push({ name: "stripe", type: "dir", children: [{ name: "webhook", type: "dir", children: [{ name: "route.ts", type: "file", id: "stripe" }] }] })
  if (hasEcommerce) apiChildren.push({ name: "checkout", type: "dir", children: [{ name: "route.ts", type: "file", id: "checkout" }] })

  const libChildren: TreeNode[] = [{ name: "auth.ts", type: "file", id: "auth" }, { name: "prisma.ts", type: "file", id: "prisma" }]
  if (hasPayment || hasEcommerce) libChildren.push({ name: "stripe.ts", type: "file", id: "stripelib" })

  return { name: "spine-app", type: "dir", children: [
    { name: "src", type: "dir", children: [
      { name: "app", type: "dir", children: [{ name: "api", type: "dir", children: apiChildren }, { name: "layout.tsx", type: "file", id: "layout" }] },
      { name: "lib", type: "dir", children: libChildren },
    ] },
    { name: "prisma", type: "dir", children: [{ name: "schema.prisma", type: "file", id: "schema" }] },
    { name: ".env.example", type: "file", id: "env" },
    { name: "README.md", type: "file", id: "readme" },
  ] }
}

function buildDynamicLogs(stack: StackId, route: string, hasPayment: boolean, hasEcommerce: boolean, allEntities: string[]): LogLine[] {
  const EMERALD = "#34d399", GRAY = "#71717a", LIGHT = "#a1a1aa"
  const fileCount = (stack === "nextjs" ? 8 : 6) + (hasPayment || hasEcommerce ? 2 : 0) + (hasEcommerce ? 1 : 0)
  const logs: LogLine[] = [
    { t: "$ spine generate --stack " + stack, c: EMERALD },
    { t: "▸ Parsing natural language prompt...", c: GRAY },
    { t: "▸ Entities detected: " + allEntities.join(", "), c: LIGHT },
    { t: "▸ Resolving stack: " + (STACKS.find(s => s.id === stack)?.label ?? stack), c: GRAY },
    { t: "▸ Generating database schema...", c: GRAY },
    { t: "▸ Writing src/app/api/" + route + "/route.ts...", c: GRAY },
  ]
  if (hasPayment || hasEcommerce) {
    logs.push({ t: "▸ Third-party gateway identified: Injecting Stripe infrastructure hooks...", c: EMERALD })
    logs.push({ t: "▸ Writing stripe/webhook/route.ts...", c: GRAY })
  }
  if (hasEcommerce) logs.push({ t: "▸ Writing checkout/route.ts...", c: GRAY })
  logs.push({ t: "▸ Generating README.md...", c: GRAY })
  logs.push({ t: "✓ Scaffold complete. " + fileCount + " files · 0 errors.", c: EMERALD })
  return logs
}

/* ════════════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTER
   ════════════════════════════════════════════════════════════════ */
function highlight(code: string) {
  return code.split("\n").map((line: string, i: number) => {
    const t = line.trim()
    let color = "#d4d4d8"
    if      (t.startsWith("//") || t.startsWith("#"))                      color = "#52525b"
    else if (/^(import|export) /.test(t))                                  color = "#7dd3fc"
    else if (/^model /.test(t))                                            color = "#34d399"
    else if (/^(const|async|function|interface|export const) /.test(t))   color = "#c4b5fd"
    else if (/^(return|if|else) /.test(t))                                 color = "#f9a8d4"
    else if (t.includes("@id") || t.includes("@default") || t.includes("@unique") || t.includes("@relation")) color = "#fda4af"
    else if (/^[A-Z_]+=/.test(t))                                          color = "#fde047"
    else if (t.startsWith('"') || t.includes('"'))                         color = "#86efac"
    return <div key={i} style={{ color, minHeight: "1.4em", whiteSpace: "pre" }}>{line || "\u00A0"}</div>
  })
}

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════════ */
const EXT_COLOR: Record<string, string> = { ts: "text-blue-400", tsx: "text-blue-400", prisma: "text-emerald-400", json: "text-yellow-400", md: "text-zinc-300", toml: "text-orange-400" }

function FileNode({ node, depth, activeFile, onSelect }: { node: TreeNode; depth: number; activeFile: string; onSelect: (id: string, name: string) => void }) {
  const [open, setOpen] = useState(depth < 3)
  const isFile = node.type === "file"
  const isActive = isFile && activeFile === node.id
  const ext = node.name.includes(".") ? node.name.split(".").pop() ?? "" : ""
  const color = isFile ? (EXT_COLOR[ext] ?? "text-zinc-300") : "text-zinc-400"

  return (
    <div>
      <div
        onClick={() => (isFile ? onSelect(node.id ?? "", node.name) : setOpen(!open))}
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none border-l-2 transition-colors",
          isActive ? "bg-emerald-950/40 border-emerald-500" : "border-transparent hover:bg-zinc-800/50"
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        {!isFile && (open ? <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" /> : <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />)}
        {!isFile && <Folder className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
        {isFile && <FileCode className={cn("w-3.5 h-3.5 shrink-0", color)} />}
        <span className={cn("text-xs font-mono", color)}>{node.name}</span>
      </div>
      {!isFile && open && node.children?.map((c, i) => <FileNode key={i} node={c} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />)}
    </div>
  )
}

function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <Button
      onClick={copy}
      variant="outline"
      size="sm"
      className={cn(
        "font-mono text-xs h-8 gap-1.5 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100",
        copied && "border-emerald-700 text-emerald-400 bg-emerald-950 hover:bg-emerald-950 hover:text-emerald-400",
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </Button>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Page() {
  const [activeStack, setActiveStack] = useState<StackId>("nextjs")
  const [prompt, setPrompt] = useState("")
  const [genState, setGenState] = useState<GenState>("idle")
  const [logs, setLogs] = useState<LogLine[]>([])
  const [activeFile, setActiveFile] = useState("schema")
  const [activeFileName, setActiveFileName] = useState("schema.prisma")
  const [dynamicCode, setDynamicCode] = useState<Record<string, string>>({})
  const [dynamicTree, setDynamicTree] = useState<TreeNode | null>(null)

 const generate = async () => {
    if (genState === "generating") return
    if (!prompt.trim()) {
      alert("Please describe your project first!");
      return;
    }
    
    setGenState("generating")
    setLogs([{ t: "$ Sending prompt to Spine AI Engine...", c: "#34d399" }])
    
    try {
      // 1. Call your real Gemini backend
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, stack: activeStack }),
      });

      if (!res.ok) throw new Error("Failed to generate");
      
      const data = await res.json();
      const blueprint = data.blueprint;

      // 2. Add success logs
      setLogs(prev => [
        ...prev, 
        { t: "▸ Architecture received from Gemini...", c: "#71717a" },
        { t: "▸ Injecting custom Prisma schema...", c: "#71717a" },
        { t: "✓ Scaffold complete. Ready for download.", c: "#34d399" }
      ]);

      // 3. Update the UI with real Gemini code
      const newCode: Record<string, string> = { ...CODE };
      
      if (blueprint.schemaCode) {
        newCode.schema = blueprint.schemaCode;
      }
      if (blueprint.readme) {
        newCode.readme = blueprint.readme;
      }
      // Inject the custom route Gemini made
      if (blueprint.apiRoutes && blueprint.apiRoutes.length > 0) {
        newCode["tasks"] = blueprint.apiRoutes[0].code;
        setActiveFileName(`${blueprint.apiRoutes[0].folderPath}/route.ts`);
        setActiveFile("tasks");
      }

      setDynamicCode(newCode);
      setTimeout(() => setGenState("done"), 600);

    } catch (error) {
      setLogs(prev => [...prev, { t: "✖ Error: Failed to connect to AI Engine.", c: "#ef4444" }]);
      setTimeout(() => setGenState("idle"), 2000);
    }
  }

  const selectFile = (id: string, name: string) => { setActiveFile(id); setActiveFileName(name) }
  const switchStack = (id: StackId) => { setActiveStack(id); setGenState("idle"); setLogs([]); setDynamicCode({}); setDynamicTree(null) }

  const activeCode = (genState === "done" ? dynamicCode[activeFile] : CODE[activeFile]) ?? DEFAULT_CODE(activeFileName)
  const activeTree = (genState === "done" && dynamicTree) ? dynamicTree : TREES[activeStack]
  const activeCmd  = STACKS.find(s => s.id === activeStack)?.cmd ?? ""

  return (
    <div className="bg-black min-h-screen text-zinc-50 font-sans antialiased">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-center px-5 md:px-12 py-20 md:py-28 border-b border-zinc-800">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.10) 0%, transparent 70%)" }} />
        <div className="relative max-w-2xl mx-auto">
          <Badge variant="outline" className="mb-7 bg-emerald-950 border-emerald-800 text-emerald-400 font-mono text-xs px-3 py-1">
            v0.1.0 — open beta
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-[1.05] mb-5">
            Build the backend you want.<br />
            <span className="text-emerald-400">Start with one prompt.</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
            SPINEKIT turns your product idea into a clean starter app: structured routes, database schema, auth setup, and production-ready scaffolding in minutes.
          </p>
          <div className="flex justify-center items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <span className="text-emerald-400 font-mono text-sm">$</span>
              <span className="text-zinc-400 font-mono text-sm">npx create-spine@latest</span>
            </div>
            <CopyButton text="npx create-spine@latest" />
          </div>
        </div>
      </section>

      {/* ── GENERATOR WORKSPACE ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 tracking-widest uppercase mb-2">Interactive generator</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Describe your app and generate the starter.</h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* LEFT — control panel */}
          <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-zinc-500 tracking-widest uppercase block mb-2.5">Describe your project</label>
                <Textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g., a SaaS with user auth, Stripe subscriptions, and a REST API for a task manager"
                  className="min-h-[120px] bg-zinc-950 border-zinc-700 text-zinc-200 text-sm placeholder:text-zinc-600 focus-visible:ring-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 tracking-widest uppercase block mb-2.5">Base stack</label>
                <div className="grid grid-cols-2 gap-2">
                  {STACKS.map(s => {
                    const active = activeStack === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => switchStack(s.id)}
                        className={cn(
                          "text-left rounded-lg p-2.5 border transition-colors",
                          active ? "bg-emerald-950 border-emerald-700" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        <div className={cn("text-xs font-semibold mb-0.5", active ? "text-emerald-400" : "text-zinc-300")}>{s.label}</div>
                        <div className={cn("text-[11px] font-mono", active ? "text-emerald-600" : "text-zinc-600")}>{s.sub}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                onClick={generate}
                disabled={genState === "generating"}
                className={cn(
                  "w-full font-semibold gap-2",
                  genState === "generating" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-emerald-500 hover:bg-emerald-400 text-black"
                )}
              >
                {genState === "generating" ? (<><Loader2 className="w-4 h-4 animate-spin" /> Generating scaffold...</>)
                  : genState === "done" ? "↺ Regenerate"
                  : (<>Generate scaffold <ArrowRight className="w-4 h-4" /></>)}
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT — output panel */}
          <Card className="lg:col-span-3 bg-zinc-950 border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="text-xs text-zinc-500 font-mono ml-2">
                  {genState === "done" ? "spine-output" : genState === "generating" ? "generating..." : "terminal"}
                </span>
              </div>
              {genState === "done" && (
                <div className="flex gap-2">
                  <CopyButton text={activeCmd} label="Copy cmd" />
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black h-8 text-xs gap-1.5 font-semibold">
                    <Download className="w-3.5 h-3.5" /> Download ZIP
                  </Button>
                </div>
              )}
            </div>

            {genState === "idle" && (
              <div className="flex flex-col items-center justify-center text-center py-24 px-8">
                <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-4">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-sm text-zinc-600 max-w-xs leading-relaxed">
                  Describe your project and click <span className="text-emerald-400">&quot;Generate scaffold&quot;</span> to see context-aware files appear here.
                </p>
              </div>
            )}

            {genState === "generating" && (
              <div className="p-5 font-mono text-sm leading-loose">
                {logs.map((log, i) => <div key={i} style={{ color: log.c }}>{log.t}</div>)}
                <div className="flex items-center gap-2 mt-1 text-zinc-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> working...
                </div>
              </div>
            )}

            {genState === "done" && (
              <div className="flex" style={{ minHeight: 360 }}>
                <div className="w-36 sm:w-44 shrink-0 border-r border-zinc-800 overflow-y-auto py-2">
                  <FileNode node={activeTree!} depth={0} activeFile={activeFile} onSelect={selectFile} />
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-[#040408]">
                  <div className="text-xs text-zinc-500 font-mono mb-3 pb-2.5 border-b border-zinc-800">{activeFileName}</div>
                  <div className="text-xs font-mono leading-relaxed">{highlight(activeCode)}</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 tracking-widest uppercase mb-2">What Spine injects</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-9">Not just files. A working project.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { Icon: Route,       title: "Working Route Files",  body: "Controller logic in every handler — GET, POST, PATCH, DELETE — wired to your database with session guards from the start." },
            { Icon: Database,    title: "Intelligent DB Models", body: "Prisma schemas or Mongoose models shaped to your prompt, with relationships and field types inferred automatically." },
            { Icon: KeyRound,    title: "Named .env.example",   body: "Every required environment variable pre-named and grouped by service. Not a mystery on day one." },
            { Icon: ShieldCheck, title: "Full Auth Setup",      body: "JWT middleware or NextAuth v5 — pre-configured to the stack, providers and session strategy included." },
            { Icon: FileText,    title: "Context-Aware README", body: "A generated markdown file explaining the exact architecture Spine built — structure, commands, route map." },
          ].map(({ Icon, title, body }) => (
            <Card key={title} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-4">
                  <Icon className="w-[18px] h-[18px] text-emerald-400" />
                </div>
                <h3 className="text-base font-bold tracking-tight mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="font-mono text-xs mb-3 space-y-0.5">
                <div className="text-emerald-400">$ npx create-spine@latest</div>
                <div className="text-zinc-300">&gt; Stack: Next.js Fullstack</div>
                <div className="text-zinc-300">&gt; Database: PostgreSQL</div>
                <div className="text-emerald-400">✓ Scaffolding...</div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">One command. Interactive prompts. Zero boilerplate left to write.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── TEMPLATES ───────────────────────────────────────── */}
      <section id="templates" className="max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 tracking-widest uppercase mb-2">Template library</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Hand-crafted. Actually production-ready.</h2>
        <p className="text-sm text-zinc-500 mb-9">Better than anything you&apos;ll find on a GitHub search.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: "nextjs", badge: "Most popular", title: "Next.js Fullstack",    tech: ["Next.js 14", "Prisma", "NextAuth v5", "TypeScript"], desc: "Full-stack app scaffold with App Router, database, auth, and API routes." },
            { id: "mern",   badge: null,           title: "MERN REST API",        tech: ["Express", "MongoDB", "Mongoose", "JWT"],              desc: "REST API with MVC architecture, JWT auth, and clean route separation." },
            { id: "micro",  badge: null,           title: "Express Microservice", tech: ["Express", "MongoDB", "Docker"],                        desc: "Lightweight single-responsibility microservice, clean layered architecture." },
            { id: "hono",   badge: "Edge-first",   title: "Hono Edge API",        tech: ["Hono", "Cloudflare Workers", "D1"],                    desc: "Blazing-fast edge API deployable to Cloudflare Workers in one command." },
          ].map(t => (
            <Card key={t.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold tracking-tight">{t.title}</h3>
                  {t.badge && <Badge variant="outline" className="bg-emerald-950 border-emerald-800 text-emerald-400 text-[10px]">{t.badge}</Badge>}
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">{t.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {t.tech.map(tag => <Badge key={tag} variant="outline" className="bg-zinc-950 border-zinc-700 text-zinc-500 font-mono text-[11px]">{tag}</Badge>)}
                </div>
                <CopyButton text={`npx create-spine@latest --template ${t.id}`} label={`npx create-spine --template ${t.id}`} className="w-full justify-center" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id="pricing" className="max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 tracking-widest uppercase mb-2">Pricing</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Simple. Generous free tier.</h2>
        <p className="text-sm text-zinc-500 mb-10">The core tool is free, forever. Pay when you need more.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-7">
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-2.5">Free Forever</p>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-extrabold tracking-tighter">$0</span><span className="text-sm text-zinc-500">/month</span></div>
              <div className="flex flex-col gap-2.5 mb-7">
                {["5 AI generations / day", "4 core stack templates", "npx CLI tool", "Fully anonymous"].map(f => (
                  <div key={f} className="flex items-center gap-2.5"><Check className="w-[14px] h-[14px] text-emerald-400 shrink-0" /><span className="text-sm text-zinc-400">{f}</span></div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">Start for free</Button>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950 border-emerald-700">
            <CardContent className="p-7">
              <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-2.5">Pro</p>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-extrabold tracking-tighter">$9</span><span className="text-sm text-emerald-300">/month</span></div>
              <div className="flex flex-col gap-2.5 mb-7">
                {["Unlimited AI generations", "Private saved templates", "Custom stack presets", "Team sharing"].map(f => (
                  <div key={f} className="flex items-center gap-2.5"><Check className="w-[14px] h-[14px] text-emerald-400 shrink-0" /><span className="text-sm text-emerald-100">{f}</span></div>
                ))}
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">Get Pro →</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24">
        <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-80 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
          <CardContent className="p-10 md:p-16 text-center relative">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter mb-3 leading-tight">Turn your idea into a working backend.</h2>
            <p className="text-sm text-zinc-500 mb-8">No account required. Describe the product, choose the stack, and ship faster.</p>
            <div className="flex justify-center gap-2.5 flex-wrap">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6">Generate my app →</Button>
              <Button variant="outline" className="border-zinc-700 text-zinc-400 gap-2">
                <GithubIcon className="w-4 h-4" /> Star on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
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
              {[
                { label: "Pricing", href: "/pricing" },
                { label: "Terms of Service", href: "/terms" },
                { label: "FAQ", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refund" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="text-sm text-zinc-300 transition-colors hover:text-white">
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
    </div>
  )
}