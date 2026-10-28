"use client"

/**
 * Spine — Dashboard
 *
 * Self-contained demo with mock data wired to Spine's actual product mechanics
 * (daily AI-generation quota, stacks, scaffolds, files). Built on shadcn/ui.
 * Design reference: DESIGN.md (tokens, type scale, layout, motion, a11y).
 *
 * To connect real data:
 *  - Replace RAW_USAGE / RAW_FILES_14 / BASE / RECENT_PROJECTS / QUICKSTART with API/DB reads
 *  - Replace FIRST_NAME with the session user (e.g. session.user.name?.split(" ")[0])
 *  - Wire handleGenerate() to the same /api/generate flow as the landing page
 *  - Wire each row's Download button (DownloadButton) to the real scaffold ZIP endpoint
 *
 * shadcn components needed (npx shadcn@latest add ...):
 *  badge button card dialog input label progress separator skeleton table textarea toggle-group tooltip
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Check, ChevronRight, Copy, Download, FolderGit2, Plus, Search, Terminal, X } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/* ════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════ */
type StackId = "nextjs" | "mern" | "micro" | "hono"
type Period = "7" | "14" | "30"
type Tone = "ok" | "warn" | "full"

type Project = {
  id: number
  name: string
  stack: StackId
  files: number
  created: string
}

type QuickStartItem = {
  id: number
  label: string
  done: boolean
  action?: string
}

type NewScaffold = {
  name: string
  stack: StackId
  notes: string
}

type Quota = {
  used: number
  limit: number
  left: number
  pct: number
  tone: Tone
}

/* ════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════ */
const FIRST_NAME = "Alex"
const DAILY_LIMIT = 5
const RECENT_LIMIT = 5

const STACKS: Record<StackId, { label: string; dot: string; files: number }> = {
  nextjs: { label: "Next.js Fullstack", dot: "bg-blue-400", files: 11 },
  mern: { label: "MERN Stack", dot: "bg-violet-400", files: 9 },
  micro: { label: "Microservice", dot: "bg-pink-400", files: 6 },
  hono: { label: "Hono Edge API", dot: "bg-orange-400", files: 8 },
}
const STACK_IDS = Object.keys(STACKS) as StackId[]

/** Last 30 days of generations, oldest first. The last entry is today and never exceeds DAILY_LIMIT. */
const RAW_USAGE = [3, 2, 1, 2, 2, 3, 1, 2, 2, 1, 3, 2, 1, 2, 2, 3, 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 2, 1, 1, 4]
/** Files produced per day over the last 14 days (feeds the Files sparkline and its weekly delta). */
const RAW_FILES_14 = [15, 7, 14, 22, 15, 7, 14, 8, 14, 7, 15, 7, 8, 27]

const BASE = { scaffolds: 128, files: 1024, projects: 18 }

const RECENT_PROJECTS: Project[] = [
  { id: 1, name: "task-manager-api", stack: "nextjs", files: 11, created: "2 hours ago" },
  { id: 2, name: "blog-cms-backend", stack: "mern", files: 9, created: "Yesterday" },
  { id: 3, name: "shop-checkout-service", stack: "hono", files: 8, created: "3 days ago" },
  { id: 4, name: "internal-tools-api", stack: "micro", files: 6, created: "5 days ago" },
  { id: 5, name: "saas-billing-api", stack: "nextjs", files: 13, created: "1 week ago" },
]

const QUICKSTART: QuickStartItem[] = [
  { id: 1, label: "Install the Spine CLI", done: true },
  { id: 2, label: "Generate your first scaffold", done: true },
  { id: 3, label: "Connect a GitHub repo", done: false, action: "Connect" },
  { id: 4, label: "Upgrade to Pro for unlimited runs", done: false },
]

const PRO_PERKS = ["Unlimited AI generations", "Private saved templates", "Custom stack presets", "Team sharing"]
const INSTALL_COMMAND = "npx create-spine@latest"

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)
const WEEK_SCAFFOLDS = sum(RAW_USAGE.slice(-7))
const WEEK_FILES = sum(RAW_FILES_14.slice(-7))
const TODAY_BASE = RAW_USAGE[RAW_USAGE.length - 1]

/* ════════════════════════════════════════════════════════════════
   DESIGN TOKENS (see DESIGN.md)
   Tailwind zinc/emerald classes map 1:1 to the Figma variables. Hex values below are only for
   SVG/Recharts attributes, which cannot take utility classes.
   ════════════════════════════════════════════════════════════════ */
const HEX = {
  accent: "#34d399", // emerald-400
  warn: "#fbbf24", // amber-400
  danger: "#f87171", // red-400
  surface: "#09090b", // zinc-950
  hairline: "#27272a", // zinc-800
  hairlineStrong: "#3f3f46", // zinc-700
  muted: "#a1a1aa", // zinc-400
  faint: "#71717a", // zinc-500
}

const TONE: Record<Tone, { hex: string; text: string; bg: string }> = {
  ok: { hex: HEX.accent, text: "text-emerald-400", bg: "bg-emerald-400" },
  warn: { hex: HEX.warn, text: "text-amber-400", bg: "bg-amber-400" },
  full: { hex: HEX.danger, text: "text-red-400", bg: "bg-red-400" },
}

const CARD =
  "gap-0 rounded-xl border-zinc-800 bg-zinc-950 py-0 text-zinc-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
const H2 = "text-[15px] font-semibold leading-5 tracking-[-0.005em] text-zinc-50"
const SUB = "text-[13px] leading-[18px] text-zinc-400"

