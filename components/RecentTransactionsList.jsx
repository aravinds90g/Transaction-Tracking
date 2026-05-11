"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, Trash2, X, Check,
  ChevronDown,
} from "lucide-react";

const CATEGORIES = [
  { name: "Food",          emoji: "🍜", color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  { name: "Transport",     emoji: "🚗", color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  { name: "Shopping",      emoji: "🛍️", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { name: "Bills",         emoji: "⚡", color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  { name: "Entertainment", emoji: "🎬", color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { name: "Others",        emoji: "📦", color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
];

const getCat = (name) =>
  CATEGORIES.find((c) => c.name === name) || { emoji: "💸", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" };

function EditRow({ t, onSave, onCancel }) {
  const [form, setForm] = useState({
    amount:      String(t.amount),
    date:        t.date.split("T")[0],
    description: t.description,
    category:    t.category || "",
  });
  const [catOpen, setCatOpen] = useState(false);
  const selectedCat = getCat(form.category);

  const fieldBase =
    "bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-accent-cyan/40 transition-all w-full";

  return (
    <div className="grid grid-cols-1 gap-2 p-1">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className={`${fieldBase} font-number`}
          placeholder="Amount"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={fieldBase}
        />
      </div>

      {/* Category mini-select */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setCatOpen((o) => !o)}
          className={`${fieldBase} flex items-center justify-between`}
        >
          <span className="flex items-center gap-2">
            <span>{selectedCat.emoji}</span>
            <span style={{ color: selectedCat.color }}>{form.category || "Category"}</span>
          </span>
          <ChevronDown size={12} className={`text-white/30 transition-transform ${catOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {catOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-white/[0.08] bg-[#0d0d11]/98 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => { setForm({ ...form, category: cat.name }); setCatOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/[0.05] transition-colors"
                >
                  <span>{cat.emoji}</span>
                  <span style={{ color: cat.color }}>{cat.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className={fieldBase}
        placeholder="Description"
      />

      <div className="flex gap-2 mt-1">
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => onSave({ ...form, amount: parseFloat(form.amount) })}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-[#08080b]"
          style={{ background: "linear-gradient(135deg, #22d3ee, #06b6d4)" }}
        >
          <Check size={13} /> Save
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white/50 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </div>
  );
}

const rowVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 30 } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export default function RecentTransactionsList({ transactions, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  const handleSave = (id, data) => {
    onEdit(id, data);
    setEditingId(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-3xl">
          💸
        </div>
        <p className="text-white/35 text-sm">No transactions this month</p>
        <p className="text-white/20 text-xs">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
      <AnimatePresence mode="popLayout">
        {[...transactions].reverse().map((t) => {
          const cat = getCat(t.category);
          const isEditing = editingId === t._id;

          return (
            <motion.div
              key={t._id}
              variants={rowVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              className={`rounded-xl border transition-all duration-200 ${
                isEditing
                  ? "border-accent-cyan/25 bg-white/[0.06] p-3"
                  : "border-white/[0.05] bg-white/[0.025] p-3 hover:bg-white/[0.05] hover:border-white/[0.10]"
              }`}
            >
              {isEditing ? (
                <EditRow
                  t={t}
                  onSave={(data) => handleSave(t._id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center gap-3">
                  {/* Category icon bubble */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: cat.bg }}
                  >
                    {cat.emoji}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric",
                      })}
                      {" · "}
                      <span style={{ color: cat.color }}>{t.category}</span>
                    </p>
                  </div>

                  {/* Amount */}
                  <span className="font-number text-sm font-semibold text-accent-rose flex-shrink-0 mr-2">
                    -${Math.abs(t.amount).toFixed(2)}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingId(t._id)}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.06] flex items-center justify-center text-white/35 hover:text-accent-cyan transition-all"
                    >
                      <Pencil size={11} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(t._id)}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-accent-rose/10 border border-white/[0.06] hover:border-accent-rose/25 flex items-center justify-center text-white/35 hover:text-accent-rose transition-all"
                    >
                      <Trash2 size={11} />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
