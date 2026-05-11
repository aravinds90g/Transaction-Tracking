"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Wallet, Check } from "lucide-react";

const CATEGORIES = [
  { name: "Food",          emoji: "🍜", color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  { name: "Transport",     emoji: "🚗", color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  { name: "Shopping",      emoji: "🛍️", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { name: "Bills",         emoji: "⚡", color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  { name: "Entertainment", emoji: "🎬", color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { name: "Others",        emoji: "📦", color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
];

const EMPTY = CATEGORIES.reduce((a, c) => ({ ...a, [c.name]: "" }), {});

export default function BudgetModal() {
  const [open,    setOpen]    = useState(false);
  const [budgets, setBudgets] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    axios.get("/api/budgets")
      .then((r) => setBudgets({ ...EMPTY, ...r.data?.budgets }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  const handleSave = async (e) => {
    e.preventDefault();
    const filledBudgets = {};
    CATEGORIES.forEach(({ name }) => {
      if (budgets[name]) filledBudgets[name] = parseFloat(budgets[name]);
    });
    await axios.post("/api/budgets", { budgets: filledBudgets });
    setSaved(true);
    setTimeout(() => { setSaved(false); setOpen(false); }, 900);
  };

  const fieldBase =
    "w-28 bg-white/[0.05] border border-white/[0.09] rounded-xl px-3 py-2 text-sm text-white/80 font-number focus:outline-none focus:border-accent-cyan/40 focus:bg-white/[0.08] transition-all text-right placeholder-white/20";

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#08080b] transition-opacity"
        style={{
          background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
          boxShadow: "0 4px 20px rgba(34,211,238,0.20)",
        }}
      >
        <Wallet size={15} />
        Set Budget
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm border border-white/[0.07] bg-[#0d0d11]/98 backdrop-blur-2xl text-white rounded-3xl p-0 overflow-hidden shadow-2xl">
          {/* Header strip */}
          <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                  <Wallet size={15} className="text-accent-cyan" />
                </div>
                Monthly Budgets
              </DialogTitle>
              <p className="text-xs text-white/35 mt-1">
                Set spending limits per category
              </p>
            </DialogHeader>
          </div>

          {loading ? (
            <div className="px-6 py-8 space-y-3">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="skeleton-shimmer h-12 rounded-xl" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="px-6 py-5 space-y-2.5">
              <AnimatePresence>
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] hover:border-white/[0.10] hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                        style={{ background: cat.bg }}
                      >
                        {cat.emoji}
                      </div>
                      <span className="text-sm font-medium" style={{ color: cat.color }}>
                        {cat.name}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={budgets[cat.name]}
                        onChange={(e) => setBudgets({ ...budgets, [cat.name]: e.target.value })}
                        className={`${fieldBase} pl-6`}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-sm text-[#08080b] flex items-center justify-center gap-2 transition-opacity"
                style={{
                  background: saved
                    ? "linear-gradient(135deg, #34d399 0%, #10b981 100%)"
                    : "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
                  boxShadow: saved
                    ? "0 4px 20px rgba(52,211,153,0.25)"
                    : "0 4px 20px rgba(34,211,238,0.25)",
                }}
              >
                {saved ? (
                  <><Check size={15} /> Saved!</>
                ) : (
                  "Save Budgets"
                )}
              </motion.button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}