import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function BudgetComparisonChart({ transactions }) {
  const [budgetData, setBudgetData] = useState([]); // Ensure budgetData is an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/budgets");
        // Ensure budgetData is an array, even if the API returns an object
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.budgets ?? [];
        setBudgetData(data);

        console.log("Data", data);
        console.log("Budget Data:", data);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();
  }, []);

  // Merge budget and transaction data
  const mergedData = budgetData.map((budgetItem) => {
    const actualSpending =
      transactions
        ?.filter((txn) => txn.category === budgetItem.category)
        ?.reduce((total, txn) => total + txn.amount, 0) ?? 0;

    return {
      category: budgetItem.category,
      budget: budgetItem.amount,
      actual: actualSpending,
    };
  });

  const processedData = mergedData.map((item) => ({
    ...item,
    overspending:
      item.actual > item.budget
        ? ((item.actual - item.budget) / item.budget) * 100
        : 0,
    color: item.actual > item.budget ? "#e63946" : "#2a9d8f",
  }));

  return (
    <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6">
          Budget vs Actual Spending
        </h2>
        <ResponsiveContainer width="100%" className={``} height={350}>
          <BarChart

            data={processedData}
            margin={{ top: 10, right: 50, left: 50, bottom: 5 }}
          >
            <XAxis
              dataKey="category"
              textAnchor="middle"
              interval={0}
              className="text-center"
              stroke="#ffffff80" // Light gray for XAxis labels
              tick={{ fill: "#ffffff80" }} // Light gray for XAxis text
            />
            <YAxis
              stroke="#ffffff80" // Light gray for YAxis labels
              tick={{ fill: "#ffffff80" }} // Light gray for YAxis text
            />
            <Tooltip
              formatter={(value) => `$${value}`}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#ffffff",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "#ffffff",
              }}
            />
            <Bar
              dataKey="budget"
              fill="url(#budgetGradient)" // Gradient for budget bars
              name="Budgeted Amount"
            >
              <LabelList
                dataKey="budget"
                position="top"
                formatter={(value) => `$${value}`}
                fill="#ffffff" // White text for labels
              />
            </Bar>
            <Bar
              dataKey="actual"
              fill="url(#actualGradient)" // Gradient for actual bars
              name="Actual Spending"
            >
              <LabelList
                dataKey="actual"
                position="top"
                formatter={(value) => `$${value}`}
                fill="#ffffff" // White text for labels
              />
            </Bar>
            {/* Gradient definitions for bars */}
            <defs>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a2be2" /> {/* Purple */}
                <stop offset="100%" stopColor="#4b0082" /> {/* Indigo */}
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" /> {/* Gold */}
                <stop offset="100%" stopColor="#FFEA00" /> {/* Yellow */}
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
