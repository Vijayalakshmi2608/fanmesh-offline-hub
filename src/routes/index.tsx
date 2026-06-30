import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard, SectionTitle } from "@/components/common/PageHeader";
import { useUserStore, useNearbyFansStore, useNotificationStore, useWalletStore } from "@/stores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users, MessageCircle, Siren, Wallet, ShoppingBag, Sparkles,
  Radio, Languages, Trophy, ArrowUpRight, Activity, Zap, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { TODAY_MATCH, NOTIFICATIONS, TRANSACTIONS } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — FanMesh AI" }] }),
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

const chartData = Array.from({ length: 12 }, (_, i) => ({
  name: `${i + 9}:00`,
  fans: 80 + Math.round(Math.sin(i / 2) * 30 + Math.random() * 25),
  msgs: 40 + Math.round(Math.cos(i / 3) * 25 + Math.random() * 30),
}));

function Countdown({ ms }: { ms: number }) {
  const [left, setLeft] = useState(ms);
  useEffect(() => { const t = setInterval(() => setLeft((v) => Math.max(0, v - 1000)), 1000); return () => clearInterval(t); }, []);
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
  const profile = useUserStore((state) => state.profile);
  const nearbyUsers = useNearbyFansStore((state) => state.nearbyUsers);
  const notifications = useNotificationStore((state) => state.notifications);
  const balance = useWalletStore((state) => state.balance);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-6 md:p-10 shadow-elegant"
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="rounded-full bg-primary/20 text-primary border-primary/30">Live Mesh · {profile.flag} {profile.country}</Badge>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-gradient">{profile.name.split(" ")[0]}</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md">
              You're connected to {nearbyUsers.length} nearby fans via the local FanMesh relay. No internet required.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild className="rounded-full gradient-primary text-primary-foreground shadow-glow">
                <Link to="/nearby"><Radio className="size-4 mr-1.5" /> Connect Nearby</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/map">View Stadium Map</Link>
              </Button>
            </div>
          </div>

          <Card className="glass-strong rounded-3xl p-5 border-0">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
              <span>Today's Match · {TODAY_MATCH.stadium}</span>
              <span className="text-primary">{TODAY_MATCH.kickoff}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <Team logo={TODAY_MATCH.home.logo} name={TODAY_MATCH.home.name} />
              <div className="text-xl font-bold text-muted-foreground">VS</div>
              <Team logo={TODAY_MATCH.away.logo} name={TODAY_MATCH.away.name} reverse />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> Kickoff in</div>
              <Countdown ms={TODAY_MATCH.countdownMs} />
            </div>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Nearby Fans" value={nearbyUsers.length.toString()} hint="+5 since arrival" icon={<Users className="size-5" />} delay={0.02} />
        <StatCard label="Messages" value="142" hint="12 unread" icon={<MessageCircle className="size-5" />} delay={0.04} />
        <StatCard label="Alerts" value="3" hint="1 high priority" icon={<Siren className="size-5" />} accent="bg-destructive" delay={0.06} />
        <StatCard label="Wallet" value={`$${balance.toFixed(0)}`} hint="+$48 today" icon={<Wallet className="size-5" />} delay={0.08} />
        <StatCard label="Listings" value="6" hint="2 active offers" icon={<ShoppingBag className="size-5" />} delay={0.10} />
        <StatCard label="AI Insights" value="25" hint="updated 2m ago" icon={<Sparkles className="size-5" />} delay={0.12} />
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
            <AreaChart data={chartData}>
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
            <BarChart data={[
              { n: "BR", v: 22 }, { n: "ES", v: 19 }, { n: "AR", v: 15 },
              { n: "DE", v: 12 }, { n: "FR", v: 9 }, { n: "JP", v: 7 },
            ]}>
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
            {nearbyUsers.slice(0, 5).map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/40 transition">
                <Avatar className="size-10"><AvatarImage src={f.avatar} /><AvatarFallback>{f.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{f.flag} {f.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{f.team} · {f.distance}m</div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full">Connect</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass rounded-2xl p-5 border-0">
          <SectionTitle action={<Link to="/notifications" className="text-xs text-primary">View all</Link>}>Recent Activity</SectionTitle>
          <div className="space-y-2">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-2 rounded-xl">
                <div className="size-9 rounded-xl glass grid place-items-center"><Zap className="size-4 text-primary" /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                </div>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="glass rounded-2xl p-5 border-0">
        <SectionTitle>Wallet · Recent Transactions</SectionTitle>
        <div className="divide-y divide-border">
          {TRANSACTIONS.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-xl grid place-items-center ${t.type === "in" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
                  <Trophy className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t.party}</div>
                  <div className="text-xs text-muted-foreground">{t.note} · {t.time}</div>
                </div>
              </div>
              <div className={`font-semibold ${t.type === "in" ? "text-primary" : "text-destructive"}`}>
                {t.type === "in" ? "+" : "-"}${t.amount}
              </div>
            </div>
          ))}
        </div>
      </Card>
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
