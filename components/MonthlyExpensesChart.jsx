"use client";
import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, defs, linearGradient,
} from "recharts";

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0d0d11]/95 px-4 py-3 shadow-2xl backdrop-blur-2xl">
      <p className="mb-1 text-xs font-medium text-white/40 uppercase tracking-wider">{label}</p>
      <p className="font-number text-lg font-semibold text-accent-cyan">
        ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

export default function MonthlyExpensesChart({ chartData }) {
  const data = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return chartData;
  }, [chartData]);

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-sm text-white/25">No expense data yet</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGradCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 11, fontFamily: "Outfit" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 11, fontFamily: "JetBrains Mono" }}
          tickFormatter={(v) => `$${v}`}
          width={52}
        />
        <Tooltip
          content={<GlassTooltip />}
          cursor={{ stroke: "rgba(34,211,238,0.15)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#22d3ee"
          strokeWidth={2.5}
          fill="url(#areaGradCyan)"
          dot={{ r: 3, fill: "#22d3ee", stroke: "#08080b", strokeWidth: 2 }}
          activeDot={{
            r: 5,
            fill: "#22d3ee",
            stroke: "#fff",
            strokeWidth: 2,
            filter: "drop-shadow(0 0 6px rgba(34,211,238,0.8))",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
