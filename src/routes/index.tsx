import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, StatCard, SectionTitle } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  MessageCircle,
  Siren,
  Wallet,
  ShoppingBag,
  Sparkles,
  Radio,
  Languages,
  Trophy,
  ArrowUpRight,
  Activity,
  Zap,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar } from "recharts";
import { DashboardService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard â€” FanMesh AI" }] }),
  component: Dashboard,
});

const QUICK = [
  { to: "/nearby", icon: Radio, label: "Connect Nearby" },
  { to: "/chat", icon: MessageCircle, label: "Open Chat" },
  { to: "/translate", icon: Languages, label: "Translate" },
  { to: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/emergency", icon: Siren, label: "Emergency" },
] as const;

const METRIC_ICONS = {
  Users,
  MessageCircle,
  Siren,
  Wallet,
  ShoppingBag,
  Sparkles,
} as const;

function Countdown({ ms }: { ms: number }) {
  const [left, setLeft] = useState(ms);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => Math.max(0, v - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return (
    <div className="flex gap-2 font-mono">
      {[["HRS", h], ["MIN", m], ["SEC", s]].map(([l, v]) => (
        <div key={l as string} className="glass rounded-xl px-3 py-2 text-center min-w-[64px]">
          <div className="text-2xl font-bold tabular-nums">{String(v).padStart(2, "0")}</div>
          <div className="text-[10px] text-muted-foreground tracking-widest">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => DashboardService.getDashboardStats(),
    staleTime: 60_000,
  });

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError) {
    return <DashboardError />;
  }

  const dashboard = dashboardQuery.data;
  if (!dashboard) {
    return <DashboardEmpty />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-6 md:p-10 shadow-elegant"
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="rounded-full bg-primary/20 text-primary border-primary/30">
              Live Mesh Â· {dashboard.currentUser.flag} {dashboard.currentUser.country}
            </Badge>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-gradient">{dashboard.currentUser.name.split(" ")[0]}</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md">
              You're connected to {dashboard.nearbyFans.length} nearby fans via the local FanMesh relay. No internet required.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild className="rounded-full gradient-primary text-primary-foreground shadow-glow">
                <Link to="/nearby">
                  <Radio className="size-4 mr-1.5" /> Connect Nearby
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/map">View Stadium Map</Link>
              </Button>
            </div>
          </div>

          <Card className="glass-strong rounded-3xl p-5 border-0">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
              <span>Today's Match Â· {dashboard.todaysMatch.stadium}</span>
              <span className="text-primary">{dashboard.todaysMatch.kickoff}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <Team logo={dashboard.todaysMatch.home.logo} name={dashboard.todaysMatch.home.name} />
              <div className="text-xl font-bold text-muted-foreground">VS</div>
              <Team logo={dashboard.todaysMatch.away.logo} name={dashboard.todaysMatch.away.name} reverse />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> Kickoff in
              </div>
              <Countdown ms={dashboard.todaysMatch.countdownMs} />
            </div>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {dashboard.metrics.map((metric, index) => {
          const MetricIcon = METRIC_ICONS[metric.icon as keyof typeof METRIC_ICONS] ?? Users;

          return (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              hint={metric.hint}
              icon={<MetricIcon className="size-5" />}
              accent={metric.accent}
              delay={0.02 * (index + 1)}
            />
          );
        })}
      </div>

      <div>
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK.map((q, i) => (
            <motion.div key={q.to} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={q.to} className="block">
                <Card className="glass hover:shadow-glow transition-all hover:-translate-y-0.5 rounded-2xl p-4 border-0 group">
                  <div className="size-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground shadow-glow mb-3">
                    <q.icon className="size-5" />
                  </div>
                  <div className="font-medium text-sm">{q.label}</div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary mt-2" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 glass rounded-2xl p-5 border-0">
          <SectionTitle action={<Badge variant="outline" className="gap-1"><Activity className="size-3" /> Live</Badge>}>Mesh Activity</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dashboard.meshActivity}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.16 165)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.68 0.16 165)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="oklch(0.7 0.02 160)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.02 160)", border: "1px solid oklch(0.3 0.02 160)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="fans" stroke="oklch(0.72 0.18 150)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="msgs" stroke="oklch(0.68 0.16 165)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass rounded-2xl p-5 border-0">
          <SectionTitle>Top Nationalities</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dashboard.topNationalities.map((item) => ({ n: item.code, v: item.value }))}>
              <XAxis dataKey="n" stroke="oklch(0.7 0.02 160)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.02 160)", border: "1px solid oklch(0.3 0.02 160)", borderRadius: 12 }} />
              <Bar dataKey="v" fill="oklch(0.72 0.18 150)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="glass rounded-2xl p-5 border-0">
          <SectionTitle action={<Link to="/nearby" className="text-xs text-primary">View all</Link>}>Nearby Fans</SectionTitle>
          <div className="space-y-2">
            {dashboard.nearbyFans.slice(0, 5).map((fan) => (
              <div key={fan.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/40 transition">
                <Avatar className="size-10">
                  <AvatarImage src={fan.avatar} />
                  <AvatarFallback>{fan.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {fan.flag} {fan.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {fan.team} Â· {fan.distance}m
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass rounded-2xl p-5 border-0">
          <SectionTitle action={<Link to="/notifications" className="text-xs text-primary">View all</Link>}>Recent Activity</SectionTitle>
          <div className="space-y-2">
            {dashboard.notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-2 rounded-xl">
                <div className="size-9 rounded-xl glass grid place-items-center">
                  <Zap className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.body}</div>
                </div>
                <span className="text-[10px] text-muted-foreground">{notification.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="glass rounded-2xl p-5 border-0">
        <SectionTitle>Wallet Â· Recent Transactions</SectionTitle>
        <div className="divide-y divide-border">
          {dashboard.transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-xl grid place-items-center ${transaction.type === "in" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
                  <Trophy className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{transaction.party}</div>
                  <div className="text-xs text-muted-foreground">{transaction.note} Â· {transaction.time}</div>
                </div>
              </div>
              <div className={`font-semibold ${transaction.type === "in" ? "text-primary" : "text-destructive"}`}>
                {transaction.type === "in" ? "+" : "-"}${transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl glass-strong p-6 md:p-10 space-y-6">
        <Skeleton className="h-6 w-40 rounded-full" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-14 w-72 rounded-2xl" />
            <Skeleton className="h-5 w-96 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

function DashboardError() {
  return (
    <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
      Failed to load dashboard data.
    </div>
  );
}

function DashboardEmpty() {
  return (
    <div className="rounded-3xl border border-border bg-background/60 p-6 text-sm text-muted-foreground">
      No dashboard data available.
    </div>
  );
}

function Team({ logo, name, reverse }: { logo: string; name: string; reverse?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${reverse ? "flex-row-reverse text-right" : ""}`}>
      <div className="size-14 rounded-2xl gradient-primary grid place-items-center font-extrabold text-primary-foreground shadow-glow">{logo}</div>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-xs text-muted-foreground">Home XI ready</div>
      </div>
    </div>
  );
}
