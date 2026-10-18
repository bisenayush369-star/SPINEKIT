"use client"

/**
 * Spine — Dashboard
 * Self-contained demo with realistic mock data wired to Spine's actual product
 * mechanics (daily AI-generation quota, stacks, scaffolds, files).
 *
 * To connect real data:
 *  - Replace STATS / RECENT_PROJECTS / USAGE_DATA / NOTIFICATIONS with API/DB reads
 *  - Replace "Alex Chen" with session.user.name (NextAuth) in Sidebar + Topbar
 *  - Wire "Generate new scaffold" to the same /api/generate flow as the landing page
 *  - Wire each row's Download button to the real scaffold ZIP endpoint
 */

import { useState, useEffect, useMemo } from "react"
import {
  Zap, Package, FileCode, FolderOpen, LayoutDashboard, FolderGit2, Layers,
  KeyRound, CreditCard, Settings, Bell, Search, Menu, X, ChevronDown, ChevronRight,
  LogOut, User, TrendingUp, Plus, Download, Copy, Check, Circle, Terminal,
  type LucideIcon,
} from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

/* Tiny className joiner so this file doesn't depend on "@/lib/utils" being present */
const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ")

type StackId = keyof typeof STACK_META

type NavItem = {
  id: string
  label: string
  icon: LucideIcon
}

type UsagePoint = {
  label: string
  value: number
}

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
}

/* ════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "templates", label: "Templates", icon: Layers },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
]

const STACK_META = {
  nextjs: { label: "Next.js Fullstack", text: "text-blue-400", bg: "bg-blue-950", border: "border-blue-800" },
  mern: { label: "MERN Stack", text: "text-violet-400", bg: "bg-violet-950", border: "border-violet-800" },
  micro: { label: "Microservice", text: "text-amber-400", bg: "bg-amber-950", border: "border-amber-800" },
  hono: { label: "Hono Edge API", text: "text-orange-400", bg: "bg-orange-950", border: "border-orange-800" },
}

const STATS = {
  generationsToday: 4,
  dailyLimit: 5,
  scaffoldsTotal: 128,
  scaffoldsDelta: 12,
  filesTotal: 1024,
  filesDelta: 86,
  activeProjects: 18,
  stacksInUse: 4,
}

const RECENT_PROJECTS: Project[] = [
  { id: 1, name: "task-manager-api", stack: "nextjs", files: 11, created: "2 hours ago" },
  { id: 2, name: "blog-cms-backend", stack: "mern", files: 9, created: "Yesterday" },
  { id: 3, name: "shop-checkout-service", stack: "hono", files: 8, created: "3 days ago" },
  { id: 4, name: "internal-tools-api", stack: "micro", files: 6, created: "5 days ago" },
  { id: 5, name: "saas-billing-api", stack: "nextjs", files: 13, created: "1 week ago" },
]

const QUICKSTART = [
  { id: 1, label: "Install the Spine CLI", done: true },
  { id: 2, label: "Generate your first scaffold", done: true },
  { id: 3, label: "Connect a GitHub repo", done: false },
  { id: 4, label: "Upgrade to Pro for unlimited runs", done: false },
]

const NOTIFICATIONS = [
  { id: 1, title: "Your task-manager-api scaffold finished generating.", time: "2 hours ago", unread: true },
  { id: 2, title: "New template available: Hono Edge API v2.", time: "1 day ago", unread: true },
  { id: 3, title: "Your weekly usage summary is ready.", time: "3 days ago", unread: false },
]

const RAW_USAGE = [2,1,3,2,4,3,2,3,4,2,5,3,4,3,4,5,3,6,4,5,4,5,6,4,7,5,6,5,7,6]
const USAGE_DATA = RAW_USAGE.map((value, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (RAW_USAGE.length - 1 - i))
  return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), value }
})

/* ════════════════════════════════════════════════════════════════
   HOOKS
   ════════════════════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState<number>(0)
  useEffect(() => {
    let raf: number | undefined
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf)
    }
  }, [target, duration])
  return value
}

/* ════════════════════════════════════════════════════════════════
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="1" x2="12" y2="23" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="5" x2="18" y2="3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12" y1="5" x2="6" y2="3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
        <line x1="12" y1="11" x2="18" y2="9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12" y1="11" x2="6" y2="9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
        <line x1="12" y1="17" x2="18" y2="15" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12" y1="17" x2="6" y2="15" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      </svg>
      <span className="font-bold text-base tracking-tight text-zinc-50">Spine</span>
    </div>
  )
}

function StackBadge({ stackId }: { stackId: StackId }) {
  const meta = STACK_META[stackId]
  if (!meta) return null
  return (
    <Badge variant="outline" className={cx("font-mono text-xs whitespace-nowrap", meta.bg, meta.border, meta.text)}>
      {meta.label}
    </Badge>
  )
}

type TooltipProps = {
  active?: boolean
  payload?: Array<{ value?: number | string }>
  label?: string
}

function UsageTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-2xl">
      <p className="text-xs text-zinc-500 font-mono mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-emerald-400">{payload[0]?.value ?? 0} scaffolds</p>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR
   ════════════════════════════════════════════════════════════════ */