const FOCUS = "focus-visible:ring-emerald-400/70"
const BTN_PRIMARY = cn(
  "bg-emerald-500 font-semibold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[background-color,box-shadow,transform]",
  "hover:bg-emerald-400 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_24px_-4px_rgba(52,211,153,0.55)]",
  "active:scale-[0.98] focus-visible:border-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  FOCUS
)
const BTN_OUTLINE = cn(
  "border-zinc-700 bg-transparent text-zinc-50 shadow-none hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-50",
  "dark:border-zinc-700 dark:bg-transparent dark:hover:bg-zinc-900",
  "focus-visible:border-emerald-400/70",
  FOCUS
)
const BTN_GHOST = cn(
  "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-900",
  FOCUS
)
const FIELD = cn(
  "border-zinc-500 bg-black text-zinc-50 shadow-none placeholder:text-zinc-400 dark:bg-black",
  "focus-visible:border-emerald-400/70 focus-visible:ring-emerald-400/25"
)
const TIP =
  "border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-50 [&_svg]:invisible"

/* ════════════════════════════════════════════════════════════════
   MOTION + EFFECT STYLES
   One orchestrated entrance (staggered rise), one signature moment (the spine lights up),
   pointer-following glow on the two "live" panels. All of it is off under reduced motion.
   Written as raw CSS (via dangerouslySetInnerHTML) so selectors are never escaped.
   ════════════════════════════════════════════════════════════════ */
const STYLES = `
.sp-root{--sp-ease:cubic-bezier(.22,1,.36,1)}
@keyframes sp-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes sp-fade{from{opacity:0}to{opacity:1}}
@keyframes sp-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes sp-light{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
@keyframes sp-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes sp-flash{0%,35%{background-color:rgba(52,211,153,.16)}100%{background-color:rgba(52,211,153,0)}}
.sp-rise{animation:sp-rise .7s var(--sp-ease) both;animation-delay:var(--d,0ms)}
.sp-fade{animation:sp-fade .5s ease-out both;animation-delay:var(--df,0ms)}
.sp-draw{stroke-dasharray:1;animation:sp-draw 1.1s var(--sp-ease) both;animation-delay:350ms}
.sp-vertebra{transform-box:fill-box;transform-origin:center;animation:sp-light .55s var(--sp-ease) both;animation-delay:var(--dv,0ms)}
.sp-spine{transform-box:fill-box;transform-origin:top;animation:sp-grow .6s var(--sp-ease) both;animation-delay:250ms}
.sp-flash{animation:sp-flash 2.6s ease-out both}
.sp-chart svg:focus-visible,.sp-chart .recharts-wrapper:focus-visible{outline:2px solid rgba(52,211,153,.7);outline-offset:2px;border-radius:8px}

.sp-glow{position:relative;isolation:isolate;--mx:50%;--my:50%}
.sp-glow::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;opacity:0;
  transition:opacity .35s ease;background:radial-gradient(380px circle at var(--mx) var(--my),rgba(52,211,153,.07),transparent 65%)}
.sp-glow::after{content:"";position:absolute;inset:-1px;z-index:2;border-radius:inherit;padding:1px;pointer-events:none;opacity:0;
  transition:opacity .35s ease;background:radial-gradient(260px circle at var(--mx) var(--my),rgba(52,211,153,.65),transparent 65%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.sp-gap::before{background:radial-gradient(300px circle at var(--mx) var(--my),rgba(52,211,153,.7),transparent 70%)}
@media (hover:hover) and (pointer:fine){.sp-glow:hover::before,.sp-glow:hover::after{opacity:1}}

@media (prefers-reduced-motion:reduce){
  .sp-rise,.sp-fade,.sp-draw,.sp-vertebra,.sp-spine,.sp-flash{animation:none!important}
  .sp-draw{stroke-dasharray:none}
}
`

/** Each effect reads its own delay variable, so a parent's delay never leaks into nested animations. */
const stagger = (ms: number, variable: "--d" | "--df" | "--dv" = "--d"): CSSProperties =>
  ({ [variable]: `${ms}ms` }) as CSSProperties

