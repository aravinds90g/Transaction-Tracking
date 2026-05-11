"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  ChevronDown,
  Check,
} from "lucide-react";

const CATEGORIES = [
  { name: "Food",          emoji: "🍜", color: "#fb923c", cls: "cat-food" },
  { name: "Transport",     emoji: "🚗", color: "#60a5fa", cls: "cat-transport" },
  { name: "Shopping",      emoji: "🛍️", color: "#a78bfa", cls: "cat-shopping" },
  { name: "Bills",         emoji: "⚡", color: "#fbbf24", cls: "cat-bills" },
  { name: "Entertainment", emoji: "🎬", color: "#f472b6", cls: "cat-entertainment" },
  { name: "Others",        emoji: "📦", color: "#34d399", cls: "cat-others" },
];

const EMPTY = { amount: "", date: "", description: "", category: "" };

export default function AddTransactionForm({ onAdd }) {
  const [form, setForm]           = useState(EMPTY);
  const [catOpen, setCatOpen]     = useState(false);
  const [shake, setShake]         = useState(false);
  const [loading, setLoading]     = useState(false);
  const formRef                   = useRef(null);

  const selectedCat = CATEGORIES.find((c) => c.name === form.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description || !form.category) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setLoading(true);
    await onAdd({ ...form, amount: parseFloat(form.amount) });
    setForm(EMPTY);
    setLoading(false);
  };

  const fieldBase =
    "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-accent-cyan/40 focus:bg-white/[0.06] transition-all duration-200 hover:border-white/15";

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3 h-full"
    >
      {/* Amount */}
      <div className="relative">
        <DollarSign
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className={`${fieldBase} pl-8 font-number text-base`}
        />
      </div>

      {/* Date */}
      <div className="relative">
        <Calendar
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={`${fieldBase} pl-8`}
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setCatOpen((o) => !o)}
          className={`${fieldBase} flex items-center justify-between text-left`}
        >
          <span className="flex items-center gap-2">
            <Tag size={14} className="text-white/30" />
            {selectedCat ? (
              <>
                <span>{selectedCat.emoji}</span>
                <span style={{ color: selectedCat.color }}>{selectedCat.name}</span>
              </>
            ) : (
              <span className="text-white/25">Category</span>
            )}
          </span>
          <ChevronDown
            size={14}
            className={`text-white/30 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {catOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-white/[0.08] bg-[#0d0d11]/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, category: cat.name });
                    setCatOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{cat.emoji}</span>
                    <span style={{ color: cat.color }}>{cat.name}</span>
                  </span>
                  {form.category === cat.name && (
                    <Check size={13} className="text-accent-cyan" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <div className="relative">
        <FileText
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${fieldBase} pl-8`}
        />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-[#08080b] transition-opacity disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
          boxShadow: "0 4px 20px rgba(34,211,238,0.25)",
        }}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-[#08080b]/40 border-t-[#08080b] rounded-full animate-spin" />
        ) : (
          <PlusCircle size={16} />
        )}
        {loading ? "Adding…" : "Add Transaction"}
      </motion.button>
    </motion.form>
  );
}
