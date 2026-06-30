import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { SUMMARIES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/crowd")({
  head: () => ({ meta: [{ title: "Crowd Summary — FanMesh AI" }] }),
  component: Crowd,
});

const COLORS = { low: "bg-primary/15 text-primary border-primary/30",
                 medium: "bg-warning/15 text-warning border-warning/30",
                 high: "bg-destructive/15 text-destructive border-destructive/30" } as const;

function Crowd() {
  return (
    <div>
      <PageHeader
        icon={<Icons.Sparkles className="size-5" />}
        title="Crowd Summary"
        subtitle="AI-summarized intel broadcast across the local mesh"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUMMARIES.map((s, i) => {
          const Icon = (Icons as any)[s.icon] ?? Icons.Info;
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -3 }}>
              <Card className="glass rounded-2xl p-5 border-0 h-full relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="size-11 rounded-xl gradient-primary text-primary-foreground grid place-items-center shadow-glow">
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className={COLORS[s.priority]}>{s.priority}</Badge>
                </div>
                <div className="mt-4 font-semibold">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.detail}</div>
                <div className="mt-4 text-xs text-muted-foreground">{s.time} ago · via FanMesh AI</div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
