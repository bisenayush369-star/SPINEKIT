"use client"

/**
 * SpineKit landing page, all in one file.
 *
 * Where things are, top to bottom:
 *   DATA          copy, prices, FAQ, sample code and the SITE links (set github and x there)
 *   SMALL PIECES  style helper, icons, logo
 *   UI PIECES     code viewer, file tree, copy button, hero canvas
 *   SHADCN PARTS  Accordion and Tabs
 *   GENERATOR     the live prompt-to-scaffold box (calls POST /api/generate)
 *   SECTIONS      hero, how it works, features, stacks, pricing, FAQ, final CTA, footer
 *   SPINE RAIL    scroll rail and progress bar
 *   PAGE          the page itself
 *   CSS           every style, as one string at the very bottom (classes start with sk-)
 *
 * Needs: gsap, jszip, @base-ui/react, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono
 * and your own components/button, badge, textarea, ui/Navbar and lib/utils.
 */

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import gsap from "gsap"
// Self-hosted fonts
import "@fontsource-variable/inter"
import "@fontsource-variable/jetbrains-mono"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FileCode2,
  Folder,
  FolderOpen,
  Loader2,
  RotateCcw,
  Terminal,
} from "lucide-react"

// Self-hosted fonts: no request to Google, no layout shift from a late swap.
import "@fontsource-variable/inter/opsz.css"
import "@fontsource-variable/jetbrains-mono"

// Your own components (same paths your old page.tsx used).
import { Button } from "../components/button"
import { Badge } from "../components/badge"
import { Textarea } from "../components/textarea"
import Navbar from "../components/ui/Navbar"
import { cn } from "../lib/utils"

/* ════════════════════════════════════════════════════════════════
   DATA
   Everything the page says lives here, so copy can change without touching layout.
   Set SITE.github and SITE.x to your real links.
   ════════════════════════════════════════════════════════════════ */

type GenState = "idle" | "generating" | "done"
type LogTone = "ok" | "dim" | "err"
type LogLine = { t: string; tone: LogTone }
type TreeNode = { name: string; type: "file" | "dir"; id?: string; children?: TreeNode[] }
type StackId = "nextjs" | "mern" | "micro" | "hono"

/** Swap these for the real links. */
const SITE = {
  github: "https://github.com",
  x: "https://x.com",
  npx: "npx create-spine@latest",
}

/** Sections shown on the spine rail. ids must match the section ids on the page. */
const RAIL_SECTIONS = [
  { id: "generator", label: "Try it" },
  { id: "how", label: "How it works" },
  { id: "features", label: "What you get" },
  { id: "templates", label: "Stacks" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const

/* ── Stacks ─────────────────────────────────────────────────── */
const STACKS: { id: StackId; label: string; sub: string; cmd: string }[] = [
  { id: "nextjs", label: "Next.js Fullstack", sub: "Prisma + NextAuth", cmd: "npx create-spine@latest --stack nextjs" },
  { id: "mern", label: "MERN Stack", sub: "Express + MongoDB", cmd: "npx create-spine@latest --stack mern" },
  { id: "micro", label: "Microservice", sub: "Express + Mongo", cmd: "npx create-spine@latest --stack micro" },
  { id: "hono", label: "Hono Edge API", sub: "Cloudflare Workers", cmd: "npx create-spine@latest --stack hono" },
]

const TEMPLATES: {
  id: StackId
  badge: string | null
  title: string
  tech: string[]
  desc: string
}[] = [
  { id: "nextjs", badge: "Most popular", title: "Next.js Fullstack", tech: ["Next.js 14", "Prisma", "NextAuth v5", "TypeScript"], desc: "Full-stack app scaffold with App Router, database, auth and API routes." },
  { id: "mern", badge: null, title: "MERN REST API", tech: ["Express", "MongoDB", "Mongoose", "JWT"], desc: "REST API with MVC architecture, JWT auth and clean route separation." },
  { id: "micro", badge: null, title: "Express Microservice", tech: ["Express", "MongoDB", "Docker"], desc: "Lightweight single-responsibility microservice with a clean layered architecture." },
  { id: "hono", badge: "Edge-first", title: "Hono Edge API", tech: ["Hono", "Cloudflare Workers", "D1"], desc: "Fast edge API you can deploy to Cloudflare Workers in one command." },
]

const TREES: Record<StackId, TreeNode> = {
  nextjs: {
    name: "spine-app", type: "dir", children: [
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
    ],
  },
  mern: {
    name: "spine-mern", type: "dir", children: [
      { name: "src", type: "dir", children: [
        { name: "models", type: "dir", children: [{ name: "User.model.ts", type: "file", id: "user-model" }, { name: "Task.model.ts", type: "file", id: "dyn-model" }] },
        { name: "routes", type: "dir", children: [{ name: "auth.router.ts", type: "file", id: "auth-route" }, { name: "tasks.router.ts", type: "file", id: "dyn-route" }] },
        { name: "index.ts", type: "file", id: "index" },
      ] },
      { name: ".env.example", type: "file", id: "env" },
      { name: "README.md", type: "file", id: "readme" },
    ],
  },
  micro: {
    name: "spine-micro", type: "dir", children: [
      { name: "src", type: "dir", children: [
        { name: "controllers", type: "dir", children: [{ name: "resource.ctrl.ts", type: "file", id: "ctrl" }] },
        { name: "models", type: "dir", children: [{ name: "resource.model.ts", type: "file", id: "model" }] },
        { name: "index.ts", type: "file", id: "index" },
      ] },
      { name: ".env.example", type: "file", id: "env" },
      { name: "README.md", type: "file", id: "readme" },
    ],
  },
  hono: {
    name: "spine-hono", type: "dir", children: [
      { name: "src", type: "dir", children: [
        { name: "routes", type: "dir", children: [{ name: "index.ts", type: "file", id: "routes" }] },
        { name: "index.ts", type: "file", id: "hono-index" },
      ] },
      { name: "wrangler.toml", type: "file", id: "wrangler" },
      { name: "README.md", type: "file", id: "readme" },
    ],
  },
}

/** Which file is open first for each stack, and which node receives generated code. */
const DEFAULT_FILE: Record<StackId, { id: string; name: string }> = {
  nextjs: { id: "schema", name: "schema.prisma" },
  mern: { id: "user-model", name: "User.model.ts" },
  micro: { id: "model", name: "resource.model.ts" },
  hono: { id: "routes", name: "index.ts" },
}
const PRIMARY_ROUTE: Record<StackId, string> = { nextjs: "tasks", mern: "dyn-route", micro: "ctrl", hono: "routes" }
const PRIMARY_MODEL: Record<StackId, string | null> = { nextjs: "schema", mern: "dyn-model", micro: "model", hono: null }

const DEFAULT_CODE = (name: string) => `// ${name}\n// Production-ready placeholder.\n`

/* ── Sample files (shown before anything is generated) ───────── */
const NEXT_SCHEMA = `// prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  tasks Task[]
}

model Task {
  id        String   @id @default(cuid())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId])
}`

const NEXT_ROUTE = `// src/app/api/tasks/route.ts
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tasks = await prisma.task.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(tasks)
}`

const NEXT_ENV = `# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/spine_app"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""`

const NEXT_README = `# Spine App

> Generated by Spine

## What was built

A task management backend with:
- Auth: NextAuth v5
- Database: Prisma (User, Task)
- API: /api/tasks

## Quick start

  cp .env.example .env.local
  npx prisma db push
  npm run dev`

const MERN_USER = `// src/models/User.model.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  passwordHash: string
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>("User", UserSchema)`

const MERN_ROUTE = `// src/routes/tasks.router.ts
import { Router } from "express"
import { Task } from "../models/Task.model"

export const tasksRouter = Router()

tasksRouter.get("/", async (_req, res) => {
  const tasks = await Task.find({ userId: res.locals.userId }).sort({ createdAt: -1 })
  res.json(tasks)
})

tasksRouter.post("/", async (req, res) => {
  const task = await Task.create({ title: req.body.title, userId: res.locals.userId })
  res.status(201).json(task)
})`

const MICRO_MODEL = `// src/models/resource.model.ts
import mongoose, { Schema } from "mongoose"

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true, index: true },
  },
  { timestamps: true }
)

export const Resource = mongoose.model("Resource", ResourceSchema)`

const MICRO_CTRL = `// src/controllers/resource.ctrl.ts
import type { Request, Response } from "express"
import { Resource } from "../models/resource.model"

export async function listResources(_req: Request, res: Response) {
  res.json(await Resource.find().sort({ createdAt: -1 }))
}

export async function createResource(req: Request, res: Response) {
  const resource = await Resource.create({ name: req.body.name })
  res.status(201).json(resource)
}`

const HONO_ROUTES = `// src/routes/index.ts
import { Hono } from "hono"

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

app.get("/items", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM items").all()
  return c.json(results)
})

export default app`

const HONO_INDEX = `// src/index.ts
import { Hono } from "hono"
import routes from "./routes"

const app = new Hono()
app.route("/", routes)

export default app`

const HONO_WRANGLER = `# wrangler.toml
name = "spine-hono"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "spine"
database_id = ""`

const MONGO_ENV = `# Database
MONGODB_URI="mongodb://localhost:27017/spine"

# Auth
JWT_SECRET=""

PORT=3000`

const GENERIC_README = (run: string) => `# Spine App

> Generated by Spine

Run:
${run}`

const SAMPLES: Record<StackId, Record<string, string>> = {
  nextjs: { schema: NEXT_SCHEMA, tasks: NEXT_ROUTE, env: NEXT_ENV, readme: NEXT_README },
  mern: { "user-model": MERN_USER, "dyn-route": MERN_ROUTE, env: MONGO_ENV, readme: GENERIC_README("  npm install\n  npm run dev") },
  micro: { model: MICRO_MODEL, ctrl: MICRO_CTRL, env: MONGO_ENV, readme: GENERIC_README("  npm install\n  npm run dev") },
  hono: { routes: HONO_ROUTES, "hono-index": HONO_INDEX, wrangler: HONO_WRANGLER, readme: GENERIC_README("  npm install\n  npx wrangler dev") },
}

/** Files every generated project gets, whatever the AI returns. */
const BASE_FILES: Record<StackId, Record<string, string>> = {
  nextjs: { env: `DATABASE_URL=""\nNEXTAUTH_SECRET=""`, readme: `# Spine App\n\n> Generated by Spine\n\nRun:\n  npx prisma db push\n  npm run dev` },
  mern: { env: MONGO_ENV, readme: GENERIC_README("  npm install\n  npm run dev") },
  micro: { env: MONGO_ENV, readme: GENERIC_README("  npm install\n  npm run dev") },
  hono: { readme: GENERIC_README("  npm install\n  npx wrangler dev") },
}

const SCHEMA_SAMPLE = NEXT_SCHEMA
const ROUTE_SAMPLE = NEXT_ROUTE
const ENV_SAMPLE = NEXT_ENV
const README_SAMPLE = NEXT_README

const AUTH_TREE: TreeNode = {
  name: "src", type: "dir", children: [
    { name: "app", type: "dir", children: [
      { name: "api", type: "dir", children: [
        { name: "auth", type: "dir", children: [
          { name: "[...nextauth]", type: "dir", children: [{ name: "route.ts", type: "file", id: "nextauth" }] },
        ] },
      ] },
    ] },
    { name: "lib", type: "dir", children: [{ name: "auth.ts", type: "file", id: "auth" }] },
  ],
}

const EXAMPLE_PROMPTS = [
  { label: "SaaS with Stripe", text: "A SaaS with user auth, Stripe subscriptions, and a REST API for a task manager" },
  { label: "Blog API", text: "A blog API with posts, comments and an admin role" },
  { label: "Online shop", text: "An online shop with products, a cart and Stripe checkout" },
]

/* ── How it works ───────────────────────────────────────────── */
const STEPS = [
  { title: "Describe it", body: "Write what you're building in plain English. Mention auth, payments, a blog or a REST API." },
  { title: "Pick a stack", body: "Start from Next.js, MERN, an Express microservice or Hono on Cloudflare Workers." },
  { title: "Download and run", body: "Copy the env file, push the schema and start the dev server. The README lists the commands." },
]

/* ── Pricing ────────────────────────────────────────────────── */
const PLANS = {
  free: { name: "Free forever", price: "$0", features: ["5 AI generations / day", "4 core stack templates", "npx CLI tool", "Fully anonymous"] },
  pro: { name: "Pro", price: "$9", features: ["Unlimited AI generations", "Private saved templates", "Custom stack presets", "Team sharing"] },
}

/* ── FAQ ────────────────────────────────────────────────────── */
const FAQ = [
  { id: "what", q: "What do I get when I generate a project?", a: "A folder you can run: route handlers with session checks, a Prisma schema or Mongoose models, auth set up for your stack, a named .env.example and a README that explains what was built." },
  { id: "stacks", q: "Which stacks are supported?", a: "Next.js fullstack with Prisma and NextAuth, a MERN REST API, an Express microservice, and a Hono edge API for Cloudflare Workers." },
  { id: "account", q: "Do I need an account?", a: "No. The free tier is anonymous. You get 5 AI generations a day and the npx CLI without signing up." },
  { id: "pro", q: "What does Pro add?", a: "Unlimited AI generations, private saved templates, custom stack presets and team sharing for $9 a month." },
  { id: "edit", q: "Can I change the generated code?", a: "Yes. It's plain TypeScript in your own folder, so edit it like any other project." },
  { id: "cli", q: "How do I use the CLI?", a: "Run npx create-spine@latest and answer the prompts, or pass --stack to pick a base stack up front." },
]

/* ── Footer ─────────────────────────────────────────────────── */
const FOOTER_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Terms of Service", href: "/terms" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
]

/* ════════════════════════════════════════════════════════════════
   SMALL PIECES
   CSS-variable helper, brand icons, logo mark.
   ════════════════════════════════════════════════════════════════ */

/* ── CSS variables in the style prop ───────────────────────────── */

/** Typed helper for passing CSS custom properties through the `style` prop. */
const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties

/* ── Brand icons ───────────────────────────────────────────────── */

/* Brand icons as inline SVG (lucide dropped brand marks). Same paths as the original page. */

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/* ── Logo mark ─────────────────────────────────────────────────── */

/** The SpineKit mark: five stacked bars, 5/8/11/8/5 wide. Same geometry as the original footer logo. */
function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display: "inline-flex",
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        border: "1px solid var(--sk-accent)",
        background: "var(--sk-bg)",
      }}
    >
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        {[5, 8, 11, 8, 5].map((width, i) => (
          <span key={i} style={{ display: "block", width, height: 2, borderRadius: 9999, background: "var(--sk-accent)" }} />
        ))}
      </span>
    </span>
  )
}

