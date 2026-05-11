"use client";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Others"];

const PALETTE = {
  Food:          "#fb923c",
  Transport:     "#60a5fa",
  Shopping:      "#a78bfa",
  Bills:         "#fbbf24",
  Entertainment: "#f472b6",
  Others:        "#34d399",
};

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const over = payload.find((p) => p.dataKey === "actual")?.value >
               payload.find((p) => p.dataKey === "budget")?.value;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0d0d11]/95 px-4 py-3 shadow-2xl backdrop-blur-2xl min-w-[140px]">
      <p className="text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-xs text-white/40">{p.dataKey === "budget" ? "Budget" : "Spent"}</span>
          <span
            className="font-number text-sm font-semibold"
            style={{ color: p.dataKey === "actual" && over ? "#fb7185" : "#34d399" }}
          >
            ${p.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BudgetComparisonChart({ transactions = [] }) {
  const [budgetData, setBudgetData] = useState({});

  useEffect(() => {
    axios.get("/api/budgets")
      .then((r) => setBudgetData(r.data?.budgets || {}))
      .catch(console.error);
  }, []);

  const comparisonData = useMemo(() =>
    CATEGORIES.map((category) => ({
      category,
      budget: budgetData[category] || 0,
      actual: transactions
        .filter((t) => t.category === category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    })).filter((d) => d.budget > 0 || d.actual > 0),
  [budgetData, transactions]);

  if (!comparisonData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center">
          <AlertTriangle size={20} className="text-accent-amber" />
        </div>
        <p className="text-sm text-white/35">No budget set</p>
        <p className="text-xs text-white/20">Click "Set Budget" to track vs spend</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={comparisonData}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="28%"
          barGap={4}
        >
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 10, fontFamily: "Outfit" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

          {/* Budget bar – muted */}
          <Bar dataKey="budget" radius={[4, 4, 0, 0]} name="Budget" fill="rgba(255,255,255,0.10)" />

          {/* Actual bar – colored by category, rose if over budget */}
          <Bar dataKey="actual" radius={[4, 4, 0, 0]} name="Spent">
            {comparisonData.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={
                  entry.actual > entry.budget && entry.budget > 0
                    ? "#fb7185"
                    : PALETTE[entry.category] || "#34d399"
                }
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {comparisonData.map((item, i) => {
          const over = item.actual > item.budget && item.budget > 0;
          const pct  = item.budget > 0 ? Math.min((item.actual / item.budget) * 100, 100) : 0;
          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`p-3 rounded-xl border ${
                over
                  ? "border-accent-rose/25 bg-accent-rose/[0.06]"
                  : "border-white/[0.06] bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-white/60">{item.category}</span>
                {over && (
                  <span className="text-[10px] font-semibold text-accent-rose bg-accent-rose/10 px-1.5 py-0.5 rounded-full">
                    Over!
                  </span>
                )}
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="h-full rounded-full"
                  style={{
                    background: over
                      ? "#fb7185"
                      : PALETTE[item.category] || "#34d399",
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-number text-[10px] text-white/30">
                  ${item.budget}
                </span>
                <span
                  className="font-number text-[10px] font-semibold"
                  style={{ color: over ? "#fb7185" : PALETTE[item.category] || "#34d399" }}
                >
                  ${item.actual.toFixed(2)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}