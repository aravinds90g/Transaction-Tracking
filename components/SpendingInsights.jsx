"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle, AlertTriangle, TrendingUp, Zap,
} from "lucide-react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Others"];

export default function SpendingInsights({ transactions }) {
  const [budgetData, setBudgetData] = useState({});

  useEffect(() => {
    axios.get("/api/budgets")
      .then((r) => setBudgetData(r.data?.budgets || {}))
      .catch(console.error);
  }, []);

  const insights = useMemo(() => {
    let totalBudget = 0, totalSpent = 0;
    const overspent = [];
    let biggestExpense = { category: null, amount: 0 };
    const categorySpend = {};

    CATEGORIES.forEach((cat) => {
      const budget = budgetData[cat] || 0;
      const spent  = transactions
        .filter((t) => t.category === cat)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      categorySpend[cat] = { budget, spent };
      totalBudget += budget;
      totalSpent  += spent;
      if (budget > 0 && spent > budget)
        overspent.push({ category: cat, overAmount: spent - budget, percent: Math.round(((spent - budget) / budget) * 100) });
      if (spent > biggestExpense.amount)
        biggestExpense = { category: cat, amount: spent };
    });

    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent, overspent, biggestExpense, categorySpend };
  }, [budgetData, transactions]);

  const hasBudget = insights.totalBudget > 0;
  const isOver    = insights.remaining < 0;

  return (
    <div className="flex flex-wrap gap-3">
      {/* Budget status banner */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex-1 min-w-[200px] flex items-start gap-3 p-4 rounded-2xl border ${
          !hasBudget
            ? "border-white/[0.07] bg-white/[0.03]"
            : isOver
            ? "border-accent-rose/20 bg-accent-rose/[0.07]"
            : "border-accent-emerald/20 bg-accent-emerald/[0.07]"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
            !hasBudget
              ? "bg-white/[0.07]"
              : isOver
              ? "bg-accent-rose/15"
              : "bg-accent-emerald/15"
          }`}
        >
          {!hasBudget ? (
            <Zap size={15} className="text-white/35" />
          ) : isOver ? (
            <AlertTriangle size={15} className="text-accent-rose" />
          ) : (
            <CheckCircle size={15} className="text-accent-emerald" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white/80 leading-snug">
            {!hasBudget
              ? "No budget set"
              : isOver
              ? `Over budget by $${Math.abs(insights.remaining).toFixed(2)}`
              : `$${insights.remaining.toFixed(2)} remaining`}
          </p>
          <p className="text-xs text-white/35 mt-0.5">
            {!hasBudget
              ? "Set a budget to start tracking"
              : `$${insights.totalSpent.toFixed(2)} spent of $${insights.totalBudget} budget`}
          </p>
        </div>
      </motion.div>

      {/* Overspent pills */}
      {insights.overspent.map((item, i) => (
        <motion.div
          key={item.category}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06 }}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-accent-rose/20 bg-accent-rose/[0.07]"
        >
          <AlertTriangle size={13} className="text-accent-rose flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-accent-rose">{item.category}</p>
            <p className="text-[10px] text-white/35">
              +${item.overAmount.toFixed(2)} ({item.percent}% over)
            </p>
          </div>
        </motion.div>
      ))}

      {/* Biggest expense */}
      {insights.biggestExpense.category && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-accent-cyan/15 bg-accent-cyan/[0.05]"
        >
          <TrendingUp size={13} className="text-accent-cyan flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-white/70">Top spend</p>
            <p className="text-[10px] text-white/35">
              {insights.biggestExpense.category} · $
              {insights.biggestExpense.amount.toFixed(2)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}