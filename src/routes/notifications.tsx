import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { useNotificationStore } from "@/stores";
import { Card } from "@/components/ui/card";
import { Bell, ShoppingBag, MessageCircle, Siren, Wallet, Users } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — FanMesh AI" }] }),
  component: NotificationsPage,
});

const ICONS = { Marketplace: ShoppingBag, Chat: MessageCircle, Emergency: Siren, Wallet, Nearby: Users } as const;

function NotificationsPage() {
  const notifications = useNotificationStore((state) => state.notifications);
  const getGroupedNotifications = useNotificationStore((state) => state.getGroupedNotifications);
  const groups = ["Emergency", "Chat", "Marketplace", "Wallet", "Nearby"] as const;
  const grouped = getGroupedNotifications();
  
  return (
    <div>
      <PageHeader icon={<Bell className="size-5" />} title="Notifications" subtitle="Grouped activity across your local mesh" />
      <div className="space-y-6">
        {groups.map((g) => {
          const items = grouped[g] || [];
          if (!items.length) return null;
          const Icon = ICONS[g];
          return (
            <div key={g}>
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                <Icon className="size-3.5" /> {g}
              </div>
              <div className="space-y-2">
                {items.map((n, i) => (
                  <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="glass rounded-2xl p-4 border-0 flex items-center gap-3">
                      <div className="size-10 rounded-xl gradient-primary text-primary-foreground grid place-items-center shadow-glow"><Icon className="size-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{n.title}</div>
                        <div className="text-sm text-muted-foreground">{n.body}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{n.time}</div>
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