function SidebarContent({
  activeNav,
  onNavigate,
  onClose,
}: {
  activeNav: string
  onNavigate: (id: string) => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-800 shrink-0">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors lg:hidden" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-2.5 text-xs font-semibold text-zinc-600 tracking-widest uppercase mb-2">Workspace</p>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cx(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left border",
                  active
                    ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border-transparent"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 px-2 py-2 mb-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs text-zinc-500">All systems operational</span>
        </div>
        <Separator className="bg-zinc-800 mb-2" />
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar className="h-8 w-8 border border-zinc-700 shrink-0">
            <AvatarFallback className="bg-emerald-950 text-emerald-400 text-xs font-semibold">AC</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-200 truncate">Alex Chen</p>
            <p className="text-xs text-zinc-600 truncate">Free plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   TOPBAR
   ════════════════════════════════════════════════════════════════ */
function Topbar({
  onMenuClick,
  notifOpen,
  setNotifOpen,
  userMenuOpen,
  setUserMenuOpen,
}: {
  onMenuClick: () => void
  notifOpen: boolean
  setNotifOpen: React.Dispatch<React.SetStateAction<boolean>>
  userMenuOpen: boolean
  setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-2 sm:gap-3 px-4 md:px-6 bg-black/80 backdrop-blur-md border-b border-zinc-800 shrink-0">
      <button onClick={onMenuClick} className="text-zinc-400 hover:text-zinc-100 transition-colors lg:hidden shrink-0" aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-sm font-semibold text-zinc-100">Overview</h1>

      <div className="flex-1" />

      <div className="relative hidden sm:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
        <Input
          placeholder="Search projects..."
          className="h-9 w-40 lg:w-64 pl-8 bg-zinc-900 border-zinc-800 text-sm placeholder:text-zinc-600 focus-visible:ring-emerald-600"
        />
      </div>

      <Button size="sm" className="hidden sm:inline-flex bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs h-8 gap-1.5">
        <Plus className="w-3.5 h-3.5" /> New scaffold
      </Button>

      <div className="relative">
        <button
          onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false) }}
          className="relative text-zinc-400 hover:text-zinc-100 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800/60"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800">
                <p className="text-xs font-semibold text-zinc-300">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/40 transition-colors">
                    <div className="flex items-start gap-2">
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />}
                      <div className={cx(!n.unread && "pl-3.5")}>
                        <p className="text-xs text-zinc-300 leading-relaxed">{n.title}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false) }} className="flex items-center gap-1.5" aria-label="Account menu">
          <Avatar className="h-8 w-8 border border-zinc-700">
            <AvatarFallback className="bg-emerald-950 text-emerald-400 text-xs font-semibold">AC</AvatarFallback>
          </Avatar>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block" />
        </button>
        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 overflow-hidden py-1.5">
              <div className="px-3.5 py-2 mb-1 border-b border-zinc-800">
                <p className="text-xs font-medium text-zinc-200">Alex Chen</p>
                <p className="text-xs text-zinc-600">alex@example.com</p>
              </div>
              {[{ icon: User, label: "Profile" }, { icon: Settings, label: "Settings" }, { icon: CreditCard, label: "Billing" }].map((item) => {
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left"
                  >
                    <ItemIcon className="w-3.5 h-3.5" /> {item.label}
                  </button>
                )
              })}
              <Separator className="bg-zinc-800 my-1.5" />
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/40 transition-colors text-left">
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

