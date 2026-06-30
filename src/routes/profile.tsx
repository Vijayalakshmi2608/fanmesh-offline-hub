import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { useUserStore, useWalletStore } from "@/stores";
import { CURRENT_USER } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Trophy, Globe, Wallet, Languages, Palette } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — FanMesh AI" }] }),
  component: Profile,
});

function Profile() {
  const profile = useUserStore((state) => state.profile);
  const balance = useWalletStore((state) => state.balance);
  
  return (
    <div>
      <PageHeader icon={<User className="size-5" />} title="Profile" subtitle="Your FanMesh fan identity" />

      <Card className="glass-strong rounded-3xl p-6 border-0 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <Avatar className="size-28 ring-4 ring-primary/40">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <div className="text-2xl font-bold">{profile.name}</div>
            <div className="text-muted-foreground">{profile.username}</div>
            <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline" className="rounded-full"><Globe className="size-3 mr-1" />{profile.flag} {profile.country}</Badge>
              <Badge variant="outline" className="rounded-full"><Trophy className="size-3 mr-1" />{profile.team}</Badge>
              <Badge variant="outline" className="rounded-full"><Languages className="size-3 mr-1" />{profile.language}</Badge>
            </div>
          </div>
          <Button className="rounded-full gradient-primary text-primary-foreground">Edit Profile</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Card className="glass rounded-2xl p-5 border-0">
          <div className="font-semibold mb-3 flex items-center gap-2"><Trophy className="size-4 text-warning" /> Achievements</div>
          <div className="grid grid-cols-2 gap-2">
            {CURRENT_USER.achievements.map((a) => (
              <div key={a} className="glass rounded-xl p-3 text-sm flex items-center gap-2">
                <span className="size-8 rounded-lg gradient-primary text-primary-foreground grid place-items-center text-xs font-bold">★</span>
                {a}
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass rounded-2xl p-5 border-0">
          <div className="font-semibold mb-3 flex items-center gap-2"><Wallet className="size-4 text-primary" /> Wallet Status</div>
          <div className="text-3xl font-bold text-gradient">${balance.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">WDK · secured locally</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Row icon={Languages} label="Language" value={profile.language} />
            <Row icon={Palette} label="Theme" value="Dark" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-xs text-muted-foreground flex items-center gap-1"><Icon className="size-3" /> {label}</div>
      <div className="text-sm font-medium mt-1">{value}</div>
    </div>
  );
}
