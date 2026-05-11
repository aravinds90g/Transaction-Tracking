"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Clock,
  DollarSign,
} from "lucide-react";

const CATEGORY_ICONS = {
  Food:          "🍜",
  Transport:     "🚗",
  Shopping:      "🛍️",
  Bills:         "⚡",
  Entertainment: "🎬",
  Others:        "📦",
};

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function SummaryWidget({ transactions, categoryData }) {
  const totalExpenses = useMemo(
    () => transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [transactions]
  );

  const topCategory = useMemo(
    () =>
      categoryData.length > 0
        ? categoryData.reduce((max, c) => (c.value > max.value ? c : max))
        : null,
    [categoryData]
  );

  const recentTransaction = useMemo(
    () => (transactions.length > 0 ? transactions[transactions.length - 1] : null),
    [transactions]
  );

  const avgPerTransaction = transactions.length
    ? totalExpenses / transactions.length
    : 0;

  const stats = [
    {
      label:   "Total Spent",
      value:   `$${totalExpenses.toFixed(2)}`,
      sub:     `${transactions.length} transactions`,
      icon:    DollarSign,
      color:   "text-accent-cyan",
      glow:    "bg-accent-cyan/10",
      border:  "border-accent-cyan/20",
    },
    {
      label:   "Top Category",
      value:   topCategory ? topCategory.name : "—",
      sub:     topCategory
        ? `$${topCategory.value.toFixed(2)} spent`
        : "No data yet",
      icon:    Layers,
      color:   "text-accent-violet",
      glow:    "bg-accent-violet/10",
      border:  "border-accent-violet/20",
      emoji:   topCategory ? CATEGORY_ICONS[topCategory.name] : null,
    },
    {
      label:   "Avg / Transaction",
      value:   `$${avgPerTransaction.toFixed(2)}`,
      sub:     "this month",
      icon:    TrendingUp,
      color:   "text-accent-emerald",
      glow:    "bg-accent-emerald/10",
      border:  "border-accent-emerald/20",
    },
    {
      label:   "Latest",
      value:   recentTransaction
        ? recentTransaction.description.length > 14
          ? recentTransaction.description.slice(0, 14) + "…"
          : recentTransaction.description
        : "—",
      sub:     recentTransaction
        ? `$${Math.abs(recentTransaction.amount).toFixed(2)}`
        : "No data yet",
      icon:    Clock,
      color:   "text-accent-rose",
      glow:    "bg-accent-rose/10",
      border:  "border-accent-rose/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`relative flex flex-col justify-between p-4 rounded-2xl border ${stat.border} ${stat.glow} overflow-hidden`}
        >
          {/* Subtle inner glow strip */}
          <div
            className={`absolute top-0 left-0 right-0 h-px ${stat.glow} opacity-60`}
          />

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-white/40 tracking-wide uppercase">
              {stat.label}
            </span>
            <div className={`w-7 h-7 rounded-lg ${stat.glow} flex items-center justify-center`}>
              {stat.emoji ? (
                <span className="text-sm">{stat.emoji}</span>
              ) : (
                <stat.icon size={14} className={stat.color} />
              )}
            </div>
          </div>

          <div>
            <p className={`font-number text-xl font-semibold ${stat.color} leading-none mb-1`}>
              {stat.value}
            </p>
            <p className="text-xs text-white/35">{stat.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
