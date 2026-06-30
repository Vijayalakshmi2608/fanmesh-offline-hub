import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { StadiumService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/crowd")({
  head: () => ({ meta: [{ title: "Crowd Summary â€” FanMesh AI" }] }),
  component: Crowd,
});

const COLORS = {
  low: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
} as const;

function Crowd() {
  const summariesQuery = useQuery({
    queryKey: ["stadium", "summaries"],
    queryFn: () => StadiumService.getCrowdSummaries(),
    staleTime: 60_000,
  });

  if (summariesQuery.isLoading) return <CrowdSkeleton />;
  if (summariesQuery.isError) return <CrowdError />;

  const summaries = summariesQuery.data ?? [];

  return (
    <div>
      <PageHeader
        icon={<Icons.Sparkles className="size-5" />}
        title="Crowd Summary"
        subtitle="AI-summarized intel broadcast across the local mesh"
      />
      {!summaries.length ? (
        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">No crowd summaries available.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary, index) => {
            const Icon = (Icons as any)[summary.icon] ?? Icons.Info;
            return (
              <motion.div key={summary.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ y: -3 }}>
                <Card className="glass rounded-2xl p-5 border-0 h-full relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="size-11 rounded-xl gradient-primary text-primary-foreground grid place-items-center shadow-glow">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className={COLORS[summary.priority]}>{summary.priority}</Badge>
                  </div>
                  <div className="mt-4 font-semibold">{summary.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{summary.detail}</div>
                  <div className="mt-4 text-xs text-muted-foreground">{summary.time} ago Â· via FanMesh AI</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CrowdSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-72 rounded-2xl" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function CrowdError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load crowd summaries.</div>;
}
