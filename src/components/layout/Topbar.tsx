import { Search, Bell, Wifi, Users, MapPin, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { CURRENT_USER } from "@/lib/mock-data";

export function Topbar({
  onOpenSidebar, onOpenNotifications,
}: { onOpenSidebar: () => void; onOpenNotifications: () => void }) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar} aria-label="Open menu">
          <Menu className="size-5" />
        </Button>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground glass rounded-full px-3 py-1.5">
          <MapPin className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">Santiago Bernabéu</span>
          <span className="opacity-50">·</span>
          <span>Sector B12</span>
        </div>

        <div className="flex-1 max-w-lg mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search fans, products, alerts…"
            className="pl-9 h-10 rounded-full bg-secondary/60 border-transparent focus-visible:border-primary"
          />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 rounded-full bg-primary/10 border-primary/30 text-primary">
            <Wifi className="size-3" /> Mesh
          </Badge>
          <Badge variant="outline" className="gap-1.5 rounded-full">
            <Users className="size-3" /> 24 nearby
          </Badge>
        </div>

        <Button variant="ghost" size="icon" onClick={onOpenNotifications} className="relative">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full ring-2 ring-primary/40 hover:ring-primary transition">
              <Avatar className="size-9">
                <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-strong">
            <DropdownMenuLabel>
              <div className="font-semibold">{CURRENT_USER.name}</div>
              <div className="text-xs text-muted-foreground">{CURRENT_USER.username} · {CURRENT_USER.flag} {CURRENT_USER.country}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/wallet">Wallet</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
