import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  title, subtitle, icon, actions,
}: { title: string; subtitle?: string; icon?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between mb-6">
      <div className="flex items-center gap-4 min-w-0">
        {icon && (
          <div className="size-12 rounded-2xl gradient-primary grid place-items-center shadow-glow shrink-0 text-primary-foreground">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label, value, hint, icon, accent, delay = 0,
}: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; accent?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5 shadow-elegant relative overflow-hidden group"
    >
      <div className={cn("absolute -top-10 -right-10 size-32 rounded-full opacity-30 blur-2xl", accent ?? "bg-primary")} />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {icon && <div className="size-10 rounded-xl glass grid place-items-center text-primary">{icon}</div>}
      </div>
    </motion.div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}