/* ════════════════════════════════════════════════════════════════
   UI PIECES
   Code viewer, file tree, copy button, anchor link, hero canvas.
   ════════════════════════════════════════════════════════════════ */

/* ── Code viewer ───────────────────────────────────────────────── */

/* Tiny dependency-free highlighter. Good enough for the TS, Prisma, env,
   markdown and TOML snippets this page shows; not a general parser. */

type Lang = "ts" | "prisma" | "env" | "md" | "toml" | "text"

function langOf(name: string): Lang {
  if (name.startsWith(".env")) return "env"
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : ""
  if (ext === "prisma") return "prisma"
  if (ext === "md") return "md"
  if (ext === "toml") return "toml"
  if (ext === "example") return "env"
  return "ts"
}

const TS_KW = new Set([
  "import", "export", "from", "const", "let", "var", "async", "await", "function", "return",
  "if", "else", "new", "type", "interface", "default", "class", "extends", "throw", "try",
  "catch", "for", "of", "in", "true", "false", "null", "undefined",
])
const PRISMA_KW = new Set(["model", "enum", "datasource", "generator"])
const PRISMA_TY = new Set(["String", "Int", "Float", "Boolean", "DateTime", "Json", "Decimal", "BigInt", "Bytes"])

const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(@@?[A-Za-z]+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g

type Part = { text: string; cls?: string }

function scan(line: string, lang: Lang): Part[] {
  const parts: Part[] = []
  let last = 0
  TOKEN_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN_RE.exec(line))) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index) })
    const [text, comment, str, dec, num, ident] = m
    let cls: string | undefined
    if (comment) cls = "cm"
    else if (str) cls = "str"
    else if (dec) cls = "dec"
    else if (num) cls = "num"
    else if (ident) {
      if (lang === "prisma") {
        if (PRISMA_KW.has(ident)) cls = "kw"
        else if (PRISMA_TY.has(ident)) cls = "ty"
        else if (/^[A-Z]/.test(ident)) cls = "ty"
      } else if (TS_KW.has(ident)) cls = "kw"
      else if (/^[A-Z]/.test(ident)) cls = "ty"
    }
    parts.push({ text, cls })
    last = m.index + text.length
  }
  if (last < line.length) parts.push({ text: line.slice(last) })
  return parts
}

function renderParts(parts: Part[]) {
  return parts.map((p, i) => (p.cls ? <span key={i} className={p.cls}>{p.text}</span> : p.text))
}