function trackPointer(e: ReactPointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`)
}

/* ════════════════════════════════════════════════════════════════
   HELPERS + HOOKS
   Anything that depends on "now" is read through useSyncExternalStore: the server snapshot is
   null, so server HTML and the first client render always match (no hydration warnings).
   ════════════════════════════════════════════════════════════════ */
const subscribeClock = (notify: () => void) => {
  const id = window.setInterval(notify, 20_000)
  return () => window.clearInterval(id)
}
const readMinute = () => Math.floor(Date.now() / 60_000)
const readMinuteOnServer = () => 0

function useClock(): Date | null {
  const minute = useSyncExternalStore(subscribeClock, readMinute, readMinuteOnServer)
  return useMemo(() => (minute === 0 ? null : new Date(minute * 60_000)), [minute])
}

/** Live match for a CSS media query. False on the server and during hydration, then corrected. */
function useMedia(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", notify)
      return () => list.removeEventListener("change", notify)
    },
    [query]
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

const usePrefersReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)")

/** Counts up from the last shown value (0 on first mount). Jumps straight to the target under reduced motion. */
function useCountUp(target: number, duration = 900) {
  const reduce = usePrefersReducedMotion()
  const [value, setValue] = useState(0)
  const shown = useRef(0)

  useEffect(() => {
    if (reduce) return
    const from = shown.current
    if (from === target) return
    const length = from === 0 ? duration : 500
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / length, 1)
      const next = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)))
      shown.current = next
      setValue(next)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduce])

  return reduce ? target : value
}

const fmt = (n: number) => n.toLocaleString("en-US")

function quotaOf(used: number, limit: number): Quota {
  const left = Math.max(0, limit - used)
  const pct = limit > 0 ? used / limit : 1
  return { used, limit, left, pct, tone: pct >= 1 ? "full" : pct >= 0.8 ? "warn" : "ok" }
}

function greetingFor(now: Date) {
  const h = now.getHours()
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"
}

/** "9h 41m" until the next 00:00 UTC, when the daily quota resets. */
function resetsInFor(now: Date) {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  const minutes = Math.max(0, Math.round((next - now.getTime()) / 60_000))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const cumulative = (values: number[]) => {
  let running = 0
  return values.map((v) => (running += v))
}

/** Monotone cubic path through points (same family as Recharts' type="monotone"). */
function monotonePath(points: Array<[number, number]>) {
  const n = points.length
  if (n < 2) return ""
  const dx: number[] = []
  const slope: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1][0] - points[i][0]
    slope[i] = (points[i + 1][1] - points[i][1]) / dx[i]
  }
  const m: number[] = new Array(n)
  m[0] = slope[0]
  m[n - 1] = slope[n - 2]
  for (let i = 1; i < n - 1; i++) m[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / slope[i]
    const b = m[i + 1] / slope[i]
    const h = Math.hypot(a, b)
    if (h > 3) {
      const t = 3 / h
      m[i] = t * a * slope[i]
      m[i + 1] = t * b * slope[i]
    }
  }
  let d = `M${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const h = dx[i]
    d += ` C${(x0 + h / 3).toFixed(2)} ${(y0 + (m[i] * h) / 3).toFixed(2)} ${(x1 - h / 3).toFixed(2)} ${(y1 - (m[i + 1] * h) / 3).toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`
  }
  return d
}

/* ════════════════════════════════════════════════════════════════
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */
function StackLabel({ id }: { id: StackId }) {
  const stack = STACKS[id]
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-zinc-50">
      <span className={cn("size-2 shrink-0 rounded-full", stack.dot)} aria-hidden="true" />
      {stack.label}
    </span>
  )
}

function Sparkline({ values }: { values: number[] }) {
  const w = 72
  const h = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const points = values.map((v, i): [number, number] => [
    (i / (values.length - 1)) * w,
    3 + (h - 6) - ((v - min) / (max - min || 1)) * (h - 6),
  ])
  const last = points[points.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible" aria-hidden="true">
      <path
        d={monotonePath(points)}
        pathLength={1}
        className="sp-draw"
        stroke={HEX.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill={HEX.accent} className="sp-fade" style={stagger(1300, "--df")} />
    </svg>
  )
}

function QuotaTicks({ quota }: { quota: Quota }) {
  const lit = Math.ceil((Math.min(quota.used, quota.limit) * 5) / quota.limit)
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("h-[18px] w-1.5 rounded-[3px]", i < lit ? TONE[quota.tone].bg : "bg-zinc-700")} />
      ))}
    </div>
  )
}

function StackDots({ ids }: { ids: StackId[] }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {ids.map((id) => (
        <span key={id} className={cn("size-2 rounded-full", STACKS[id].dot)} />
      ))}
    </div>
  )
}

/**
 * Signature element: the daily quota drawn as five vertebrae on a spine (echoes the logo).
 * Fills top to bottom. Emerald under 80%, amber from 80%, red at the limit.
 */
function SpineMeter({ quota }: { quota: Quota }) {
  const SEGMENTS = 5
  const PITCH = 38
  const lit = Math.ceil((Math.min(quota.used, quota.limit) * SEGMENTS) / quota.limit)
  const color = TONE[quota.tone].hex
  const glowId = `sp-glow-${quota.tone}`
  return (
    <svg width="88" height="176" viewBox="0 0 88 176" fill="none" className="shrink-0 overflow-visible" aria-hidden="true">
      <defs>
        <filter id={glowId} x="-50%" y="-100%" width="200%" height="300%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={color} floodOpacity="0.45" />
        </filter>
      </defs>
      <rect x="43" y="0" width="2" height="176" rx="1" fill={HEX.hairline} />
      {lit > 0 && (
        <rect
          className="sp-spine"
          x="43"
          y="0"
          width="2"
          height={12 + PITCH * (lit - 1)}
          fill={color}
          fillOpacity="0.55"
        />
      )}
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const cy = 12 + PITCH * i
        const on = i < lit
        return (
          <g key={i}>
            <rect x="24" y={cy - 12} width="40" height="24" rx="8" fill={HEX.surface} />
            {on ? (
              <rect
                className="sp-vertebra"
                style={stagger(350 + i * 90, "--dv")}
                x="24.75"
                y={cy - 11.25}
                width="38.5"
                height="22.5"
                rx="7.25"
                fill={color}
                fillOpacity="0.16"
                stroke={color}
                strokeWidth="1.5"
                filter={`url(#${glowId})`}
              />
            ) : (
              <rect
                x="24.75"
                y={cy - 11.25}
                width="38.5"
                height="22.5"
                rx="7.25"
                stroke={HEX.hairlineStrong}
                strokeWidth="1.5"
              />
            )}
            <path d={`M64 ${cy}L80 ${cy - 5}`} stroke={on ? color : HEX.hairlineStrong} strokeWidth="1.5" strokeLinecap="round" />
            <path
              d={`M24 ${cy}L8 ${cy - 5}`}
              stroke={on ? color : HEX.hairlineStrong}
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        )
      })}
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEDGER — four numbers on one hairline grid instead of four identical cards
   ════════════════════════════════════════════════════════════════ */
