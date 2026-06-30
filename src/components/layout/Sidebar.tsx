import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, MessageCircle, Languages, Sparkles, MapPin,
  ShoppingBag, Wallet, Siren, Map, Bell, Settings, Radio
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/nearby", label: "Nearby Fans", icon: Users },
  { to: "/chat", label: "Offline Chat", icon: MessageCircle },
  { to: "/translate", label: "AI Translation", icon: Languages },
  { to: "/crowd", label: "Crowd Summary", icon: Sparkles },
  { to: "/lost-friend", label: "Lost Friend", icon: MapPin },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/emergency", label: "Emergency Alerts", icon: Siren },
  { to: "/map", label: "Stadium Map", icon: Map },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="h-full w-72 shrink-0 glass-strong border-r border-sidebar-border flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="size-10 rounded-2xl gradient-primary grid place-items-center shadow-glow">
          <Radio className="size-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold tracking-tight text-lg leading-none">FanMesh <span className="text-gradient">AI</span></div>
          <div className="text-[11px] text-muted-foreground mt-1">The Offline Football Super App</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-6">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl gradient-primary opacity-90 shadow-glow"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon className={cn("size-[18px] relative", active && "text-primary-foreground")} />
                  <span className={cn("relative font-medium", active && "text-primary-foreground")}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-2xl p-4 glass">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          Mesh online · 24 peers
        </div>
        <div className="mt-2 text-sm font-semibold">QVAC channel active</div>
        <div className="text-[11px] text-muted-foreground">End-to-end encrypted local relay</div>
      </div>
    </aside>
  );
}