function renderLine(line: string, lang: Lang) {
  const trimmed = line.trim()

  if (lang === "env") {
    if (trimmed.startsWith("#")) return <span className="cm">{line}</span>
    const m = /^(\s*)([A-Z0-9_]+)(=)(.*)$/.exec(line)
    if (m) {
      return (
        <>
          {m[1]}
          <span className="ty">{m[2]}</span>
          {m[3]}
          <span className="str">{m[4]}</span>
        </>
      )
    }
    return line
  }

  if (lang === "md") {
    if (/^#{1,6}\s/.test(trimmed)) return <span className="md-h">{line}</span>
    if (trimmed.startsWith(">")) return <span className="cm">{line}</span>
    if (/^-\s/.test(trimmed)) {
      const idx = line.indexOf("-")
      return (
        <>
          {line.slice(0, idx)}
          <span className="cm">-</span>
          {line.slice(idx + 1)}
        </>
      )
    }
    return line
  }

  if (lang === "toml") {
    if (trimmed.startsWith("#")) return <span className="cm">{line}</span>
    if (/^\[\[?.*\]\]?$/.test(trimmed)) return <span className="kw">{line}</span>
    const m = /^(\s*)([A-Za-z_]+)(\s*=\s*)(.*)$/.exec(line)
    if (m) {
      return (
        <>
          {m[1]}
          <span className="ty">{m[2]}</span>
          {m[3]}
          {renderParts(scan(m[4], "ts"))}
        </>
      )
    }
    return line
  }

  if (lang === "text") {
    if (trimmed.startsWith("#")) return <span className="cm">{line}</span>
    return line
  }

  return renderParts(scan(line, lang))
}

type CodeViewProps = {
  code: string
  /** File name, used to pick a language and to label the region. */
  name?: string
  lang?: Lang
  numbered?: boolean
  className?: string
}

/** Read-only code block. Focusable so keyboard users can scroll it. */
function CodeView({ code, name, lang, numbered = true, className }: CodeViewProps) {
  const language = lang ?? langOf(name ?? "")
  const lines = code.split("\n")
  return (
    <pre
      className={cn("sk-code", className)}
      tabIndex={0}
      aria-label={name ? `Code of ${name}` : "Code sample"}
    >
      <code>
        {lines.map((line, i) => (
          <span key={i}>
            {numbered && (
              <span className="ln" aria-hidden="true">
                {i + 1}
              </span>
            )}
            {renderLine(line, language)}
            {i < lines.length - 1 ? "\n" : ""}
          </span>
        ))}
      </code>
    </pre>
  )
}

/* ── File tree ─────────────────────────────────────────────────── */

type FileTreeProps = {
  node: TreeNode
  /** Highlights the file with this id. */
  activeId?: string
  /** When set, files become buttons. Without it the tree is a read-only preview. */
  onSelect?: (id: string, name: string) => void
  /** Folders shallower than this start open. */
  openDepth?: number
  /** Rows slide in one after another (used right after a generation finishes). */
  animate?: boolean
  className?: string
}

function FileTree({ node, activeId, onSelect, openDepth = 3, animate = false, className }: FileTreeProps) {
  return (
    <div className={cn("sk-tree", className)}>
      <ul>
        <Row
          node={node}
          depth={0}
          index={0}
          activeId={activeId}
          onSelect={onSelect}
          openDepth={openDepth}
          animate={animate}
        />
      </ul>
    </div>
  )
}

type RowProps = Required<Pick<FileTreeProps, "openDepth" | "animate">> &
  Pick<FileTreeProps, "activeId" | "onSelect"> & { node: TreeNode; depth: number; index: number }

function Row({ node, depth, index, activeId, onSelect, openDepth, animate }: RowProps) {
  const [open, setOpen] = useState(depth < openDepth)
  const isFile = node.type === "file"
  const ext = node.name.includes(".") ? (node.name.split(".").pop() ?? "") : ""
  const active = isFile && !!node.id && activeId === node.id
  const style = animate ? cssVars({ "--d": `${depth * 70 + index * 38}ms` }) : undefined
  const motion = animate ? "sk-in" : undefined

  return (
    <li>
      {isFile ? (
        onSelect ? (
          <button
            type="button"
            className={cn("sk-tree__row", motion)}
            style={style}
            data-ext={ext}
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(node.id ?? "", node.name)}
          >
            <FileCode2 className="sk-tree__icon" aria-hidden="true" />
            <span className="truncate">{node.name}</span>
          </button>
        ) : (
          <div className={cn("sk-tree__row sk-tree__row--static", motion)} style={style} data-ext={ext}>
            <FileCode2 className="sk-tree__icon" aria-hidden="true" />
            <span className="truncate">{node.name}</span>
          </div>
        )
      ) : (
        <button
          type="button"
          className={cn("sk-tree__row sk-tree__row--dir", motion)}
          style={style}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronRight className={cn("sk-tree__chev", open && "is-open")} aria-hidden="true" />
          {open ? <FolderOpen className="sk-tree__icon" aria-hidden="true" /> : <Folder className="sk-tree__icon" aria-hidden="true" />}
          <span className="truncate">{node.name}</span>
        </button>
      )}
      {!isFile && open && node.children && (
        <ul>
          {node.children.map((child, i) => (
            <Row
              key={child.name}
              node={child}
              depth={depth + 1}
              index={i}
              activeId={activeId}
              onSelect={onSelect}
              openDepth={openDepth}
              animate={animate}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

/* ── Copy button ───────────────────────────────────────────────── */

function legacyCopy(text: string) {
  try {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand("copy")
    ta.remove()
    return ok
  } catch {
    return false
  }
}

type CopyButtonProps = {
  text: string
  label?: string
  className?: string
}

function CopyButton({ text, label = "Copy", className }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = legacyCopy(text)
    }
    setState(ok ? "copied" : "failed")
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), 1800)
  }

  return (
    <>
      <Button
        type="button"
        onClick={copy}
        variant="outline"
        size="sm"
        className={cn("sk-btn sk-btn--ghost sk-btn--sm", state === "copied" && "is-done", className)}
      >
        {state === "copied" ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
        <span className="sk-copy__label">{state === "copied" ? "Copied" : state === "failed" ? "Press Ctrl+C" : label}</span>
      </Button>
      <span className="sr-only" role="status">
        {state === "copied" ? "Copied to clipboard" : ""}
      </span>
    </>
  )
}

/* ── Generate link ─────────────────────────────────────────────── */

/** Anchor to the generator that also puts the cursor in the prompt box once the scroll settles. */
function GenerateLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="#generator"
      className={className}
      onClick={() => {
        window.setTimeout(() => {
          document.getElementById("sk-prompt")?.focus({ preventScroll: true })
        }, 500)
      }}
    >
      {children}
    </a>
  )
}

/* ── Tick field (hero canvas) ──────────────────────────────────── */

const RGB = "139,230,162"

/**
 * The hero's one memorable effect.
 *
 * A lattice of short horizontal bars (the logo's vertebrae, repeated) that sway slowly.
 * Near the pointer they swivel to point at it, lengthen and light up.
 * No pointer (touch, keyboard, reduced motion): a quiet ambient sway, or a still frame.
 *
 * Cost: calm bars are one batched path per frame; only bars near the pointer are stroked
 * individually. It pauses when off screen or in a hidden tab, and never runs under
 * prefers-reduced-motion.
 */
function TickField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let w = 0
    let h = 0
    let gap = 26
    let px = -9999
    let py = -9999
    let sx = -9999
    let sy = -9999
    let hot = 0
    let hotTarget = 0
    let raf = 0
    let last = 0
    let visible = true

    const size = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      gap = w < 640 ? 30 : 26
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const still = reduce.matches
      const cols = Math.ceil(w / gap) + 1
      const rows = Math.ceil(h / gap) + 1
      const falloff = 2 * 180 * 180

      ctx.lineCap = "round"
      ctx.lineWidth = 1
      ctx.strokeStyle = `rgb(${RGB})`

      // Calm bars: a single batched path.
      ctx.globalAlpha = 0.13
      ctx.beginPath()
      const near: number[] = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * gap + (j & 1 ? gap / 2 : 0)
          const y = j * gap
          const dx = sx - x
          const dy = sy - y
          const k = hot * Math.exp(-(dx * dx + dy * dy) / falloff)
          const sway = still ? 0 : Math.sin(i * 0.31 + j * 0.23 + t * 0.0006) * 0.2
          if (k < 0.04) {
            const c = Math.cos(sway) * 4.5
            const s = Math.sin(sway) * 4.5
            ctx.moveTo(x - c, y - s)
            ctx.lineTo(x + c, y + s)
          } else {
            near.push(x, y, sway, k, dx, dy)
          }
        }
      }
      ctx.stroke()

      // Bars near the pointer: rotate toward it, grow and brighten.
      for (let n = 0; n < near.length; n += 6) {
        const x = near[n]
        const y = near[n + 1]
        const sway = near[n + 2]
        const k = near[n + 3]
        const dx = near[n + 4]
        const dy = near[n + 5]
        // A bar looks the same rotated 180deg, so take the shortest turn modulo PI.
        let d = Math.atan2(dy, dx) - sway
        d = ((((d + Math.PI / 2) % Math.PI) + Math.PI) % Math.PI) - Math.PI / 2
        const angle = sway + d * k
        const half = 4.5 + 7 * k
        const c = Math.cos(angle) * half
        const s = Math.sin(angle) * half
        ctx.globalAlpha = Math.min(0.95, 0.13 + 0.85 * k)
        ctx.beginPath()
        ctx.moveTo(x - c, y - s)
        ctx.lineTo(x + c, y + s)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const frame = (t: number) => {
      raf = 0
      if (!visible || document.hidden || reduce.matches) return
      // Ambient sway at ~30fps; full rate only while the pointer is involved.
      if (hot > 0.01 || hotTarget > 0 || t - last > 33) {
        last = t
        sx += (px - sx) * 0.2
        sy += (py - sy) * 0.2
        hot += (hotTarget - hot) * 0.1
        draw(t)
      }
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf && visible && !document.hidden && !reduce.matches) raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      if (reduce.matches) return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inside = x >= -40 && x <= r.width + 40 && y >= -40 && y <= r.height + 40
      if (inside) {
        if (hotTarget === 0) {
          sx = x
          sy = y
        }
        px = x
        py = y
        hotTarget = 1
        start()
      } else {
        hotTarget = 0
      }
    }
    const onRelease = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") hotTarget = 0
    }
    const onLeave = () => {
      hotTarget = 0
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onReduce = () => {
      if (reduce.matches) {
        stop()
        hot = 0
        hotTarget = 0
        draw(0)
      } else {
        start()
      }
    }

    const ro = new ResizeObserver(() => {
      size()
      draw(performance.now())
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup", onRelease, { passive: true })
    window.addEventListener("pointercancel", onRelease, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    reduce.addEventListener("change", onReduce)

    size()
    draw(0)
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onRelease)
      window.removeEventListener("pointercancel", onRelease)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      reduce.removeEventListener("change", onReduce)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/* ════════════════════════════════════════════════════════════════
   SHADCN PARTS
   shadcn/ui Accordion and Tabs (base style, on @base-ui/react), inlined so this file stands alone.
   ════════════════════════════════════════════════════════════════ */

/* ── Accordion ─────────────────────────────────────────────────── */

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b", className)} {...props} />
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium transition-all outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="pointer-events-none size-4 shrink-0 transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

/* ── Tabs ──────────────────────────────────────────────────────── */

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn("flex", orientation === "horizontal" && "flex-col", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("inline-flex w-fit items-center justify-center", className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

/* ════════════════════════════════════════════════════════════════
   GENERATOR
   The live prompt-to-scaffold box. Calls your POST /api/generate.
   ════════════════════════════════════════════════════════════════ */

type Blueprint = {
  schemaCode?: string
  readme?: string
  apiRoutes?: { folderPath?: string; code?: string }[]
}

class HttpError extends Error {
  status: number
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

function findName(node: TreeNode, id: string): string | undefined {
  if (node.id === id) return node.name
  for (const child of node.children ?? []) {
    const hit = findName(child, id)
    if (hit) return hit
  }
  return undefined
}

function Generator() {
  const [activeStack, setActiveStack] = useState<StackId>("nextjs")
  const [prompt, setPrompt] = useState("")
  const [genState, setGenState] = useState<GenState>("idle")
  const [logs, setLogs] = useState<LogLine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [activeFile, setActiveFile] = useState(DEFAULT_FILE.nextjs.id)
  const [activeFileName, setActiveFileName] = useState(DEFAULT_FILE.nextjs.name)
  const [zipping, setZipping] = useState(false)

  const timers = useRef<number[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const errorId = useId()

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((t) => window.clearTimeout(t))
      abortRef.current?.abort()
    }
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const tree = TREES[activeStack]
  const activeCmd = STACKS.find((s) => s.id === activeStack)?.cmd ?? ""

  /** Code for a file: generated output once done, sample output before that. */
  const fileCode = (id: string, name: string) =>
    (genState === "done" ? (generated[id] ?? BASE_FILES[activeStack][id]) : SAMPLES[activeStack][id]) ??
    DEFAULT_CODE(name)

  const generate = async () => {
    if (genState === "generating") return
    if (!prompt.trim()) {
      setError("Describe your project first.")
      document.getElementById("sk-prompt")?.focus()
      return
    }

    setError(null)
    setGenState("generating")
    setLogs([{ t: "$ Sending prompt to Spine AI Engine...", tone: "ok" }])

    const ctrl = new AbortController()
    abortRef.current = ctrl
    const timeout = window.setTimeout(() => ctrl.abort(), 60_000)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, stack: activeStack }),
        signal: ctrl.signal,
      })
      if (!res.ok) throw new HttpError(res.status)

      const data = (await res.json()) as { blueprint?: Blueprint }
      const blueprint = data.blueprint
      if (!blueprint) throw new Error("No blueprint in response")

      setLogs((prev) => [
        ...prev,
        { t: "▸ Architecture received from Gemini...", tone: "dim" },
        { t: "▸ Injecting custom Prisma schema...", tone: "dim" },
        { t: "✓ Scaffold complete. Ready for download.", tone: "ok" },
      ])

      // Map what the AI returned onto this stack's file tree.
      const next: Record<string, string> = {}
      const modelId = PRIMARY_MODEL[activeStack]
      const routeId = PRIMARY_ROUTE[activeStack]
      if (blueprint.schemaCode && modelId) next[modelId] = blueprint.schemaCode
      if (blueprint.readme) next.readme = blueprint.readme

      const route = blueprint.apiRoutes?.[0]
      if (route?.code) {
        next[routeId] = route.code
        setActiveFile(routeId)
        setActiveFileName(
          activeStack === "nextjs" && route.folderPath
            ? `${route.folderPath}/route.ts`
            : (findName(tree, routeId) ?? "route.ts"),
        )
      } else {
        setActiveFile(DEFAULT_FILE[activeStack].id)
        setActiveFileName(DEFAULT_FILE[activeStack].name)
      }

      setGenerated(next)
      later(() => setGenState("done"), 600)
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === "AbortError"
      const status = e instanceof HttpError ? e.status : 0
      setLogs((prev) => [...prev, { t: "✖ Error: Failed to connect to AI Engine.", tone: "err" }])
      setError(
        status === 429
          ? "You've used today's free generations. Try again tomorrow."
          : aborted
            ? "That took too long. Try again."
            : "Couldn't reach the AI engine. Try again.",
      )
      later(() => setGenState("idle"), 1600)
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const switchStack = (id: StackId) => {
    if (genState === "generating") return
    setActiveStack(id)
    setGenState("idle")
    setLogs([])
    setGenerated({})
    setError(null)
    setActiveFile(DEFAULT_FILE[id].id)
    setActiveFileName(DEFAULT_FILE[id].name)
  }

  const selectFile = (id: string, name: string) => {
    setActiveFile(id)
    setActiveFileName(name)
  }

  const download = async () => {
    if (zipping) return
    setZipping(true)
    try {
      const { default: JSZip } = await import("jszip")
      const zip = new JSZip()
      const walk = (node: TreeNode, path: string) => {
        const here = path ? `${path}/${node.name}` : node.name
        if (node.type === "dir") node.children?.forEach((c) => walk(c, here))
        else zip.file(here, fileCode(node.id ?? "", node.name))
      }
      walk(tree, "")
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${tree.name}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      later(() => URL.revokeObjectURL(url), 2000)
    } finally {
      setZipping(false)
    }
  }

  const title = genState === "done" ? "spine-output" : genState === "generating" ? "Generating" : "Sample output"

  return (
    <div className="sk-reg grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* ── controls ─────────────────────────────────────────── */}
      <div className="sk-panel flex flex-col gap-5 p-5 md:p-6 lg:col-span-2">
        <div>
          <label htmlFor="sk-prompt" className="sk-label">
            Describe your project
          </label>
          <Textarea
            id="sk-prompt"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              if (error) setError(null)
            }}
            placeholder="e.g., a SaaS with user auth, Stripe subscriptions, and a REST API for a task manager"
            aria-invalid={error && !prompt.trim() ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="sk-input mt-2.5"
          />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example prompts">
            {EXAMPLE_PROMPTS.map((x) => (
              <button
                key={x.label}
                type="button"
                className="sk-ex"
                onClick={() => {
                  setPrompt(x.text)
                  setError(null)
                  document.getElementById("sk-prompt")?.focus()
                }}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="sk-label p-0">Base stack</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {STACKS.map((s) => (
              <label key={s.id} className="sk-stack">
                <input
                  type="radio"
                  name="sk-stack"
                  value={s.id}
                  checked={activeStack === s.id}
                  disabled={genState === "generating"}
                  onChange={() => switchStack(s.id)}
                  className="sr-only"
                />
                <span className="sk-stack__body">
                  <span className="sk-stack__name">{s.label}</span>
                  <span className="sk-stack__sub">{s.sub}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <Button
            type="button"
            onClick={generate}
            disabled={genState === "generating"}
            className="sk-btn sk-btn--primary w-full"
          >
            {genState === "generating" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Generating scaffold...
              </>
            ) : genState === "done" ? (
              <>
                <RotateCcw className="size-4" aria-hidden="true" /> Regenerate
              </>
            ) : (
              <>
                Generate scaffold <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
          {error && (
            <p id={errorId} role="alert" className="sk-error">
              {error}
            </p>
          )}
          <p className="sk-fine mt-3">Free tier: 5 AI generations a day. No account needed.</p>
        </div>
      </div>

      {/* ── output ───────────────────────────────────────────── */}
      <div className="sk-panel sk-out overflow-hidden lg:col-span-3">
        <div className="sk-out__bar">
          <p className="sk-out__title">
            <Terminal className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{title}</span>
          </p>
          {genState === "done" && (
            <div className="flex shrink-0 items-center gap-2">
              <CopyButton text={activeCmd} label="Copy cmd" />
              <Button
                type="button"
                onClick={download}
                disabled={zipping}
                className="sk-btn sk-btn--primary sk-btn--sm"
              >
                <Download className="size-3.5" aria-hidden="true" />
                {zipping ? "Zipping..." : "Download ZIP"}
              </Button>
            </div>
          )}
        </div>

        {genState === "generating" ? (
          <div className="sk-log" role="log" aria-label="Generation log">
            {logs.map((l, i) => (
              <div key={i} className={`tone-${l.tone}`}>
                {l.t}
              </div>
            ))}
            <div className="sk-log__wait">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> working...
            </div>
          </div>
        ) : (
          <div className="sk-out__body">
            <div className="sk-out__tree">
              <FileTree
                key={`${activeStack}-${genState}`}
                node={tree}
                activeId={activeFile}
                onSelect={selectFile}
                animate={genState === "done"}
              />
            </div>
            <div className="sk-out__code">
              <p className="sk-out__file">{activeFileName}</p>
              <div className="sk-out__pre">
                <CodeView code={fileCode(activeFile, activeFileName)} name={activeFileName} />
              </div>
              {genState === "idle" && (
                <p className="sk-sample-note">Sample output. Describe your app and generate your own.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   SECTIONS
   Hero, how it works, features, stacks, pricing, FAQ, final CTA, footer.
   ════════════════════════════════════════════════════════════════ */

/* ── Hero ──────────────────────────────────────────────────────── */

/**
 * Hero = headline + the live generator, so the first scroll already shows the product.
 * The only motion at load is one staggered rise (CSS, no JS), then the tick field takes over.
 */
function Hero() {
  return (
    <section className="relative isolate overflow-clip pt-28 pb-16 md:pt-40 md:pb-24" aria-labelledby="hero-title">
      <TickField className="sk-ticks" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="sk-rise" style={cssVars({ "--d": "0ms" })}>
          <Badge variant="outline" className="sk-chip">
            v0.1.0 open beta
          </Badge>
        </div>

        <h1 id="hero-title" className="sk-display sk-h1 mt-6">
          <span className="sk-mask">
            <span style={cssVars({ "--d": "70ms" })}>Build the backend you want.</span>
          </span>
          <span className="sk-mask">
            <span style={cssVars({ "--d": "170ms" })}>Start with one prompt.</span>
          </span>
        </h1>

        <p className="sk-lead sk-rise mt-6 md:mt-7" style={cssVars({ "--d": "360ms" })}>
          SpineKit turns your product idea into a clean starter app: structured routes, a database schema, auth setup
          and production-ready scaffolding in minutes.
        </p>

        <div className="sk-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={cssVars({ "--d": "460ms" })}>
          <div className="sk-cmd max-w-full">
            <span className="sk-cmd__prompt" aria-hidden="true">
              $
            </span>
            <code className="min-w-0 overflow-x-auto whitespace-nowrap">{SITE.npx}</code>
            <CopyButton text={SITE.npx} />
          </div>
          <GenerateLink className="sk-link">Or try it in the browser</GenerateLink>
        </div>

        <div id="generator" className="sk-rise mt-14 md:mt-20" style={cssVars({ "--d": "600ms" })}>
          <Generator />
        </div>
      </div>
    </section>
  )
}

/* ── How it works ──────────────────────────────────────────────── */

const RUN = `cp .env.example .env.local
npx prisma db push
npm run dev`

/**
 * Three real steps, so the numbers earn their place. A spine line runs through them and
 * fills as the section scrolls past; each vertebra lights when the line reaches it.
 */
function HowItWorks() {
  const flowRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const flow = flowRef.current
    if (!flow) return
    const steps = Array.from(flow.querySelectorAll<HTMLElement>("[data-step]"))

    const paint = (p: number) => {
      flow.style.setProperty("--p", p.toFixed(3))
      steps.forEach((el, i) => el.toggleAttribute("data-on", p > i / steps.length + 0.0001))
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(1)
      return
    }

    gsap.registerPlugin(ScrollTrigger)
    const trigger = ScrollTrigger.create({
      trigger: flow,
      start: "top 78%",
      end: "bottom 62%",
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => paint(self.progress),
    })
    return () => trigger.kill()
  }, [])

  return (
    <section id="how" className="sk-section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="sk-h2 max-w-3xl">Three steps from idea to a running backend.</h2>

        <ol ref={flowRef} className="sk-flow mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} data-step className="sk-step">
              <span className="sk-step__node" aria-hidden="true" />
              <p className="sk-step__num">0{i + 1}</p>
              <h3 className="sk-h3 mt-2">{step.title}</h3>
              <p className="sk-muted mt-2">{step.body}</p>

              <div className="sk-well mt-6">
                {i === 0 && (
                  <p className="sk-quote">&ldquo;{EXAMPLE_PROMPTS[0].text}&rdquo;</p>
                )}
                {i === 1 && (
                  <ul className="flex flex-wrap gap-2 p-4">
                    {STACKS.map((s) => (
                      <li key={s.id} className="sk-tag">
                        {s.label}
                      </li>
                    ))}
                  </ul>
                )}
                {i === 2 && <CodeView code={RUN} lang="text" numbered={false} className="p-4" />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── Features ──────────────────────────────────────────────────── */

/** Every tile shows the real artifact SpineKit writes, not an illustration of it. */
function Tile({
  title,
  body,
  file,
  className,
  children,
}: {
  title: string
  body: string
  file?: string
  className?: string
  children: ReactNode
}) {
  return (
    <article className={cn("sk-panel flex flex-col p-6 md:p-8", className)}>
      <h3 className="sk-h3">{title}</h3>
      <p className="sk-muted mt-2 max-w-[34rem]">{body}</p>
      <div className="sk-well mt-6 flex-1">
        {file && (
          <p className="sk-well__file">
            <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{file}</span>
          </p>
        )}
        {children}
      </div>
    </article>
  )
}

function Features() {
  return (
    <section id="features" className="sk-section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="sk-h2 max-w-3xl">Not just files. A working project.</h2>
        <p className="sk-lead mt-4">Everything SpineKit writes for you, from the route handlers down to the README.</p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 lg:grid-cols-12">
          <Tile
            className="lg:col-span-7"
            title="Working route files"
            body="Controller logic in every handler: GET, POST, PATCH and DELETE, wired to your database with session guards from the start."
            file="src/app/api/tasks/route.ts"
          >
            <CodeView code={ROUTE_SAMPLE} name="route.ts" className="sk-well__pre" />
          </Tile>

          <Tile
            className="lg:col-span-5"
            title="Models shaped to your prompt"
            body="Prisma schemas or Mongoose models, with relationships and field types inferred from what you wrote."
            file="prisma/schema.prisma"
          >
            <CodeView code={SCHEMA_SAMPLE} name="schema.prisma" className="sk-well__pre" />
          </Tile>

          <Tile
            className="lg:col-span-5"
            title="A README that matches the build"
            body="A markdown file explaining the exact architecture SpineKit built: structure, commands and route map."
            file="README.md"
          >
            <CodeView code={README_SAMPLE} name="README.md" className="sk-well__pre" />
          </Tile>

          <Tile
            className="lg:col-span-7"
            title="A named .env.example"
            body="Every required environment variable is pre-named and grouped by service. No mystery on day one."
            file=".env.example"
          >
            <CodeView code={ENV_SAMPLE} name=".env.example" className="sk-well__pre" />
          </Tile>

          <Tile
            className="lg:col-span-7"
            title="Auth that's already wired"
            body="JWT middleware or NextAuth v5, pre-configured for your stack, with providers and session strategy included."
            file="where it lives"
          >
            <div className="p-3 md:p-4">
              <FileTree node={AUTH_TREE} openDepth={9} />
            </div>
          </Tile>

          <Tile
            className="lg:col-span-5"
            title="One command"
            body="Interactive prompts. Zero boilerplate left to write."
          >
            <div className="sk-code sk-well__pre" role="img" aria-label="Terminal: npx create-spine, stack Next.js Fullstack, database PostgreSQL, scaffolding">
              <div className="kw">$ {SITE.npx}</div>
              <div>&gt; Stack: Next.js Fullstack</div>
              <div>&gt; Database: PostgreSQL</div>
              <div className="kw">✓ Scaffolding...</div>
              <div aria-hidden="true">
                <span className="kw">$</span> <span className="sk-caret" />
              </div>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  )
}

/* ── Stacks ────────────────────────────────────────────────────── */

function Stacks() {
  return (
    <section id="templates" className="sk-section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="sk-h2 max-w-3xl">Hand-crafted. Actually production-ready.</h2>
        <p className="sk-lead mt-4">Better than anything you&apos;ll find on a GitHub search.</p>

        <Tabs defaultValue="nextjs" className="mt-10 grid grid-cols-1 gap-4 md:mt-14 lg:grid-cols-12 lg:gap-6">
          <TabsList aria-label="Base stacks" className="sk-tabs-list lg:col-span-4">
            {TEMPLATES.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="sk-tab">
                <span className="sk-tab__title">{t.title}</span>
                <span className="sk-tab__sub">{t.desc}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TEMPLATES.map((t) => (
            <TabsContent key={t.id} value={t.id} className="lg:col-span-8">
              <div className="sk-reg">
                <div className="sk-panel p-5 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="sk-h3">{t.title}</h3>
                      <p className="sk-muted mt-2 max-w-md">{t.desc}</p>
                    </div>
                    {t.badge && (
                      <Badge variant="outline" className="sk-chip">
                        {t.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="sk-well mt-6">
                    <p className="sk-well__file">Project layout</p>
                    <div className="p-3 md:p-4">
                      <FileTree node={TREES[t.id]} openDepth={9} />
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
                    {t.tech.map((x) => (
                      <li key={x} className="sk-tag">
                        {x}
                      </li>
                    ))}
                  </ul>

                  <div className="sk-cmd mt-6 w-full justify-between">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="sk-cmd__prompt" aria-hidden="true">
                        $
                      </span>
                      <code className="sk-fade-x min-w-0 overflow-x-auto whitespace-nowrap">
                        npx create-spine@latest --template {t.id}
                      </code>
                    </span>
                    <CopyButton text={`npx create-spine@latest --template ${t.id}`} />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

/* ── Pricing ───────────────────────────────────────────────────── */

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="sk-checks flex flex-col gap-3">
      {items.map((f) => (
        <li key={f}>
          <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="sk-section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="sk-h2 max-w-3xl">Simple. Generous free tier.</h2>
        <p className="sk-lead mt-4">The core tool is free, forever. Pay when you need more.</p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-5">
          <article className="sk-panel flex flex-col p-6 md:p-8 lg:col-span-2">
            <h3 className="sk-label">{PLANS.free.name}</h3>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="sk-price">{PLANS.free.price}</span>
              <span className="sk-muted">/month</span>
            </p>
            <CheckList items={PLANS.free.features} />
            <div className="mt-auto pt-8">
              <GenerateLink className="sk-btn sk-btn--ghost w-full">Start for free</GenerateLink>
            </div>
          </article>

          <div className="sk-reg lg:col-span-3">
            <article className="sk-panel sk-plan-pro flex h-full flex-col p-6 md:p-8">
              <h3 className="sk-label sk-label--accent">{PLANS.pro.name}</h3>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="sk-price">{PLANS.pro.price}</span>
                <span className="sk-muted">/month</span>
              </p>
              <CheckList items={PLANS.pro.features} />
              <div className="mt-auto pt-8">
                <Link href="/pricing" className="sk-btn sk-btn--primary w-full sm:w-auto">
                  Get Pro
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ───────────────────────────────────────────────────────── */

function Faq() {
  return (
    <section id="faq" className="sk-section">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 className="sk-h2">Common questions</h2>
          <p className="sk-muted mt-4 max-w-xs">What you get, what it costs and what you can change.</p>
        </div>

        <div className="lg:col-span-8">
          <Accordion defaultValue={["what"]} className="sk-acc">
            {FAQ.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="sk-acc__item">
                <AccordionTrigger className="sk-acc__trigger">{item.q}</AccordionTrigger>
                <AccordionContent className="sk-acc__body">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ─────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="sk-section sk-section--flush">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="sk-reg">
          <div className="sk-panel relative overflow-hidden px-5 py-14 sm:px-6 md:px-14 md:py-20">
            <div className="sk-lattice" aria-hidden="true" />
            <div className="relative">
              <h2 className="sk-display sk-h2 max-w-2xl">Turn your idea into a working backend.</h2>
              <p className="sk-lead mt-4 max-w-xl">
                No account required. Describe the product, choose the stack and ship faster.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <GenerateLink className="sk-btn sk-btn--primary">Generate my app</GenerateLink>
                <a href={SITE.github} target="_blank" rel="noreferrer" className="sk-btn sk-btn--ghost">
                  <GithubIcon className="size-4" /> Star on GitHub
                </a>
              </div>

              <div className="sk-cmd mt-8 max-w-full">
                <span className="sk-cmd__prompt" aria-hidden="true">
                  $
                </span>
                <code className="min-w-0 overflow-x-auto whitespace-nowrap">{SITE.npx}</code>
                <CopyButton text={SITE.npx} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ────────────────────────────────────────────────────── */

// Module scope on purpose: reading the clock during render is rejected by Cache Components.
const YEAR = new Date().getFullYear()

function SiteFooter() {
  return (
    <footer className="sk-footer">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="SpineKit home">
              <LogoMark />
              <span className="text-[1.15rem] font-black uppercase tracking-[0.12em] md:text-[1.4rem]">SPINEKIT</span>
            </Link>
            <p className="sk-muted mt-4 max-w-[24rem]">Turn a product idea into a working backend starter.</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 md:gap-x-16">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="sk-footer__link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sk-footer__bar mt-10 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="sk-fine m-0">© {YEAR} SpineKit. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href={SITE.x} aria-label="SpineKit on X" className="sk-icon-btn" target="_blank" rel="noreferrer">
              <XIcon className="size-4" />
            </a>
            <a href={SITE.github} aria-label="SpineKit on GitHub" className="sk-icon-btn" target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════════════
   SPINE RAIL
   Scroll rail on wide screens, thin progress bar on narrow ones.
   ════════════════════════════════════════════════════════════════ */

/**
 * The page's spine.
 *
 * Wide screens: a thin vertical rail on the left edge. Each section is a vertebra; the
 * line fills as you scroll and the vertebra for the section on screen widens and lights up.
 * Narrower screens: a 2px progress bar across the top.
 *
 * Driven by one ScrollTrigger (no scroll listeners). Writes straight to the DOM so scrolling
 * never re-renders React; state only changes when you cross into a new section.
 */
function SpineRail() {
  const fillRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const count = RAIL_SECTIONS.length
    let tops: number[] = []
    let current = -1

    const measure = () => {
      tops = RAIL_SECTIONS.map((s) => {
        const el = document.getElementById(s.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY
      })
    }

    const update = () => {
      const y = window.scrollY + window.innerHeight * 0.5
      let idx = -1
      for (let i = 0; i < count; i++) if (tops[i] <= y) idx = i

      let f = 0
      if (idx >= 0) {
        const a = tops[idx]
        const b = idx < count - 1 ? tops[idx + 1] : document.documentElement.scrollHeight
        f = Math.min(1, (idx + Math.min(1, (y - a) / Math.max(1, b - a))) / (count - 1))
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${f})`

      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`

      if (idx !== current) {
        current = idx
        setIndex(idx)
      }
    }

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: () => {
        measure()
        update()
      },
    })

    // Layout moves when the generator swaps sample output for real output, fonts load, etc.
    const ro = new ResizeObserver(() => {
      measure()
      update()
    })
    ro.observe(document.body)

    return () => {
      trigger.kill()
      ro.disconnect()
    }
  }, [])

  return (
    <>
      <div className="sk-progress" aria-hidden="true">
        <div ref={barRef} className="sk-progress__bar" />
      </div>
      <nav className="sk-rail" aria-label="Page sections">
        <div className="sk-rail__track" aria-hidden="true">
          <div ref={fillRef} className="sk-rail__fill" />
        </div>
        <ul>
          {RAIL_SECTIONS.map((s, i) => (
            <li key={s.id} style={{ top: `${(i / (RAIL_SECTIONS.length - 1)) * 100}%` }}>
              <a
                href={`#${s.id}`}
                data-state={i === index ? "active" : i < index ? "passed" : "idle"}
                aria-current={i === index ? "location" : undefined}
              >
                <span className="sk-rail__bar" aria-hidden="true" />
                <span className="sk-rail__label">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <>
      {/* Every style lives in the CSS string at the bottom of this file. */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sk-root">
        <a href="#main" className="sk-skip">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Hero />
          <HowItWorks />
          <Features />
          <Stacks />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <SiteFooter />
        {/* Fixed-position, so it can sit last in the DOM: keyboard users reach the page nav first. */}
        <SpineRail />
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   CSS
   Every style for this page. Class names start with sk-.
   Plain CSS on purpose: unlayered rules beat Tailwind utilities, which is how your Button, Badge
   and Textarea get re-skinned. Tailwind utilities still do spacing and layout in the markup.
   String.raw keeps CSS backslashes working if you add some (like \2192 in content).
   ════════════════════════════════════════════════════════════════ */

const CSS = String.raw`/* ═══════════════════════════════════════════════════════════════════════
   SpineKit landing: tokens, skin and motion.

   Plain CSS on purpose (no @apply, no @theme) so it works with any Tailwind
   setup, and scoped under .sk-root so nothing leaks into the rest of the app.
   Tailwind utilities handle layout; this file handles look and feel.
   The rules behind these choices live in DESIGN.md.
   ═══════════════════════════════════════════════════════════════════════ */

#generator {
  scroll-margin-top: 5.5rem;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* ── 1. Tokens ─────────────────────────────────────────────────────── */
.sk-root {
  --sk-bg: #050505; /* page */
  --sk-s1: #0a0b0a; /* panel */
  --sk-s2: #111311; /* raised: tooltips, hover */
  --sk-code: #070807; /* code + inputs, one step below panel */
  --sk-line: rgba(255, 255, 255, 0.08);
  --sk-line-2: rgba(255, 255, 255, 0.14);
  --sk-fg: #f4f5f4; /* body + headings */
  --sk-mute: #a1a7a2; /* secondary text, 8:1 on page */
  --sk-dim: #7d847f; /* tertiary text, 5.3:1 on page */
  --sk-accent: #8be6a2; /* the logo mint: the only accent */
  --sk-accent-ink: #04110a; /* text on accent */
  --sk-accent-soft: rgba(139, 230, 162, 0.1);
  --sk-accent-line: rgba(139, 230, 162, 0.3);
  --sk-danger: #f87171;

  --sk-sans: "Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --sk-mono: "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --sk-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --sk-r-panel: 14px;
  --sk-r-ctl: 10px;
  --sk-r-chip: 6px;

  position: relative;
  min-height: 100vh;
  overflow-x: clip;
  background: var(--sk-bg);
  color: var(--sk-fg);
  font-family: var(--sk-sans);
  font-size: 16px;
  line-height: 1.6;
  color-scheme: dark;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.sk-root ::selection {
  background: var(--sk-accent);
  color: var(--sk-accent-ink);
}

.sk-root :focus-visible {
  outline: 2px solid var(--sk-accent);
  outline-offset: 2px;
}

/* ── 2. Type ───────────────────────────────────────────────────────── */
.sk-display {
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
  font-optical-sizing: auto;
}
.sk-h1 {
  font-size: clamp(2.5rem, 1rem + 4.6vw, 4.75rem);
  text-wrap: balance;
}
.sk-h2 {
  font-size: clamp(1.9rem, 1.15rem + 2.5vw, 3.1rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
  font-optical-sizing: auto;
  text-wrap: balance;
}
.sk-h3 {
  font-size: 1.1875rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
  text-wrap: balance;
}
.sk-lead {
  max-width: 40rem;
  color: var(--sk-mute);
  font-size: clamp(1rem, 0.94rem + 0.35vw, 1.1875rem);
  line-height: 1.65;
  text-wrap: balance;
}
.sk-muted {
  color: var(--sk-mute);
  font-size: 0.9375rem;
  line-height: 1.65;
}
.sk-fine {
  color: var(--sk-dim);
  font-size: 0.8125rem;
  line-height: 1.5;
}
.sk-label {
  color: var(--sk-mute);
  font-size: 0.8125rem;
  font-weight: 500;
}
.sk-label--accent {
  color: var(--sk-accent);
}
.sk-link {
  color: var(--sk-fg);
  font-size: 0.9375rem;
  text-decoration: underline;
  text-decoration-color: var(--sk-line-2);
  text-underline-offset: 0.35em;
  transition: text-decoration-color 0.2s;
}
.sk-link:hover {
  text-decoration-color: var(--sk-accent);
}

/* ── 3. Layout ─────────────────────────────────────────────────────── */
.sk-section {
  position: relative;
  padding-block: clamp(4.5rem, 2.5rem + 7vw, 8.5rem);
}
.sk-section--flush {
  padding-top: 0;
}

/* ── 4. Surfaces ───────────────────────────────────────────────────── */
.sk-panel {
  background: var(--sk-s1);
  border: 1px solid var(--sk-line);
  border-radius: var(--sk-r-panel);
}

/* Viewfinder brackets just outside a block. Used on the few things that matter most. */
.sk-reg {
  position: relative;
  --c: var(--sk-accent-line);
}
.sk-reg::before {
  content: "";
  position: absolute;
  inset: -6px;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(var(--c), var(--c)) 0 0 / 12px 1px no-repeat,
    linear-gradient(var(--c), var(--c)) 0 0 / 1px 12px no-repeat,
    linear-gradient(var(--c), var(--c)) 100% 0 / 12px 1px no-repeat,
    linear-gradient(var(--c), var(--c)) 100% 0 / 1px 12px no-repeat,
    linear-gradient(var(--c), var(--c)) 0 100% / 12px 1px no-repeat,
    linear-gradient(var(--c), var(--c)) 0 100% / 1px 12px no-repeat,
    linear-gradient(var(--c), var(--c)) 100% 100% / 12px 1px no-repeat,
    linear-gradient(var(--c), var(--c)) 100% 100% / 1px 12px no-repeat;
}

.sk-well {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: var(--sk-code);
  border: 1px solid var(--sk-line);
  border-radius: var(--sk-r-ctl);
}
.sk-well__file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--sk-line);
  color: var(--sk-mute);
  font: 500 0.75rem/1.4 var(--sk-mono);
}
.sk-well__pre {
  flex: 1;
  margin: 0;
  padding: 1rem 2.25rem 1rem 1.1rem;
  overflow: auto;
}
/* Long lines fade out instead of being chopped, and the end padding lets you scroll past the fade. */
.sk-well::after,
.sk-out__pre::after {
  content: "";
  position: absolute;
  inset-block: 0;
  right: 0;
  z-index: 1;
  width: 2rem;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, var(--sk-code));
}

.sk-quote {
  margin: 0;
  padding: 1.1rem 1.25rem;
  color: var(--sk-fg);
  font: 400 0.9rem/1.65 var(--sk-mono);
}

.sk-tag {
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 0.65rem;
  border: 1px solid var(--sk-line-2);
  border-radius: var(--sk-r-chip);
  color: var(--sk-mute);
  font: 500 0.75rem/1 var(--sk-mono);
  list-style: none;
}

/* A static echo of the hero's tick field, for the closing panel. */
.sk-lattice {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26'><rect x='8' y='12' width='10' height='1' rx='.5' fill='%238be6a2' fill-opacity='.2'/></svg>");
  -webkit-mask-image: radial-gradient(60% 120% at 100% 0%, #000 0%, transparent 70%);
  mask-image: radial-gradient(60% 120% at 100% 0%, #000 0%, transparent 70%);
}

/* ── 5. Controls ───────────────────────────────────────────────────── */
.sk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.75rem;
  padding: 0 1.15rem;
  border: 1px solid transparent;
  border-radius: var(--sk-r-ctl);
  font: 500 0.9375rem/1 var(--sk-sans);
  letter-spacing: -0.005em;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.18s var(--sk-ease),
    border-color 0.18s var(--sk-ease),
    color 0.18s var(--sk-ease),
    transform 0.18s var(--sk-ease);
}
.sk-btn:active {
  transform: translateY(1px);
}
.sk-btn[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
.sk-btn--primary {
  background: var(--sk-accent);
  color: var(--sk-accent-ink);
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}
.sk-btn--primary:hover:not([disabled]) {
  background: #a6efba;
}
.sk-btn--ghost {
  background: transparent;
  border-color: var(--sk-line-2);
  color: var(--sk-fg);
}
.sk-btn--ghost:hover:not([disabled]) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.26);
}
.sk-btn--sm {
  height: 2.25rem;
  padding: 0 0.8rem;
  border-radius: 8px;
  font-size: 0.8125rem;
}
.sk-btn.is-done {
  border-color: var(--sk-accent-line);
  color: var(--sk-accent);
}
@media (pointer: coarse) {
  .sk-btn--sm {
    height: 2.75rem;
  }
}

.sk-chip {
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 0.7rem;
  border: 1px solid var(--sk-accent-line);
  border-radius: var(--sk-r-chip);
  background: var(--sk-accent-soft);
  color: var(--sk-accent);
  font: 500 0.75rem/1 var(--sk-mono);
}

.sk-cmd {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.35rem 0.35rem 1rem;
  background: var(--sk-s1);
  border: 1px solid var(--sk-line-2);
  border-radius: var(--sk-r-ctl);
  color: var(--sk-fg);
  font: 400 0.875rem/1.4 var(--sk-mono);
}
.sk-cmd code {
  font: inherit;
  scrollbar-width: none;
}
.sk-cmd__prompt {
  color: var(--sk-accent);
}
/* A command that is wider than its box fades out instead of being chopped; end padding lets you scroll past the fade. */
.sk-fade-x {
  padding-right: 1.25rem;
  -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 1.25rem), transparent);
  mask-image: linear-gradient(90deg, #000 calc(100% - 1.25rem), transparent);
}
@media (max-width: 420px) {
  .sk-cmd {
    gap: 0.5rem;
    padding-left: 0.75rem;
    font-size: 0.8125rem;
  }
}
@media (max-width: 374px) {
  /* Keep the label for screen readers; show only the icon so the command fits a 360px phone. */
  .sk-cmd .sk-copy__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}

/* ── 6. Generator ──────────────────────────────────────────────────── */
.sk-input {
  width: 100%;
  min-height: 8.25rem;
  max-height: 16rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--sk-line-2);
  border-radius: var(--sk-r-ctl);
  background: var(--sk-code);
  color: var(--sk-fg);
  font-size: 1rem; /* 16px stops iOS zooming on focus */
  line-height: 1.55;
  resize: none;
  transition:
    border-color 0.18s var(--sk-ease),
    box-shadow 0.18s var(--sk-ease);
}
.sk-input::placeholder {
  color: var(--sk-dim);
}
.sk-input:hover {
  border-color: rgba(255, 255, 255, 0.24);
}
.sk-input:focus-visible {
  outline: none;
  border-color: var(--sk-accent);
  box-shadow: 0 0 0 3px var(--sk-accent-soft);
}
.sk-input[aria-invalid="true"] {
  border-color: var(--sk-danger);
}

.sk-ex {
  min-height: 2rem;
  padding: 0 0.7rem;
  border: 1px solid var(--sk-line);
  border-radius: var(--sk-r-chip);
  background: transparent;
  color: var(--sk-mute);
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    border-color 0.18s,
    color 0.18s;
}
.sk-ex:hover {
  border-color: var(--sk-accent-line);
  color: var(--sk-fg);
}
@media (pointer: coarse) {
  .sk-ex {
    min-height: 2.5rem;
  }
}

.sk-stack {
  display: block;
  cursor: pointer;
}
.sk-stack__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  height: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--sk-line);
  border-radius: var(--sk-r-ctl);
  background: var(--sk-code);
  transition:
    border-color 0.18s,
    background-color 0.18s;
}
.sk-stack:hover .sk-stack__body {
  border-color: var(--sk-line-2);
}
.sk-stack__name {
  color: var(--sk-fg);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.3;
}
.sk-stack__sub {
  color: var(--sk-dim);
  font: 500 0.6875rem/1.3 var(--sk-mono);
}
.sk-stack input:checked + .sk-stack__body {
  border-color: var(--sk-accent-line);
  background: var(--sk-accent-soft);
}
.sk-stack input:checked + .sk-stack__body .sk-stack__name {
  color: var(--sk-accent);
}
.sk-stack input:focus-visible + .sk-stack__body {
  outline: 2px solid var(--sk-accent);
  outline-offset: 2px;
}
.sk-stack input:disabled + .sk-stack__body {
  opacity: 0.55;
  cursor: not-allowed;
}

.sk-error {
  margin: 0.75rem 0 0;
  color: var(--sk-danger);
  font-size: 0.875rem;
  line-height: 1.5;
}

.sk-out {
  display: flex;
  flex-direction: column;
  min-height: 26rem;
  max-height: 34rem;
}
.sk-out__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  min-height: 3.25rem;
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--sk-line);
  background: var(--sk-s2);
}
.sk-out__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  margin: 0;
  color: var(--sk-mute);
  font: 500 0.75rem/1 var(--sk-mono);
}
.sk-out__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}
.sk-out__tree {
  flex: none;
  max-height: 11rem;
  padding: 0.5rem;
  overflow: auto;
  border-bottom: 1px solid var(--sk-line);
}
.sk-out__code {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: var(--sk-code);
}
.sk-out__file {
  margin: 0;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--sk-line);
  color: var(--sk-mute);
  font: 500 0.75rem/1.4 var(--sk-mono);
}
.sk-out__pre {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}
.sk-out__pre .sk-code {
  flex: 1;
  min-width: 0;
  padding: 0.9rem 2.25rem 1.1rem 1rem;
  overflow: auto;
}
.sk-sample-note {
  margin: 0;
  padding: 0.7rem 1rem;
  border-top: 1px solid var(--sk-line);
  color: var(--sk-mute);
  font-size: 0.8125rem;
  line-height: 1.5;
}
@media (min-width: 640px) {
  .sk-out__body {
    flex-direction: row;
  }
  .sk-out__tree {
    width: 14rem;
    max-height: none;
    border-right: 1px solid var(--sk-line);
    border-bottom: 0;
  }
}

.sk-log {
  flex: 1;
  padding: 1.1rem 1.25rem;
  overflow: auto;
  background: var(--sk-code);
  font: 400 0.8125rem/1.95 var(--sk-mono);
}
.sk-log .tone-ok {
  color: var(--sk-accent);
}
.sk-log .tone-dim {
  color: var(--sk-mute);
}
.sk-log .tone-err {
  color: var(--sk-danger);
}
.sk-log__wait {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  color: var(--sk-dim);
}

/* ── 7. Code + file tree ───────────────────────────────────────────── */
.sk-code {
  margin: 0;
  overflow: auto;
  color: #d7dcd8;
  font: 400 0.78125rem/1.75 var(--sk-mono);
  font-variant-ligatures: none;
  tab-size: 2;
  white-space: pre;
}
.sk-code code {
  font: inherit;
}
.sk-code .ln {
  display: inline-block;
  min-width: 2.2em;
  margin-right: 1em;
  color: var(--sk-dim);
  opacity: 0.55;
  text-align: right;
  user-select: none;
}
.sk-code .kw {
  color: var(--sk-accent);
}
.sk-code .str,
.sk-code .num {
  color: #e6d9a8;
}
.sk-code .ty,
.sk-code .dec {
  color: #9ec5e8;
}
.sk-code .cm {
  color: var(--sk-dim);
}
.sk-code .md-h {
  color: var(--sk-fg);
  font-weight: 700;
}

.sk-tree {
  font: 400 0.78125rem/1.4 var(--sk-mono);
}
.sk-tree ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.sk-tree ul ul {
  margin-left: 0.85rem;
  border-left: 1px solid var(--sk-line);
}
.sk-tree__row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  min-height: 1.75rem;
  padding: 0.15rem 0.5rem 0.15rem 1.75rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--sk-mute);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}
.sk-tree__row--dir {
  padding-left: 0.5rem;
}
.sk-tree__row--static {
  cursor: default;
}
button.sk-tree__row:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--sk-fg);
}
.sk-tree__row[aria-current="true"] {
  background: var(--sk-accent-soft);
  color: var(--sk-accent);
}
.sk-tree__icon {
  flex: none;
  width: 0.9rem;
  height: 0.9rem;
  color: var(--sk-dim);
}
.sk-tree__chev {
  flex: none;
  width: 0.8rem;
  height: 0.8rem;
  color: var(--sk-dim);
  transition: transform 0.2s var(--sk-ease);
}
.sk-tree__chev.is-open {
  transform: rotate(90deg);
}
.sk-tree__row[data-ext="ts"] .sk-tree__icon,
.sk-tree__row[data-ext="tsx"] .sk-tree__icon {
  color: #9ec5e8;
}
.sk-tree__row[data-ext="prisma"] .sk-tree__icon {
  color: var(--sk-accent);
}
.sk-tree__row[data-ext="example"] .sk-tree__icon,
.sk-tree__row[data-ext="toml"] .sk-tree__icon {
  color: #e6d9a8;
}
@media (pointer: coarse) {
  .sk-tree__row {
    min-height: 2.25rem;
  }
}

/* ── 8. How it works ───────────────────────────────────────────────── */
.sk-flow {
  --p: 0;
  position: relative;
}
.sk-flow::before,
.sk-flow::after {
  content: "";
  position: absolute;
  pointer-events: none;
}
.sk-step {
  position: relative;
  min-width: 0;
}
.sk-step__node {
  position: absolute;
  border-radius: 2px;
  background: var(--sk-line-2);
  transition:
    background-color 0.3s var(--sk-ease),
    box-shadow 0.3s var(--sk-ease);
}
.sk-step__num {
  margin: 0;
  color: var(--sk-dim);
  font: 500 0.8125rem/1 var(--sk-mono);
  transition: color 0.3s;
}
.sk-step[data-on] .sk-step__node {
  background: var(--sk-accent);
  box-shadow: 0 0 12px rgba(139, 230, 162, 0.55);
}
.sk-step[data-on] .sk-step__num {
  color: var(--sk-accent);
}
@media (min-width: 768px) {
  .sk-flow::before,
  .sk-flow::after {
    top: 7px;
    right: 0;
    left: 0;
    height: 1px;
  }
  .sk-flow::before {
    background: var(--sk-line-2);
  }
  .sk-flow::after {
    background: var(--sk-accent);
    box-shadow: 0 0 10px rgba(139, 230, 162, 0.4);
    transform: scaleX(var(--p));
    transform-origin: left;
  }
  .sk-step {
    padding-top: 2.25rem;
  }
  .sk-step__node {
    top: 0;
    left: 0;
    width: 3px;
    height: 15px;
  }
}
@media (max-width: 767.98px) {
  .sk-flow::before,
  .sk-flow::after {
    top: 6px;
    bottom: 6px;
    left: 6px;
    width: 1px;
  }
  .sk-flow::before {
    background: var(--sk-line-2);
  }
  .sk-flow::after {
    background: var(--sk-accent);
    transform: scaleY(var(--p));
    transform-origin: top;
  }
  .sk-step {
    padding-left: 2.25rem;
  }
  .sk-step__node {
    top: 0.3rem;
    left: 0;
    width: 13px;
    height: 3px;
  }
}

/* ── 9. Stacks (tabs) ──────────────────────────────────────────────── */
.sk-tabs-list {
  display: flex;
  align-items: stretch;
  justify-content: flex-start; /* the base component centres; we want a left-aligned, top-aligned list */
  gap: 0.5rem;
  width: 100%; /* the base component is w-fit, which stops the row from scrolling */
  max-width: 100%;
  min-width: 0;
  padding-bottom: 0.25rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}
.sk-tab {
  position: relative;
  flex: none;
  flex-direction: column;
  align-items: flex-start;
  min-height: 2.75rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--sk-line);
  border-radius: var(--sk-r-ctl);
  background: transparent;
  color: var(--sk-mute);
  text-align: left;
  cursor: pointer;
  scroll-snap-align: start;
  transition:
    background-color 0.2s var(--sk-ease),
    border-color 0.2s var(--sk-ease),
    color 0.2s var(--sk-ease);
}
.sk-tab:hover {
  border-color: var(--sk-line-2);
  color: var(--sk-fg);
}
.sk-tab[data-active] {
  background: var(--sk-s1);
  border-color: var(--sk-accent-line);
  color: var(--sk-fg);
}
.sk-tab__title {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.3;
}
.sk-tab__sub {
  display: none;
  margin-top: 0.3rem;
  color: var(--sk-dim);
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.5;
  white-space: normal;
}
@media (min-width: 1024px) {
  .sk-tabs-list {
    flex-direction: column;
    padding-bottom: 0;
    overflow: visible;
  }
  .sk-tab {
    width: 100%;
    padding: 1rem 1.15rem;
  }
  .sk-tab__sub {
    display: block;
  }
  /* the active stack gets a vertebra on its edge */
  .sk-tab[data-active]::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -1px;
    width: 3px;
    height: 1.25rem;
    border-radius: 2px;
    background: var(--sk-accent);
    transform: translateY(-50%);
  }
}

/* ── 10. Pricing ───────────────────────────────────────────────────── */
.sk-price {
  font-size: clamp(2.75rem, 2.2rem + 2vw, 3.75rem);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.045em;
  line-height: 1;
}
.sk-checks {
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
}
.sk-checks li {
  display: flex;
  gap: 0.75rem;
  color: var(--sk-mute);
  font-size: 0.9375rem;
  line-height: 1.5;
}
.sk-checks svg {
  color: var(--sk-accent);
}
.sk-plan-pro {
  background: #0a110c;
  border-color: var(--sk-accent-line);
}

/* ── 11. FAQ (accordion) ───────────────────────────────────────────── */
.sk-acc {
  border-top: 1px solid var(--sk-line);
}
.sk-acc__item {
  border-bottom: 1px solid var(--sk-line);
}
.sk-acc__trigger {
  width: 100%;
  padding: 1.3rem 0;
  border: 0;
  background: transparent;
  color: var(--sk-fg);
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s;
}
.sk-acc__trigger:hover {
  color: #fff;
}
.sk-acc__trigger svg {
  margin-top: 0.2rem;
  color: var(--sk-dim);
  transition: color 0.2s;
}
.sk-acc__trigger[data-panel-open] svg {
  color: var(--sk-accent);
}
.sk-acc__body {
  max-width: 44rem;
  padding: 0 2.5rem 1.5rem 0;
  color: var(--sk-mute);
  font-size: 1rem;
  line-height: 1.7;
}

/* ── 12. Footer ────────────────────────────────────────────────────── */
.sk-footer {
  border-top: 1px solid var(--sk-line);
  background: #080908;
}
.sk-footer__bar {
  border-top: 1px solid var(--sk-line);
}
.sk-footer__link {
  color: var(--sk-mute);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: color 0.2s;
}
.sk-footer__link:hover {
  color: #fff;
}
.sk-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--sk-line-2);
  border-radius: var(--sk-r-ctl);
  color: var(--sk-mute);
  transition:
    border-color 0.2s,
    color 0.2s;
}
.sk-icon-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* ── 13. The spine: rail + top progress bar ────────────────────────── */
.sk-progress {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 70;
  height: 2px;
  pointer-events: none;
}
.sk-progress__bar {
  height: 100%;
  background: var(--sk-accent);
  transform: scaleX(0);
  transform-origin: left;
}

.sk-rail {
  position: fixed;
  top: 50%;
  left: clamp(14px, 2.2vw, 36px);
  z-index: 40;
  display: none;
  width: 1px;
  height: min(56vh, 440px);
  transform: translateY(-50%);
}
.sk-rail ul {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sk-rail li {
  position: absolute;
  left: 0;
  transform: translateY(-50%);
}
.sk-rail__track,
.sk-rail__fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
}
.sk-rail__track {
  background: var(--sk-line-2);
}
.sk-rail__fill {
  background: var(--sk-accent);
  box-shadow: 0 0 8px rgba(139, 230, 162, 0.5);
  transform: scaleY(0);
  transform-origin: top;
}
.sk-rail a {
  position: relative;
  display: flex;
  align-items: center;
  width: 2.5rem;
  height: 2rem;
  color: var(--sk-fg);
  text-decoration: none;
}
.sk-rail__bar {
  display: block;
  width: 7px;
  height: 2px;
  border-radius: 2px;
  background: var(--sk-dim);
  opacity: 0.6;
  transition:
    width 0.3s var(--sk-ease),
    opacity 0.3s,
    background-color 0.3s,
    box-shadow 0.3s;
}
.sk-rail a[data-state="passed"] .sk-rail__bar {
  background: var(--sk-accent);
  opacity: 0.7;
}
.sk-rail a[data-state="active"] .sk-rail__bar {
  width: 16px;
  background: var(--sk-accent);
  box-shadow: 0 0 10px rgba(139, 230, 162, 0.6);
  opacity: 1;
}
.sk-rail a:hover .sk-rail__bar,
.sk-rail a:focus-visible .sk-rail__bar {
  width: 13px;
  opacity: 1;
}
.sk-rail__label {
  position: absolute;
  top: 50%;
  left: 1.9rem;
  padding: 0.25rem 0.55rem;
  border: 1px solid var(--sk-line-2);
  border-radius: var(--sk-r-chip);
  background: var(--sk-s2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translate(-4px, -50%);
  transition:
    opacity 0.2s,
    transform 0.2s var(--sk-ease);
}
.sk-rail a:hover .sk-rail__label,
.sk-rail a:focus-visible .sk-rail__label {
  opacity: 1;
  transform: translate(0, -50%);
}
@media (min-width: 1280px) {
  .sk-rail {
    display: block;
  }
  .sk-progress {
    display: none;
  }
}

/* ── 14. Hero ──────────────────────────────────────────────────────── */
.sk-ticks {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: min(100%, 900px);
  pointer-events: none;
  -webkit-mask-image: radial-gradient(80% 90% at 50% 20%, #000 22%, transparent 100%);
  mask-image: radial-gradient(80% 90% at 50% 20%, #000 22%, transparent 100%);
}

/* ── 15. Motion ────────────────────────────────────────────────────── */
@keyframes sk-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sk-line {
  from {
    transform: translateY(108%);
  }
  to {
    transform: none;
  }
}
@keyframes sk-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.sk-rise {
  animation: sk-rise 0.9s var(--sk-ease) both;
  animation-delay: var(--d, 0ms);
}
.sk-mask {
  display: block;
  padding-bottom: 0.14em;
  margin-bottom: -0.14em;
  overflow: hidden;
}
.sk-mask > span {
  display: block;
  animation: sk-line 1.05s var(--sk-ease) both;
  animation-delay: var(--d, 0ms);
}
.sk-in {
  animation: sk-in 0.45s var(--sk-ease) both;
  animation-delay: var(--d, 0ms);
}

/* Skip link: off-screen until it receives keyboard focus. */
.sk-skip {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 100;
  padding: 0.6rem 0.9rem;
  border-radius: var(--sk-r-ctl);
  background: var(--sk-accent);
  color: var(--sk-accent-ink);
  font-size: 0.875rem;
  font-weight: 600;
  transform: translateY(-200%);
}
.sk-skip:focus-visible {
  transform: none;
}

/* Terminal cursor */
.sk-caret {
  display: inline-block;
  width: 0.6em;
  height: 1.05em;
  vertical-align: -0.18em;
  background: var(--sk-accent);
  animation: sk-blink 1.1s steps(1) infinite;
}
@keyframes sk-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sk-root *,
  .sk-root *::before,
  .sk-root *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`