function LedgerCell({
  label,
  value,
  suffix,
  note,
  noteClass,
  deco,
}: {
  label: string
  value: number
  suffix?: string
  note: string
  noteClass: string
  deco?: ReactNode
}) {
  const shown = useCountUp(value)
  return (
    <div className="flex min-w-0 flex-col gap-1 bg-zinc-950 p-4 max-[359px]:p-3 md:p-5">
      <dt className={cn(SUB, "max-[359px]:text-xs")}>{label}</dt>
      <dd className="flex items-center justify-between gap-3">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[32px] font-medium leading-9 tracking-[-0.025em] tabular-nums" aria-hidden="true">
            {fmt(shown)}
          </span>
          <span className="sr-only">{fmt(value)}</span>
          {suffix && <span className="text-sm text-zinc-400">{suffix}</span>}
        </span>
        {deco && <span className="hidden shrink-0 md:block">{deco}</span>}
      </dd>
      <dd className={cn("text-balance text-xs leading-4", noteClass)}>{note}</dd>
    </div>
  )
}

function Ledger({
  scaffolds,
  scaffoldsWeek,
  scaffoldSeries,
  files,
  filesWeek,
  fileSeries,
  projects,
  stacks,
  quota,
}: {
  scaffolds: number
  scaffoldsWeek: number
  scaffoldSeries: number[]
  files: number
  filesWeek: number
  fileSeries: number[]
  projects: number
  stacks: StackId[]
  quota: Quota
}) {
  const todayNote =
    quota.left === 0 ? "Daily limit reached" : `${quota.left} left until midnight UTC`
  return (
    <Card
      className={cn(CARD, "sp-glow sp-gap sp-rise bg-zinc-800")}
      style={stagger(80)}
      onPointerMove={trackPointer}
    >
      <h2 className="sr-only">Summary</h2>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[11px] lg:grid-cols-4">
        <LedgerCell
          label="Scaffolds generated"
          value={scaffolds}
          note={`+${scaffoldsWeek} this week`}
          noteClass="text-emerald-400"
          deco={<Sparkline values={scaffoldSeries} />}
        />
        <LedgerCell
          label="Files generated"
          value={files}
          note={`+${filesWeek} this week`}
          noteClass="text-emerald-400"
          deco={<Sparkline values={fileSeries} />}
        />
        <LedgerCell
          label="Active projects"
          value={projects}
          note={`Across ${stacks.length} stacks`}
          noteClass="text-zinc-400"
          deco={<StackDots ids={stacks} />}
        />
        <LedgerCell
          label="Generations today"
          value={quota.used}
          suffix={`of ${quota.limit}`}
          note={todayNote}
          noteClass={quota.tone === "ok" ? "text-zinc-400" : TONE[quota.tone].text}
          deco={<QuotaTicks quota={quota} />}
        />
      </dl>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   USAGE CHART
   ════════════════════════════════════════════════════════════════ */
type TooltipProps = {
  active?: boolean
  payload?: Array<{ value?: number | string }>
  label?: string
}

function UsageTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null
  const value = Number(payload[0]?.value ?? 0)
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-50">
        {value} {value === 1 ? "generation" : "generations"}
        <span className="text-zinc-400"> of {DAILY_LIMIT}</span>
      </p>
    </div>
  )
}

type TickProps = {
  x?: number
  y?: number
  index?: number
  payload?: { value: string }
}

/** First label hugs the left edge, last label the right edge, so neither is clipped on phones. */
function XTick({ x = 0, y = 0, index = 0, payload, last }: TickProps & { last: number }) {
  const anchor = index === 0 ? "start" : index === last ? "end" : "middle"
  return (
    <text x={x} y={y + 14} textAnchor={anchor} fill={HEX.muted} fontSize={12}>
      {payload?.value}
    </text>
  )
}

function LimitLabel({ viewBox }: { viewBox?: { x: number; y: number; width: number } }) {
  if (!viewBox) return null
  return (
    <text x={viewBox.x + viewBox.width} y={viewBox.y - 7} textAnchor="end" fill={HEX.muted} fontSize={12}>
      Daily limit
    </text>
  )
}

/** Evenly spread x-axis label positions: fewer on phones so labels never touch. */
const tickIndexes = (n: number, compact: boolean) => {
  const steps = compact ? (n <= 7 ? 2 : 3) : n <= 7 ? 3 : 4
  return Array.from({ length: steps + 1 }, (_, i) => Math.round((i * (n - 1)) / steps))
}

const PERIODS: Period[] = ["7", "14", "30"]

