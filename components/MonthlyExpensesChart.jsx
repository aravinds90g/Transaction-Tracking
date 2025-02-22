import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function MonthlyExpensesChart({ chartData }) {
  return (
    <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6">
          Monthly Expenses
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#ffffff80" // Light gray for XAxis labels
              tick={{ fill: "#ffffff80" }} // Light gray for XAxis text
            />
            <YAxis
              stroke="#ffffff80" // Light gray for YAxis labels
              tick={{ fill: "#ffffff80" }} // Light gray for YAxis text
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#ffffff",
              }}
            />
            <Bar
              dataKey="expense"
              fill="url(#gradientBar)" // Gradient fill for bars
              radius={[4, 4, 0, 0]} // Rounded top corners
            />
            {/* Gradient definition for the bars */}
            <defs>
              <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a2be2" /> {/* Purple */}
                <stop offset="100%" stopColor="#ff6b6b" /> {/* Pink */}
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
