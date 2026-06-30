import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingBag, MessageCircle, Siren, Wallet, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services";

const ICONS = {
  Marketplace: ShoppingBag,
  Chat: MessageCircle,
  Emergency: Siren,
  Wallet,
  Nearby: Users,
} as const;

export function NotificationDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getNotifications(),
    staleTime: 60_000,
  });

  const groups = ["Emergency", "Chat", "Marketplace", "Wallet", "Nearby"] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md glass-strong border-l">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6 overflow-y-auto pr-2 scrollbar-thin h-[calc(100vh-100px)]">
          {notificationsQuery.isLoading && (
            <div className="space-y-3">
              <div className="h-5 w-32 rounded-md bg-primary/10 animate-pulse" />
              <div className="h-20 rounded-xl bg-primary/10 animate-pulse" />
              <div className="h-20 rounded-xl bg-primary/10 animate-pulse" />
            </div>
          )}
          {notificationsQuery.isError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load notifications.
            </div>
          )}
          {notificationsQuery.isSuccess &&
            groups.map((g) => {
              const items = notificationsQuery.data.filter((n) => n.group === g);
              if (!items.length) return null;
              const Icon = ICONS[g];
              return (
                <div key={g}>
                  <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Icon className="size-3.5" /> {g}
                  </div>
                  <div className="space-y-2">
                    {items.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="glass rounded-xl p-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">{n.title}</div>
                          <span className="text-[10px] text-muted-foreground">{n.time}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{n.body}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