/* ════════════════════════════════════════════════════════════════
   STAT CARD
   ════════════════════════════════════════════════════════════════ */
function StatCard({
  icon: Icon,
  label,
  value,
  tag,
  tone = "positive",
}: {
  icon: LucideIcon
  label: string
  value: number
  tag?: string
  tone?: "positive" | "neutral"
}) {
  const count = useCountUp(value)
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center">
            <Icon className="w-4 h-4 text-emerald-400" />
          </div>
          {tag && (
            <span
              className={cx(
                "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md font-mono",
                tone === "positive" ? "text-emerald-400 bg-emerald-950/60" : "text-zinc-500 bg-zinc-800/60"
              )}
            >
              {tone === "positive" && <TrendingUp className="w-3 h-3" />}
              {tag}
            </span>
          )}
        </div>
        <p className="text-2xl font-extrabold tracking-tight tabular-nums">{count.toLocaleString()}</p>
        <p className="text-xs text-zinc-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   USAGE CARD — signature terminal-chrome panel (mirrors the landing
   page's generator output window)
   ════════════════════════════════════════════════════════════════ */
function UsageCard({
  period,
  setPeriod,
  data,
}: {
  period: string
  setPeriod: React.Dispatch<React.SetStateAction<string>>
  data: UsagePoint[]
}) {
  const total = data.reduce((a: number, b: UsagePoint) => a + b.value, 0)
  const avg = (total / data.length).toFixed(1)
  const peak = Math.max(...data.map((d: UsagePoint) => d.value))

  return (
    <Card className="bg-zinc-950 border-zinc-800 overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="text-xs text-zinc-500 font-mono ml-2">usage — scaffolds/day</span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-md p-0.5">
          {["7", "14", "30"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cx(
                "px-2 py-1 rounded text-xs font-mono transition-colors",
                period === p ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {p}D
            </button>
          ))}
        </div>
      </div>
      <CardContent className="p-5 pt-6">
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={24} allowDecimals={false} />
              <Tooltip content={<UsageTooltip />} cursor={{ stroke: "#3f3f46", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} fill="url(#usageFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 mt-2 pt-4 border-t border-zinc-900">
          <div>
            <p className="text-xs text-zinc-600">Total in range</p>
            <p className="text-sm font-mono font-semibold text-zinc-200">{total}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600">Daily average</p>
            <p className="text-sm font-mono font-semibold text-zinc-200">{avg}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600">Peak day</p>
            <p className="text-sm font-mono font-semibold text-emerald-400">{peak}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   PLAN CARD
   ════════════════════════════════════════════════════════════════ */
function PlanCard({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const nearLimit = pct >= 80
  const left = Math.max(0, limit - used)

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">Current plan</p>
          <Badge variant="outline" className="bg-zinc-950 border-zinc-700 text-zinc-400 text-xs">Free</Badge>
        </div>
        <p className="text-lg font-bold tracking-tight mb-5">Free Forever</p>

        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">Daily generations</span>
          <span className={cx("text-xs font-mono", nearLimit ? "text-amber-400" : "text-zinc-400")}>{used} / {limit}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden mb-1.5">
          <div
            className={cx("h-full rounded-full transition-all duration-500", nearLimit ? "bg-amber-400" : "bg-emerald-400")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-zinc-600 mb-6">{left} left today · resets at midnight UTC</p>

        <div className="flex flex-col gap-2 mb-6 flex-1">
          {["Unlimited AI generations", "Private saved templates", "Custom stack presets", "Team sharing"].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs text-zinc-400">{f}</span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">Upgrade to Pro — $9/mo</Button>
      </CardContent>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   PROJECTS TABLE
   ════════════════════════════════════════════════════════════════ */
function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Recent activity</p>
            <h3 className="text-base font-bold tracking-tight">Your projects</h3>
          </div>
          <button className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors inline-flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-zinc-800 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-3">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm text-zinc-400 mb-1">No scaffolds yet</p>
            <p className="text-xs text-zinc-600 max-w-xs">
              Run <span className="text-emerald-400 font-mono">npx create-spine@latest</span> or generate one from this dashboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-2 pb-2.5 font-medium text-zinc-500 text-xs whitespace-nowrap">Project</th>
                  <th className="px-2 pb-2.5 font-medium text-zinc-500 text-xs whitespace-nowrap">Stack</th>
                  <th className="px-2 pb-2.5 font-medium text-zinc-500 text-xs text-right whitespace-nowrap">Files</th>
                  <th className="px-2 pb-2.5 font-medium text-zinc-500 text-xs whitespace-nowrap">Created</th>
                  <th className="px-2 pb-2.5 font-medium text-zinc-500 text-xs text-right whitespace-nowrap">Download</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-900 last:border-0 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                          <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <span className="font-medium text-zinc-200 whitespace-nowrap">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <StackBadge stackId={p.stack} />
                    </td>
                    <td className="px-2 py-3 text-right font-mono text-zinc-400 text-xs">{p.files}</td>
                    <td className="px-2 py-3 text-zinc-500 text-xs whitespace-nowrap">{p.created}</td>
                    <td className="px-2 py-3 text-right">
                      <button
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-500 hover:text-emerald-400 hover:bg-emerald-950/50 transition-colors"
                        title="Download ZIP"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   QUICK START
   ════════════════════════════════════════════════════════════════ */
function QuickStartCard({ items }: { items: QuickStartItem[] }) {
  const [copied, setCopied] = useState(false)
  const doneCount = items.filter((i) => i.done).length

  const copy = () => {
    navigator.clipboard?.writeText("npx create-spine@latest").catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-zinc-500 tracking-widest uppercase">Getting started</p>
          <span className="text-xs font-mono text-zinc-500">{doneCount}/{items.length}</span>
        </div>
        <h3 className="text-base font-bold tracking-tight mb-5">Quick start</h3>

        <div className="flex flex-col gap-3.5 mb-5">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              {item.done ? (
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-zinc-700 mt-0.5 shrink-0" />
              )}
              <span className={cx("text-sm", item.done ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-300")}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
          <span className="text-emerald-400 font-mono text-xs">$</span>
          <span className="text-zinc-400 font-mono text-xs flex-1 truncate">npx create-spine@latest</span>
          <button onClick={copy} className="text-zinc-500 hover:text-zinc-200 transition-colors shrink-0" title="Copy command" aria-label="Copy command">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [period, setPeriod] = useState("14")

  const chartData = useMemo(() => USAGE_DATA.slice(-Number(period)), [period])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  const dateLabel = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    []
  )

  return (
    <div className="bg-black min-h-screen text-zinc-50 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div
            className="absolute -top-10 left-0 pointer-events-none -z-10"
            style={{ width: 420, height: 220, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
          />
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{greeting}, Alex</h2>
            <p className="text-sm text-zinc-500 mt-1">{dateLabel}</p>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Generate new scaffold
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard icon={Zap} label="Generations today" value={STATS.generationsToday} tag={`of ${STATS.dailyLimit} daily`} tone="neutral" />
          <StatCard icon={Package} label="Scaffolds generated" value={STATS.scaffoldsTotal} tag={`+${STATS.scaffoldsDelta} this week`} />
          <StatCard icon={FileCode} label="Files generated" value={STATS.filesTotal} tag={`+${STATS.filesDelta} this week`} />
          <StatCard icon={FolderOpen} label="Active projects" value={STATS.activeProjects} tag={`${STATS.stacksInUse} stacks`} tone="neutral" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
          <div className="xl:col-span-2">
            <UsageCard period={period} setPeriod={setPeriod} data={chartData} />
          </div>
          <div className="xl:col-span-1">
            <PlanCard used={STATS.generationsToday} limit={STATS.dailyLimit} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <div className="xl:col-span-2">
            <ProjectsTable projects={RECENT_PROJECTS} />
          </div>
          <div className="xl:col-span-1">
            <QuickStartCard items={QUICKSTART} />
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 mb-2">SPINEKIT © {new Date().getFullYear()}</p>
      </main>
    </div>
  )
}