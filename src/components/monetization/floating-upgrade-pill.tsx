"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { UpgradeModal } from "./upgrade-modal";

export function FloatingUpgradePill() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pillVisible, setPillVisible] = useState(true);

  return (
    <>
      <AnimatePresence>
        {pillVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 1.5, type: "spring", bounce: 0.4 }}
            onClick={() => setModalOpen(true)}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 lg:hidden flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
          >
            <Zap className="h-3.5 w-3.5" />
            Upgrade to Pro — RM 9/mo
          </motion.button>
        )}
      </AnimatePresence>

      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        trigger="general"
      />
    </>
  );
}
