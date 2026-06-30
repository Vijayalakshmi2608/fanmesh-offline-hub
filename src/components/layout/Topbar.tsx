import { Search, Bell, Wifi, Users, MapPin, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardService, UserService } from "@/services";

export function Topbar({
  onOpenSidebar,
  onOpenNotifications,
}: {
  onOpenSidebar: () => void;
  onOpenNotifications: () => void;
}) {
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: () => UserService.getCurrentUser(),
    staleTime: 60_000,
  });
  const dashboardQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => DashboardService.getDashboardStats(),
    staleTime: 60_000,
  });

  const currentUser = userQuery.data;
  const dashboard = dashboardQuery.data;

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar} aria-label="Open menu">
          <Menu className="size-5" />
        </Button>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground glass rounded-full px-3 py-1.5">
          <MapPin className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">
            {dashboard?.currentStadium.name ?? "Loading stadium"}
          </span>
          <span className="opacity-50">Â·</span>
          <span>Sector B12</span>
        </div>

        <div className="flex-1 max-w-lg mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search fans, products, alertsâ€¦"
            className="pl-9 h-10 rounded-full bg-secondary/60 border-transparent focus-visible:border-primary"
          />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 rounded-full bg-primary/10 border-primary/30 text-primary">
            <Wifi className="size-3" /> Mesh
          </Badge>
          <Badge variant="outline" className="gap-1.5 rounded-full">
            <Users className="size-3" /> {dashboard?.nearbyFans.length ?? 0} nearby
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
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-strong">
            <DropdownMenuLabel>
              <div className="font-semibold">{currentUser?.name ?? "Loading..."}</div>
              <div className="text-xs text-muted-foreground">
                {currentUser ? `${currentUser.username} Â· ${currentUser.flag} ${currentUser.country}` : "Fetching profile"}
              </div>
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
