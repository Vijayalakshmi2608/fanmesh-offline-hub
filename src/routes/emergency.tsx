import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Siren, HeartPulse, Shield, Flame, CloudRain, Users, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmergencyService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency Alerts â€” FanMesh AI" }] }),
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
  const alertsQuery = useQuery({
    queryKey: ["emergency", "alerts"],
    queryFn: () => EmergencyService.getAlerts(),
    staleTime: 60_000,
  });

  if (alertsQuery.isLoading) return <EmergencySkeleton />;
  if (alertsQuery.isError) return <EmergencyError />;

  const activeAlerts = alertsQuery.data ?? [];

  return (
    <div>
      <PageHeader icon={<Siren className="size-5" />} title="Emergency Alerts" subtitle="Local mesh broadcasts from stadium operations" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-5 mb-6 bg-destructive/20 border border-destructive/40 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-destructive grid place-items-center text-destructive-foreground shadow-glow shrink-0 animate-pulse">
            <AlertTriangle className="size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-destructive font-semibold">Critical Â· live</div>
            <div className="font-bold text-lg">Heat advisory â€” hydrate at stations A9, C2, D4</div>
            <div className="text-sm text-muted-foreground">Broadcast via FanMesh local relay Â· 12s ago</div>
          </div>
          <Button variant="destructive" className="rounded-full">Acknowledge</Button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeAlerts.map((alert, i) => {
          const Icon = ICONS[alert.category];
          return (
            <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -3 }}>
              <Card className="glass rounded-2xl p-5 border-0 h-full">
                <div className="flex items-start justify-between">
                  <div className={cn("size-11 rounded-xl grid place-items-center", PRIO[alert.priority])}>
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className={PRIO[alert.priority]}>{alert.priority}</Badge>
                </div>
                <div className="mt-4 font-semibold">{alert.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{alert.message}</div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{alert.location} Â· {alert.time}</span>
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

function EmergencySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 rounded-3xl" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function EmergencyError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load emergency alerts.</div>;
}
