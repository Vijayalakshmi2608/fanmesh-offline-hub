import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { FANS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Radio, Share2, Search } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/lost-friend")({
  head: () => ({ meta: [{ title: "Lost Friend — FanMesh AI" }] }),
  component: Lost,
});

function Lost() {
  const friends = FANS.slice(0, 6);
  return (
    <div>
      <PageHeader icon={<Search className="size-5" />} title="Lost Friend Finder" subtitle="Ping your group through the mesh and triangulate via nearby peers" />
      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <Card className="glass rounded-3xl border-0 relative overflow-hidden h-[520px]">
          <div className="absolute inset-0 gradient-hero opacity-60" />
          <div className="absolute inset-0"
               style={{ backgroundImage: "linear-gradient(oklch(0.72 0.18 150 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 150 / 0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {[1, 2, 3, 4].map((r) => (
            <motion.div
              key={r}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, delay: r * 0.6 }}
              className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
            />
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full gradient-primary grid place-items-center shadow-glow text-primary-foreground z-10">
            <Radio className="size-7" />
          </div>

          {friends.slice(0, 5).map((f, i) => {
            const angle = (i / 5) * Math.PI * 2;
            const r = 120 + (i % 2) * 60;
            return (
              <div key={f.id} className="absolute z-10" style={{ left: `calc(50% + ${Math.cos(angle) * r}px)`, top: `calc(50% + ${Math.sin(angle) * r}px)`, transform: "translate(-50%,-50%)" }}>
                <Avatar className="size-10 ring-2 ring-primary shadow-glow"><AvatarImage src={f.avatar} /><AvatarFallback>{f.name[0]}</AvatarFallback></Avatar>
              </div>
            );
          })}
        </Card>

        <div className="space-y-3">
          <Button className="w-full rounded-full gradient-primary text-primary-foreground"><Share2 className="size-4 mr-1.5" /> Share my location</Button>
          {friends.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="glass rounded-2xl p-4 border-0 flex items-center gap-3">
                <Avatar className="size-11"><AvatarImage src={f.avatar} /><AvatarFallback>{f.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{f.flag} {f.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3" />{f.distance}m · last seen 2m</div>
                </div>
                <Button size="sm" className="rounded-full gradient-primary text-primary-foreground">Ping</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
