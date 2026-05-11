"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

/* ── Components ─────────────────────────────────────────── */
import BudgetModal            from "@/components/BudgetModal";
import SummaryWidget          from "@/components/SummaryWidget";
import AddTransactionForm     from "@/components/AddTransactionForm";
import RecentTransactionsList from "@/components/RecentTransactionsList";
import MonthlyExpensesChart   from "@/components/MonthlyExpensesChart";
import CategoryWiseExpenses   from "@/components/CategoryWiseExpenses";
import BudgetComparisonChart  from "@/components/BudgetComparisonChart";
import SpendingInsights       from "@/components/SpendingInsights";

/* ─── Tile wrapper ──────────────────────────────────────── */
const tileVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

function BentoTile({ children, className = "", label, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      custom={delay}
      variants={tileVariants}
      initial="hidden"
      animate="visible"
      className={`bento-card p-5 flex flex-col ${className}`}
    >
      {(label || Icon) && (
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          {Icon && (
            <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Icon size={13} className="text-white/45" />
            </div>
          )}
          {label && (
            <span className="text-xs font-semibold text-white/38 uppercase tracking-widest">
              {label}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  );
}

/* ─── Month names ───────────────────────────────────────── */
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─── Skeleton shimmer tile ─────────────────────────────── */
function SkeletonTile({ className }) {
  return (
    <div className={`bento-card ${className}`}>
      <div className="skeleton-shimmer h-4 w-24 mb-4 rounded-lg" />
      <div className="skeleton-shimmer h-full rounded-xl" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [transactions,  setTransactions]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [currentMonth,  setCurrentMonth]  = useState(new Date().getMonth());
  const [currentYear]                     = useState(new Date().getFullYear());

  /* Fetch ─────────────────────────────────────────────────── */
  useEffect(() => {
    Promise.all([
      axios.get("/api/transactions"),
      axios.get("/api/budgets"),
    ])
      .then(([txRes]) => setTransactions(txRes.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Filtered transactions for selected month ─────────────── */
  const filteredTransactions = useMemo(
    () => transactions.filter((t) => new Date(t.date).getMonth() === currentMonth),
    [transactions, currentMonth]
  );

  /* Chart data ────────────────────────────────────────────── */
  const chartData = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const key = new Date(t.date).toLocaleString("default", { month: "short" });
      grouped[key] = (grouped[key] || 0) + Math.abs(t.amount);
    });
    return Object.entries(grouped).map(([name, expense]) => ({ name, expense }));
  }, [transactions]);

  const categoryData = useMemo(() =>
    filteredTransactions.reduce((acc, t) => {
      const cat = t.category || "Others";
      const ex  = acc.find((i) => i.name === cat);
      if (ex) ex.value += Math.abs(t.amount);
      else acc.push({ name: cat, value: Math.abs(t.amount) });
      return acc;
    }, []),
  [filteredTransactions]);

  /* Month nav ─────────────────────────────────────────────── */
  const handleMonthChange = useCallback((dir) => {
    setCurrentMonth((m) =>
      dir === "prev" ? (m === 0 ? 11 : m - 1) : (m === 11 ? 0 : m + 1)
    );
  }, []);

  /* CRUD ──────────────────────────────────────────────────── */
  const addTransaction = useCallback(async (form) => {
    const res = await axios.post("/api/transactions", form);
    setTransactions((prev) => [...prev, res.data]);
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await axios.delete(`/api/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    const res = await axios.patch(`/api/transactions/${id}`, {
      ...data, amount: parseFloat(data.amount),
    });
    setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  }, []);

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <MotionConfig reducedMotion="user">
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-cyan"    aria-hidden />
      <div className="bg-orb bg-orb-violet"  aria-hidden />
      <div className="bg-orb bg-orb-emerald" aria-hidden />

      <div className="relative z-10 min-h-screen p-4 lg:p-6">
        {/* ── HEADER ─────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6 max-w-[1440px] mx-auto"
        >
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #22d3ee22 0%, #34d39922 100%)",
                border: "1px solid rgba(34,211,238,0.20)",
              }}
            >
              <LayoutDashboard size={16} className="text-accent-cyan" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text leading-none">
                Fintrack
              </h1>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">
                Personal Finance
              </p>
            </div>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-2 bg-white/[0.035] border border-white/[0.07] rounded-2xl px-4 py-2.5 backdrop-blur-xl">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMonthChange("prev")}
              className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <ChevronLeft size={14} />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.span
                key={currentMonth}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-sm font-semibold text-white/80 w-24 text-center tabular-nums"
              >
                {MONTH_NAMES[currentMonth]}
              </motion.span>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMonthChange("next")}
              className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <ChevronRight size={14} />
            </motion.button>
          </div>

          {/* Budget button */}
          <BudgetModal />
        </motion.header>

        {/* ── BENTO GRID ─────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-12 gap-4 max-w-[1440px] mx-auto">
            <SkeletonTile className="col-span-12 lg:col-span-4 min-h-[340px]" />
            <SkeletonTile className="col-span-12 lg:col-span-8 min-h-[200px]" />
            <SkeletonTile className="col-span-12 lg:col-span-7 min-h-[300px]" />
            <SkeletonTile className="col-span-12 lg:col-span-5 min-h-[300px]" />
            <SkeletonTile className="col-span-12 min-h-[60px]" />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 max-w-[1440px] mx-auto">

            {/* ① Add Transaction ── col 1-4 ── row 1 */}
            <BentoTile
              className="col-span-12 lg:col-span-4"
              label="New Transaction"
              delay={0}
              icon={() => (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            >
              <AddTransactionForm onAdd={addTransaction} />
            </BentoTile>

            {/* ② Summary ── col 5-12 ── row 1 */}
            <BentoTile
              className="col-span-12 lg:col-span-8"
              label="Overview"
              delay={1}
              icon={() => (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" strokeLinecap="round" />
                </svg>
              )}
            >
              <SummaryWidget
                transactions={filteredTransactions}
                categoryData={categoryData}
              />
            </BentoTile>

            {/* ③ Monthly Expenses Chart ── col 1-7 ── row 2 */}
            <BentoTile
              className="col-span-12 lg:col-span-7 min-h-[280px]"
              label="Monthly Trends"
              delay={2}
              icon={() => (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            >
              <MonthlyExpensesChart chartData={chartData} />
            </BentoTile>

            {/* ④ Category Donut ── col 8-12 ── row 2 */}
            <BentoTile
              className="col-span-12 lg:col-span-5 min-h-[280px]"
              label="By Category"
              delay={3}
              icon={() => (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" strokeLinecap="round" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              )}
            >
              <CategoryWiseExpenses transactions={filteredTransactions} />
            </BentoTile>

            {/* ⑤ Budget Comparison ── col 1-5 ── row 3 */}
            <BentoTile
              className="col-span-12 lg:col-span-5 min-h-[320px]"
              label="Budget vs Spent"
              delay={4}
              icon={() => (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <rect x="2" y="3" width="4" height="18" rx="1" />
                  <rect x="10" y="8" width="4" height="13" rx="1" />
                  <rect x="18" y="13" width="4" height="8" rx="1" />
                </svg>
              )}
            >
              <BudgetComparisonChart transactions={filteredTransactions} />
            </BentoTile>

            {/* ⑥ Recent Transactions ── col 6-12 ── row 3 */}
            <BentoTile
              className="col-span-12 lg:col-span-7 min-h-[320px]"
              label={`${MONTH_NAMES[currentMonth]} Transactions`}
              delay={5}
              icon={() => (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
                  <line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round" />
                </svg>
              )}
            >
              <RecentTransactionsList
                transactions={filteredTransactions}
                onEdit={updateTransaction}
                onDelete={deleteTransaction}
              />
            </BentoTile>

            {/* ⑦ Spending Insights ── full width ── row 4 */}
            <motion.div
              custom={6}
              variants={tileVariants}
              initial="hidden"
              animate="visible"
              className="col-span-12"
            >
              <div className="bento-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13} className="text-white/45">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white/38 uppercase tracking-widest">
                    Spending Insights
                  </span>
                </div>
                <SpendingInsights transactions={filteredTransactions} />
              </div>
            </motion.div>

          </div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-[10px] text-white/20 mt-8 tracking-wider"
        >
          FINTRACK · {currentYear} · Personal Finance Dashboard
        </motion.p>
      </div>
    </MotionConfig>
  );
}