function UsageCard({
  series,
  now,
  period,
  onPeriod,
}: {
  series: number[]
  now: Date | null
  period: Period
  onPeriod: (p: Period) => void
}) {
  const reduce = usePrefersReducedMotion()
  const compact = useMedia("(max-width: 639px)")
  const values = useMemo(() => series.slice(-Number(period)), [series, period])
  const data = useMemo(() => {
    if (!now) return []
    return values.map((value, i) => {
      const day = new Date(now)
      day.setDate(day.getDate() - (values.length - 1 - i))
      return { label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }), value }
    })
  }, [values, now])

  const total = sum(values)
  const avg = (total / values.length).toFixed(1)
  const peak = Math.max(...values)
  const ticks = data.length ? tickIndexes(data.length, compact).map((i) => data[i].label) : []
  const lastPoint = data[data.length - 1]

  return (
    <Card className={cn(CARD, "sp-rise flex flex-col")} style={stagger(160)}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4 md:px-5 md:pt-5">
        <div>
          <h2 className={H2} id="sp-usage-title">
            Generations per day
          </h2>
          <p className={cn(SUB, "mt-0.5")}>Last {period} days</p>
        </div>
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(v) => v && onPeriod(v as Period)}
          aria-label="Date range"
          className="gap-0.5 rounded-lg bg-zinc-900 p-0.5"
        >
          {PERIODS.map((p) => (
            <ToggleGroupItem
              key={p}
              value={p}
              aria-label={`${p}D, last ${p} days`}
              className={cn(
                "h-9 min-w-11 rounded-md border border-transparent px-3 text-xs font-medium text-zinc-400 md:h-7 md:min-w-0 md:px-2.5",
                "hover:bg-zinc-800/70 hover:text-zinc-50 data-[spacing=0]:rounded-md",
                "data-[state=on]:border-zinc-500 data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-50",
                FOCUS
              )}
            >
              {p}D
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div
        role="group"
        aria-labelledby="sp-usage-title"
        className="relative min-h-[200px] flex-1 px-4 py-2 md:min-h-[240px] md:px-5"
      >
        <div className="sp-chart absolute inset-x-4 inset-y-2 md:inset-x-5">
          {data.length === 0 ? (
            <Skeleton className="h-full w-full bg-zinc-900" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 26, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sp-usage-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={HEX.accent} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={HEX.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={HEX.hairline} strokeOpacity={0.7} vertical={false} />
                <XAxis
                  dataKey="label"
                  ticks={ticks}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: HEX.hairlineStrong }}
                  tick={<XTick last={ticks.length - 1} />}
                  height={26}
                />
                <YAxis
                  domain={[0, DAILY_LIMIT]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  width={24}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fill: HEX.muted, fontSize: 12 }}
                />
                <ReferenceLine y={DAILY_LIMIT} stroke={HEX.faint} strokeDasharray="4 4" label={<LimitLabel />} />
                <ChartTooltip
                  content={<UsageTooltip />}
                  cursor={{ stroke: HEX.hairlineStrong, strokeWidth: 1 }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={HEX.accent}
                  strokeWidth={2}
                  fill="url(#sp-usage-fill)"
                  dot={false}
                  activeDot={{ r: 4, fill: HEX.accent, stroke: HEX.surface, strokeWidth: 2 }}
                  isAnimationActive={!reduce}
                  animationDuration={900}
                />
                {lastPoint && (
                  <ReferenceDot
                    x={lastPoint.label}
                    y={lastPoint.value}
                    r={8}
                    fill={HEX.accent}
                    fillOpacity={0.2}
                    stroke="none"
                    ifOverflow="visible"
                  />
                )}
                {lastPoint && (
                  <ReferenceDot
                    x={lastPoint.label}
                    y={lastPoint.value}
                    r={4}
                    fill={HEX.accent}
                    stroke={HEX.surface}
                    strokeWidth={2}
                    ifOverflow="visible"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <table className="sr-only">
          <caption>Generations per day, last {period} days</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Generations</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <th scope="row">{d.label}</th>
                <td>{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="grid grid-cols-3 gap-4 border-t border-zinc-800 px-4 pb-4 pt-3.5 md:px-5">
        <div>
          <dt className="text-xs leading-4 text-zinc-400">Total in range</dt>
          <dd className="text-sm font-medium tabular-nums">{total}</dd>
        </div>
        <div>
          <dt className="text-xs leading-4 text-zinc-400">Daily average</dt>
          <dd className="text-sm font-medium tabular-nums">{avg}</dd>
        </div>
        <div>
          <dt className="text-xs leading-4 text-zinc-400">Peak day</dt>
          <dd className="text-sm font-medium tabular-nums text-emerald-400">{peak}</dd>
        </div>
      </dl>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   QUOTA (PLAN) CARD
   ════════════════════════════════════════════════════════════════ */
function QuotaCard({ quota, resetsIn }: { quota: Quota; resetsIn: string | null }) {
  return (
    <Card
      className={cn(
        CARD,
        "sp-glow sp-rise flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-5 xl:flex-col xl:gap-4"
      )}
      style={stagger(220)}
      onPointerMove={trackPointer}
    >
      <div className="flex flex-col gap-4 md:flex-1 xl:flex-none">
        <div className="flex items-center justify-between gap-3 md:justify-start xl:justify-between">
          <h2 className={H2}>Daily generations</h2>
          <Badge variant="outline" className="rounded-md border-zinc-700 px-2 text-xs font-medium text-zinc-300">
            Free
          </Badge>
        </div>
        <div className="flex items-center gap-5">
          <SpineMeter quota={quota} />
          <div className="min-w-0">
            <p
              className={cn(
                "text-[56px] font-medium leading-none tracking-[-0.04em] tabular-nums",
                quota.tone === "full" ? "text-red-400" : "text-zinc-50"
              )}
            >
              {quota.left}
            </p>
            <p className="mt-1 text-sm font-medium leading-5">
              {quota.left === 1 ? "generation" : "generations"} left today
            </p>
            <p className="mt-1 text-xs leading-4 text-zinc-400">
              {quota.used} of {quota.limit} used today
            </p>
            <p className="text-xs leading-4 text-zinc-400">
              {resetsIn ? `Resets in ${resetsIn}` : "Resets at midnight UTC"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-zinc-800 md:hidden xl:block" />

      <div className="flex flex-col gap-4 md:w-[280px] md:shrink-0 md:justify-center xl:w-auto">
        <ul className="flex flex-col gap-2">
          {PRO_PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-[13px] leading-[18px] text-zinc-400">
              <Check className="size-3.5 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden="true" />
              {perk}
            </li>
          ))}
        </ul>
        <Button variant="outline" className={cn(BTN_OUTLINE, "h-11 w-full md:h-9")}>
          Upgrade to Pro, $9/mo
        </Button>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   PROJECTS
   ════════════════════════════════════════════════════════════════ */
function DownloadButton({ name, touch = false }: { name: string; touch?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Download ${name} as ZIP`}
          className={cn(BTN_GHOST, touch ? "size-11" : "size-8")}
          onClick={() => {
            // TODO: point at the real scaffold ZIP endpoint, e.g. window.location.assign(`/api/scaffolds/${id}/zip`)
          }}
        >
          <Download className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className={TIP}>Download ZIP</TooltipContent>
    </Tooltip>
  )
}

function ProjectsCard({
  projects,
  total,
  freshId,
}: {
  projects: Project[]
  total: number
  freshId: number | null
}) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const rows = q
    ? projects.filter((p) => p.name.includes(q) || STACKS[p.stack].label.toLowerCase().includes(q))
    : projects

  return (
    <Card className={cn(CARD, "sp-rise overflow-hidden")} style={stagger(300)}>
      <div className="flex flex-col gap-3 px-4 pb-3 pt-4 md:flex-row md:items-center md:justify-between md:px-5 md:pb-4 md:pt-5">
        <div>
          <h2 className={H2}>Recent scaffolds</h2>
          <p className={cn(SUB, "mt-0.5")}>
            {q ? `${rows.length} of ${projects.length} recent match` : `Showing ${projects.length} of ${total} projects`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-[200px] md:flex-none">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("")
              }}
              placeholder="Filter projects"
              aria-label="Filter projects"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              className={cn(FIELD, "h-11 pl-9 pr-10 md:h-8 md:pr-8 md:text-[13px]")}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear filter"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 md:size-6"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(BTN_GHOST, "hidden md:inline-flex")}
            onClick={() => {
              // TODO: navigate to the full projects list
            }}
          >
            View all
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="mx-4 mb-4 flex flex-col items-center rounded-lg border border-dashed border-zinc-800 px-6 py-14 text-center md:mx-5 md:mb-5">
          <span className="mb-3 flex size-10 items-center justify-center rounded-lg border border-emerald-800 bg-emerald-950">
            <Terminal className="size-4 text-emerald-400" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium">No scaffolds yet</p>
          <p className="mt-1 max-w-xs text-[13px] leading-5 text-zinc-400">
            Run <code className="font-mono text-emerald-400">{INSTALL_COMMAND}</code> or generate one from this
            dashboard.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="mx-4 mb-4 flex flex-col items-center rounded-lg border border-dashed border-zinc-800 px-6 py-12 text-center md:mx-5 md:mb-5">
          <p className="text-sm font-medium">No projects match “{query.trim()}”</p>
          <Button variant="outline" size="sm" className={cn(BTN_OUTLINE, "mt-3")} onClick={() => setQuery("")}>
            Clear filter
          </Button>
        </div>
      ) : (
        <>
          {/* md and up: real table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-y border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/50">
                  <TableHead className="h-9 pl-5 text-xs text-zinc-400">Project</TableHead>
                  <TableHead className="h-9 w-[184px] text-xs text-zinc-400">Stack</TableHead>
                  <TableHead className="h-9 w-[72px] text-right text-xs text-zinc-400">Files</TableHead>
                  <TableHead className="h-9 w-[128px] text-xs text-zinc-400">Created</TableHead>
                  <TableHead className="h-9 w-[68px] pr-5">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow
                    key={p.id}
                    className={cn("h-[52px] border-zinc-800 hover:bg-zinc-900/60", p.id === freshId && "sp-flash")}
                  >
                    <TableCell className="w-full max-w-0 pl-5">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900"
                          aria-hidden="true"
                        >
                          <FolderGit2 className="size-3.5 text-zinc-400" />
                        </span>
                        <span className="truncate font-mono text-[13px] text-zinc-50">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StackLabel id={p.stack} />
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums text-zinc-400">{p.files}</TableCell>
                    <TableCell className="text-[13px] text-zinc-400">{p.created}</TableCell>
                    <TableCell className="pr-5 text-right">
                      <DownloadButton name={p.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* below md: a list, so nothing scrolls sideways and every target is 44px */}
          <ul className="border-t border-zinc-800 md:hidden">
            {rows.map((p) => (
              <li
                key={p.id}
                className={cn(
                  "flex items-center gap-2 border-b border-zinc-800 py-2 pl-4 pr-2",
                  p.id === freshId && "sp-flash"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[13px] leading-[18px] text-zinc-50">{p.name}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs leading-4 text-zinc-400">
                    <StackLabel id={p.stack} />
                    <span>{p.files} files</span>
                    <span>{p.created}</span>
                  </p>
                </div>
                <DownloadButton name={p.name} touch />
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                className={cn(BTN_GHOST, "h-12 w-full rounded-none text-sm font-medium")}
                onClick={() => {
                  // TODO: navigate to the full projects list
                }}
              >
                View all projects
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </li>
          </ul>
        </>
      )}
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   QUICK START
   ════════════════════════════════════════════════════════════════ */
function QuickStartCard({ items }: { items: QuickStartItem[] }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const done = items.filter((i) => i.done).length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the command stays selectable.
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Card className={cn(CARD, "sp-rise flex flex-col gap-4 p-4 md:p-5")} style={stagger(380)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={H2}>Quick start</h2>
        <p className="text-xs leading-4 text-zinc-400">
          {done} of {items.length} done
        </p>
      </div>
      <Progress
        value={(done / items.length) * 100}
        aria-label="Quick start progress"
        className="h-1 bg-zinc-800 [&>div]:bg-emerald-500"
      />

      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} className="flex min-h-10 items-center gap-3 md:min-h-8">
            {item.done ? (
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <Check className="size-2.5 text-zinc-950" strokeWidth={3.5} aria-hidden="true" />
              </span>
            ) : (
              <span className="size-4 shrink-0 rounded-full border-[1.5px] border-zinc-600" aria-hidden="true" />
            )}
            <span
              className={cn(
                "min-w-0 flex-1 text-sm leading-5",
                item.done ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-50"
              )}
            >
              {item.label}
              <span className="sr-only">{item.done ? " (completed)" : " (not completed)"}</span>
            </span>
            {item.action && (
              <Button
                variant="outline"
                size="sm"
                className={cn(BTN_OUTLINE, "h-10 md:h-8")}
                onClick={() => {
                  // TODO: start the GitHub connect flow
                }}
              >
                {item.action}
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <p className="text-xs leading-4 text-zinc-400">Prefer the terminal? Run this in an empty folder.</p>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black py-2 pl-3 pr-2">
          <span className="font-mono text-[13px] text-emerald-400" aria-hidden="true">
            $
          </span>
          <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-zinc-50">{INSTALL_COMMAND}</code>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Copy command"
                className={cn(BTN_GHOST, "size-9 md:size-7")}
                onClick={copy}
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className={TIP}>{copied ? "Copied" : "Copy command"}</TooltipContent>
          </Tooltip>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Command copied to clipboard" : ""}
          </span>
        </div>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   NEW SCAFFOLD DIALOG
   The form lives in its own component so Radix unmounts it on close and every open starts clean.
   ════════════════════════════════════════════════════════════════ */
function ScaffoldForm({
  quota,
  resetsIn,
  onCancel,
  onUpgrade,
  onGenerate,
}: {
  quota: Quota
  resetsIn: string | null
  onCancel: () => void
  onUpgrade: () => void
  onGenerate: (values: NewScaffold) => void
}) {
  const [name, setName] = useState("")
  const [stack, setStack] = useState<StackId>("nextjs")
  const [notes, setNotes] = useState("")
  const [busy, setBusy] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const full = quota.left === 0
  // Typing may leave stray dashes ("my-"); the submitted slug never does.
  const slug = name.replace(/-+/g, "-").replace(/^-|-$/g, "")
  const canSubmit = slug.length >= 2 && !full && !busy

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    // TODO: replace with the real flow, e.g. await fetch("/api/generate", { method: "POST", body: ... })
    timer.current = window.setTimeout(() => onGenerate({ name: slug, stack, notes }), 900)
  }

  const titleClass = "text-[17px] font-semibold leading-6 tracking-[-0.01em] text-zinc-50"

  if (full) {
    return (
      <div className="grid gap-5">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className={titleClass}>Daily limit reached</DialogTitle>
          <DialogDescription className="text-sm leading-5 text-zinc-400">
            All {quota.limit} generations are used.{" "}
            {resetsIn ? `They reset in ${resetsIn}` : "They reset at midnight UTC"}, or upgrade for unlimited runs.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" className={cn(BTN_OUTLINE, "h-11 md:h-9")} onClick={onCancel}>
            Not now
          </Button>
          <Button type="button" className={cn(BTN_PRIMARY, "h-11 md:h-9")} onClick={onUpgrade}>
            Upgrade to Pro, $9/mo
          </Button>
        </DialogFooter>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <DialogHeader className="gap-1.5 text-left">
        <DialogTitle className={titleClass}>New scaffold</DialogTitle>
        <DialogDescription className="text-sm text-zinc-400">
          {quota.left} {quota.left === 1 ? "generation" : "generations"} left today.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor="sp-name" className="text-[13px] text-zinc-50">
          Project name
        </Label>
        <Input
          id="sp-name"
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
          onBlur={() => setName(slug)}
          placeholder="my-api"
          maxLength={48}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby="sp-name-hint"
          className={cn(FIELD, "h-11 font-mono md:h-9 md:text-[13px]")}
        />
        <p id="sp-name-hint" className="text-xs leading-4 text-zinc-400">
          Lowercase letters, numbers and dashes.
        </p>
      </div>

      <fieldset className="grid gap-2 border-0 p-0">
        <legend className="mb-2 text-[13px] font-medium text-zinc-50">Stack</legend>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          {STACK_IDS.map((id) => {
            const selected = stack === id
            return (
              <label key={id} className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="sp-stack"
                  value={id}
                  checked={selected}
                  onChange={() => setStack(id)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex h-11 items-center gap-2.5 rounded-lg border px-3 text-[13px] transition-colors",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/70",
                    selected
                      ? "border-emerald-700 bg-emerald-950/60 text-zinc-50"
                      : "border-zinc-700 bg-black text-zinc-50 hover:border-zinc-600"
                  )}
                >
                  <span className={cn("size-2 shrink-0 rounded-full", STACKS[id].dot)} aria-hidden="true" />
                  <span className="truncate">{STACKS[id].label}</span>
                  {selected && <Check className="ml-auto size-3.5 shrink-0 text-emerald-400" aria-hidden="true" />}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor="sp-notes" className="text-[13px] text-zinc-50">
          What should it include? <span className="font-normal text-zinc-400">(optional)</span>
        </Label>
        <Textarea
          id="sp-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. REST API with JWT auth and a Postgres schema"
          className={cn(FIELD, "min-h-20 resize-none")}
        />
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" className={cn(BTN_OUTLINE, "h-11 md:h-9")} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} className={cn(BTN_PRIMARY, "h-11 md:h-9")}>
          {busy ? (
            <>
              <Spinner /> Generating…
            </>
          ) : (
            "Generate scaffold"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

function NewScaffoldDialog({
  open,
  onOpenChange,
  finalFocus,
  quota,
  resetsIn,
  onGenerate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: () => HTMLElement | null
  quota: Quota
  resetsIn: string | null
  onGenerate: (values: NewScaffold) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        finalFocus={finalFocus}
        className={cn(
          "dark max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-xl border-zinc-800 bg-zinc-950 p-5 text-zinc-50",
          "shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] sm:max-w-[440px]"
        )}
      >
        <ScaffoldForm
          quota={quota}
          resetsIn={resetsIn}
          onCancel={() => onOpenChange(false)}
          onUpgrade={() => {
            // TODO: send the user to your pricing / checkout route
            onOpenChange(false)
          }}
          onGenerate={onGenerate}
        />
      </DialogContent>
    </Dialog>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const now = useClock()
  const [period, setPeriod] = useState<Period>("14")
  const [added, setAdded] = useState<Project[]>([])
  const [freshId, setFreshId] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const returnFocus = useRef<HTMLElement | null>(null)

  // Everything below derives from the mock data plus whatever was generated in this session.
  const extra = added.length
  const extraFiles = sum(added.map((p) => p.files))
  const quota = quotaOf(TODAY_BASE + extra, DAILY_LIMIT)

  const series = useMemo(
    () => RAW_USAGE.map((v, i) => (i === RAW_USAGE.length - 1 ? v + extra : v)),
    [extra]
  )
  const fileSeries = useMemo(
    () => RAW_FILES_14.map((v, i) => (i === RAW_FILES_14.length - 1 ? v + extraFiles : v)),
    [extraFiles]
  )
  const projects = useMemo(() => [...added, ...RECENT_PROJECTS].slice(0, RECENT_LIMIT), [added])
  const stacksInUse = useMemo(
    () => STACK_IDS.filter((id) => [...added, ...RECENT_PROJECTS].some((p) => p.stack === id)),
    [added]
  )

  // Remember the opener so Base UI can restore focus when the controlled dialog closes.
  const openDialog = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setDialogOpen(true)
  }, [])
  const getReturnFocus = useCallback(() => returnFocus.current, [])

  const handleGenerate = useCallback(({ name, stack }: NewScaffold) => {
    const id = Date.now()
    setAdded((prev) => [{ id, name, stack, files: STACKS[stack].files, created: "Just now" }, ...prev])
    setFreshId(id)
    setDialogOpen(false)
  }, [])

  useEffect(() => {
    if (freshId === null) return
    const t = window.setTimeout(() => setFreshId(null), 2800)
    return () => window.clearTimeout(t)
  }, [freshId])

  const resetsIn = now ? resetsInFor(now) : null

  return (
    <TooltipProvider delayDuration={150}>
      <div className="sp-root dark relative isolate min-h-screen overflow-x-clip bg-black font-sans text-zinc-50 antialiased">
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px]"
          style={{ background: "radial-gradient(50% 100% at 12% 0%, rgba(16,185,129,0.10), transparent 70%)" }}
          aria-hidden="true"
        />

        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-5 md:px-6 md:pb-12 md:pt-8 lg:px-8">
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div
                className={cn(
                  "transition-opacity duration-500 motion-reduce:transition-none",
                  now ? "opacity-100" : "opacity-0"
                )}
              >
                <h1 className="text-2xl font-semibold leading-[30px] tracking-[-0.02em] md:text-[28px] md:leading-[34px]">
                  {now ? greetingFor(now) : "Welcome back"}, {FIRST_NAME}
                </h1>
                <p className="mt-1 text-sm leading-5 text-zinc-400">
                  {now
                    ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                    : " "}
                </p>
              </div>
              <div className="sp-rise md:shrink-0">
                <Button
                  className={cn(BTN_PRIMARY, "h-11 w-full md:h-9 md:w-auto")}
                  onClick={openDialog}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  New scaffold
                </Button>
              </div>
            </div>

            <Ledger
              scaffolds={BASE.scaffolds + extra}
              scaffoldsWeek={WEEK_SCAFFOLDS + extra}
              scaffoldSeries={cumulative(series.slice(-14))}
              files={BASE.files + extraFiles}
              filesWeek={WEEK_FILES + extraFiles}
              fileSeries={cumulative(fileSeries)}
              projects={BASE.projects + extra}
              stacks={stacksInUse}
              quota={quota}
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_395px]">
              <UsageCard series={series} now={now} period={period} onPeriod={setPeriod} />
              <QuotaCard quota={quota} resetsIn={resetsIn} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_395px]">
              <ProjectsCard projects={projects} total={BASE.projects + extra} freshId={freshId} />
              <QuickStartCard items={QUICKSTART} />
            </div>

            <p className="text-center text-xs leading-4 text-zinc-400">Spinekit © {now ? now.getFullYear() : ""}</p>
          </div>
        </main>

        <NewScaffoldDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          finalFocus={getReturnFocus}
          quota={quota}
          resetsIn={resetsIn}
          onGenerate={handleGenerate}
        />
      </div>
    </TooltipProvider>
  )
}