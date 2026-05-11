"use client";
import React, { useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const PALETTE = {
  Food:          { color: "#fb923c", bg: "rgba(251,146,60,0.14)",  emoji: "🍜" },
  Transport:     { color: "#60a5fa", bg: "rgba(96,165,250,0.14)",  emoji: "🚗" },
  Shopping:      { color: "#a78bfa", bg: "rgba(167,139,250,0.14)", emoji: "🛍️" },
  Bills:         { color: "#fbbf24", bg: "rgba(251,191,36,0.14)",  emoji: "⚡" },
  Entertainment: { color: "#f472b6", bg: "rgba(244,114,182,0.14)", emoji: "🎬" },
  Others:        { color: "#34d399", bg: "rgba(52,211,153,0.14)",  emoji: "📦" },
};
const fallback = { color: "#94a3b8", bg: "rgba(148,163,184,0.14)", emoji: "💸" };

function GlassTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p    = PALETTE[payload[0].name] || fallback;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0d0d11]/95 px-4 py-3 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{p.emoji}</span>
        <span className="text-sm font-medium" style={{ color: p.color }}>
          {payload[0].name}
        </span>
      </div>
      <p className="font-number text-lg font-semibold text-white/80">
        ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

export default function CategoryWiseExpenses({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const categoryData = useMemo(() => {
    if (!transactions?.length) return [];
    return transactions.reduce((acc, t) => {
      const category = t.category || "Others";
      const existing = acc.find((item) => item.name === category);
      if (existing) existing.value += Math.abs(t.amount);
      else acc.push({ name: category, value: Math.abs(t.amount) });
      return acc;
    }, []);
  }, [transactions]);

  const total = categoryData.reduce((sum, c) => sum + c.value, 0);

  if (!categoryData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
        <div className="text-4xl">🍩</div>
        <p className="text-sm text-white/25">No category data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Donut */}
      <div className="relative h-[200px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {categoryData.map((entry, index) => {
                const p = PALETTE[entry.name] || fallback;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={p.color}
                    stroke="transparent"
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                    style={{ transition: "opacity 0.2s, transform 0.2s" }}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<GlassTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-white/35 uppercase tracking-wider">Total</p>
          <p className="font-number text-xl font-semibold text-white/80 leading-none mt-0.5">
            ${total.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2 overflow-y-auto flex-1">
        {categoryData
          .sort((a, b) => b.value - a.value)
          .map((cat, i) => {
            const p    = PALETTE[cat.name] || fallback;
            const pct  = total > 0 ? (cat.value / total) * 100 : 0;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className="group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-default"
                style={{
                  background: activeIndex === i ? p.bg : "transparent",
                  border: `1px solid ${activeIndex === i ? p.color + "30" : "transparent"}`,
                }}
              >
                <span className="text-sm w-5">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: p.color }}
                    >
                      {cat.name}
                    </span>
                    <span className="font-number text-xs text-white/50">
                      ${cat.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: p.color }}
                    />
                  </div>
                </div>
                <span className="font-number text-xs text-white/30 w-9 text-right">
                  {pct.toFixed(0)}%
                </span>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}