import { Radio, MessageCircle, Languages, Siren } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";

const ITEMS = [
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/translate", icon: Languages, label: "Translate" },
  { to: "/emergency", icon: Siren, label: "Emergency" },
] as const;

export function FAB() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && ITEMS.map((it, i) => (
          <motion.div
            key={it.to}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04 } }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
          >
            <Link
              to={it.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 glass-strong shadow-elegant rounded-full pl-4 pr-3 py-2.5 text-sm"
            >
              <span>{it.label}</span>
              <span className="size-8 rounded-full grid place-items-center gradient-primary">
                <it.icon className="size-4 text-primary-foreground" />
              </span>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen((v) => !v)}
        className="size-14 rounded-full gradient-primary shadow-glow grid place-items-center text-primary-foreground"
        aria-label="Quick actions"
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }}>
          <Radio className="size-6" />
        </motion.span>
      </motion.button>
    </div>
  );
}
