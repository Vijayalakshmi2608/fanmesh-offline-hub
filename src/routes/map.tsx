import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Map, DoorOpen, Utensils, ToiletIcon, HeartPulse, DoorClosed } from "lucide-react";
import { StadiumService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Stadium Map â€” FanMesh AI" }] }),
  component: StadiumMap,
});

const LEGEND = [
  { icon: DoorOpen, label: "Entrances", color: "text-primary" },
  { icon: Utensils, label: "Food", color: "text-warning" },
  { icon: ToiletIcon, label: "Restrooms", color: "text-accent" },
  { icon: HeartPulse, label: "Medical", color: "text-destructive" },
  { icon: DoorClosed, label: "Emergency Exits", color: "text-destructive" },
];

function densityColor(density: number) {
  if (density > 75) return "bg-destructive/60";
  if (density > 50) return "bg-warning/60";
  if (density > 25) return "bg-primary/50";
  return "bg-primary/20";
}

function StadiumMap() {
  const sectionsQuery = useQuery({
    queryKey: ["stadium", "sections"],
    queryFn: () => StadiumService.getSections(),
    staleTime: 60_000,
  });

  if (sectionsQuery.isLoading) return <MapSkeleton />;
  if (sectionsQuery.isError) return <MapError />;

  const stadiumSections = sectionsQuery.data ?? [];

  return (
    <div>
      <PageHeader icon={<Map className="size-5" />} title="Stadium Map" subtitle="Live crowd density Â· heatmap powered by mesh telemetry" />

      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <Card className="glass rounded-3xl p-6 border-0 relative overflow-hidden h-[560px]">
          <svg viewBox="0 0 600 400" className="absolute inset-0 size-full">
            <defs>
              <radialGradient id="pitch" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.5 0.18 150)" />
                <stop offset="100%" stopColor="oklch(0.3 0.12 150)" />
              </radialGradient>
            </defs>
            <ellipse cx="300" cy="200" rx="270" ry="170" fill="oklch(0.22 0.03 160)" />
            <ellipse cx="300" cy="200" rx="220" ry="130" fill="oklch(0.26 0.04 160)" />
            <rect x="180" y="120" width="240" height="160" rx="6" fill="url(#pitch)" stroke="oklch(0.95 0 0 / 0.6)" strokeWidth="2" />
            <line x1="300" y1="120" x2="300" y2="280" stroke="oklch(0.95 0 0 / 0.6)" strokeWidth="2" />
            <circle cx="300" cy="200" r="22" fill="none" stroke="oklch(0.95 0 0 / 0.6)" strokeWidth="2" />
            <rect x="180" y="160" width="30" height="80" fill="none" stroke="oklch(0.95 0 0 / 0.6)" strokeWidth="2" />
            <rect x="390" y="160" width="30" height="80" fill="none" stroke="oklch(0.95 0 0 / 0.6)" strokeWidth="2" />
          </svg>

          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 p-6 pointer-events-none">
            {stadiumSections.map((section, index) => {
              const skip = [7, 8, 13, 14, 15, 16].includes(index);
              if (skip) return <div key={section.id} />;
              return (
                <div key={section.id} className={`rounded-xl ${densityColor(section.density)} backdrop-blur-sm flex items-center justify-center text-[10px] font-semibold ring-1 ring-white/10`}>
                  {section.label} Â· {section.density}%
                </div>
              );
            })}
          </div>

          {[
            { top: "10%", left: "10%", Icon: DoorOpen, color: "bg-primary" },
            { top: "10%", right: "10%", Icon: DoorOpen, color: "bg-primary" },
            { bottom: "10%", left: "30%", Icon: Utensils, color: "bg-warning" },
            { bottom: "10%", right: "30%", Icon: ToiletIcon, color: "bg-accent" },
            { top: "50%", left: "2%", Icon: HeartPulse, color: "bg-destructive" },
            { bottom: "10%", right: "5%", Icon: DoorClosed, color: "bg-destructive" },
          ].map((marker, index) => (
            <div key={index} className={`absolute size-9 rounded-full ${marker.color} text-background grid place-items-center shadow-glow`} style={marker as any}>
              <marker.Icon className="size-4" />
            </div>
          ))}
        </Card>

        <Card className="glass rounded-2xl p-5 border-0">
          <div className="font-semibold mb-3">Legend</div>
          <ul className="space-y-2">
            {LEGEND.map((legend) => (
              <li key={legend.label} className="flex items-center gap-3 text-sm">
                <div className="size-8 rounded-lg glass grid place-items-center"><legend.icon className={`size-4 ${legend.color}`} /></div>
                {legend.label}
              </li>
            ))}
          </ul>
          <div className="mt-6 font-semibold mb-2">Density</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-primary/20" /> Low</div>
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-primary/50" /> Moderate</div>
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-warning/60" /> High</div>
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-destructive/60" /> Critical</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MapSkeleton() {
  return <Skeleton className="h-[640px] rounded-3xl" />;
}

function MapError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load stadium map.</div>;
}
