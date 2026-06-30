import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { useNearbyFansStore } from "@/stores";
import { Users, Radio, Signal, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { UserService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/nearby")({
  head: () => ({ meta: [{ title: "Nearby Fans â€” FanMesh AI" }] }),
  component: Nearby,
});

function Nearby() {
  const [q, setQ] = useState("");
  const nearbyQuery = useQuery({
    queryKey: ["nearby-fans"],
    queryFn: () => UserService.getNearbyFans(),
    staleTime: 60_000,
  });
  const nearbyUsers = useNearbyFansStore((state) => state.nearbyUsers);

  if (nearbyQuery.isLoading) return <NearbySkeleton />;
  if (nearbyQuery.isError) return <NearbyError />;

  const users = nearbyQuery.data ?? nearbyUsers;
  const filtered = users.filter((fan) =>
    !q ||
    fan.name.toLowerCase().includes(q.toLowerCase()) ||
    fan.country.toLowerCase().includes(q.toLowerCase()) ||
    fan.team.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        icon={<Users className="size-5" />}
        title="Nearby Fans"
        subtitle={`${users.length} fans connected on the local mesh`}
        actions={
          <>
            <div className="relative">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, country, team" className="w-64 pl-3 rounded-full" />
            </div>
            <Button className="rounded-full gradient-primary text-primary-foreground"><Radio className="size-4 mr-1.5" /> Scan</Button>
          </>
        }
      />

      {!filtered.length ? (
        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">No fans match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((fan, i) => (
            <motion.div key={fan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.4) }} whileHover={{ y: -3 }}>
              <Card className="glass rounded-2xl p-5 border-0 relative overflow-hidden h-full">
                <div className="absolute -top-12 -right-12 size-32 rounded-full bg-primary/15 blur-2xl" />
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="size-14 ring-2 ring-primary/40">
                      <AvatarImage src={fan.avatar} />
                      <AvatarFallback>{fan.name[0]}</AvatarFallback>
                    </Avatar>
                    {fan.online && <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-primary ring-2 ring-background" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate flex items-center gap-1.5">
                      <span className="text-lg">{fan.flag}</span> {fan.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{fan.username}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="glass rounded-lg p-2"><MapPin className="size-3 inline mr-1 text-primary" />{fan.distance}m</div>
                  <div className="glass rounded-lg p-2"><Signal className="size-3 inline mr-1 text-primary" />{fan.signal}%</div>
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className="rounded-full">{fan.team}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {fan.languages.map((language) => (
                    <span key={language} className="text-[10px] uppercase tracking-wider bg-secondary/60 px-2 py-0.5 rounded-full">{language}</span>
                  ))}
                </div>
                <Button className="w-full mt-4 rounded-full gradient-primary text-primary-foreground">Connect</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function NearbySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-72 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function NearbyError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load nearby fans.</div>;
}
