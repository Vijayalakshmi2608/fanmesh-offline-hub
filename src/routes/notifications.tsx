import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Bell, ShoppingBag, MessageCircle, Siren, Wallet, Users } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications â€” FanMesh AI" }] }),
  component: NotificationsPage,
});

const ICONS = { Marketplace: ShoppingBag, Chat: MessageCircle, Emergency: Siren, Wallet, Nearby: Users } as const;

function NotificationsPage() {
  const notificationsQuery = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => NotificationService.getNotifications(),
    staleTime: 60_000,
  });

  if (notificationsQuery.isLoading) return <NotificationsSkeleton />;
  if (notificationsQuery.isError) return <NotificationsError />;

  const notifications = notificationsQuery.data ?? [];
  const groups = ["Emergency", "Chat", "Marketplace", "Wallet", "Nearby"] as const;

  return (
    <div>
      <PageHeader icon={<Bell className="size-5" />} title="Notifications" subtitle="Grouped activity across your local mesh" />
      <div className="space-y-6">
        {groups.map((group) => {
          const items = notifications.filter((notification) => notification.group === group);
          if (!items.length) return null;
          const Icon = ICONS[group];
          return (
            <div key={group}>
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                <Icon className="size-3.5" /> {group}
              </div>
              <div className="space-y-2">
                {items.map((notification, i) => (
                  <motion.div key={notification.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="glass rounded-2xl p-4 border-0 flex items-center gap-3">
                      <div className="size-10 rounded-xl gradient-primary text-primary-foreground grid place-items-center shadow-glow"><Icon className="size-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">{notification.body}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{notification.time}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-72 rounded-2xl" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function NotificationsError() {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Unable to load notifications.</div>;
}
