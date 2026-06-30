import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ALERTS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Siren, HeartPulse, Shield, Flame, CloudRain, Users, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency Alerts — FanMesh AI" }] }),
  component: Emergency,
});

const ICONS = { Medical: HeartPulse, Security: Shield, Fire: Flame, Weather: CloudRain, Crowd: Users };
const PRIO = {
  critical: "bg-destructive/20 text-destructive border-destructive/40",
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  low: "bg-primary/10 text-primary border-primary/30",
} as const;

function Emergency() {
  return (
    <div>
      <PageHeader icon={<Siren className="size-5" />} title="Emergency Alerts" subtitle="Local mesh broadcasts from stadium operations" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 mb-6 bg-destructive/20 border border-destructive/40 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-destructive grid place-items-center text-destructive-foreground shadow-glow shrink-0 animate-pulse">
            <AlertTriangle className="size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-destructive font-semibold">Critical · live</div>
            <div className="font-bold text-lg">Heat advisory — hydrate at stations A9, C2, D4</div>
            <div className="text-sm text-muted-foreground">Broadcast via FanMesh local relay · 12s ago</div>
          </div>
          <Button variant="destructive" className="rounded-full">Acknowledge</Button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALERTS.map((a, i) => {
          const Icon = ICONS[a.category];
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -3 }}>
              <Card className="glass rounded-2xl p-5 border-0 h-full">
                <div className="flex items-start justify-between">
                  <div className={cn("size-11 rounded-xl grid place-items-center", PRIO[a.priority])}>
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className={PRIO[a.priority]}>{a.priority}</Badge>
                </div>
                <div className="mt-4 font-semibold">{a.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{a.message}</div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{a.location} · {a.time}</span>
                  <Button size="sm" variant="ghost" className="text-primary">Details</Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
