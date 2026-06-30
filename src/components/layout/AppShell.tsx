import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NotificationDrawer } from "./NotificationDrawer";
import { FAB } from "./FAB";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r-0">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} onOpenNotifications={() => setNotifOpen(true)} />
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <NotificationDrawer open={notifOpen} onOpenChange={setNotifOpen} />
      <FAB />
    </div>
  );
}
