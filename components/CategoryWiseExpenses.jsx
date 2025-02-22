import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const COLORS = [
  "#8A2BE2",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#0088FE",
];

export default function CategoryWiseExpenses({ transactions }) {
  
  const [categoryData, setCategoryData] = useState([]);
  const [latestMonth, setLatestMonth] = useState("");

  useEffect(() => {
    if (transactions.length === 0) return;

    // Get the latest transaction month and year dynamically
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const latestTransactionDate = new Date(sortedTransactions[0].date);
    const latestMonthNumber = latestTransactionDate.getMonth();
    const latestYear = latestTransactionDate.getFullYear();

    setLatestMonth(
      latestTransactionDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    );

    // Filter and group transactions for the latest month
    const data = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === latestMonthNumber &&
          transactionDate.getFullYear() === latestYear
        );
      })
      .reduce((acc, transaction) => {
        const category = transaction.category || "Uncategorized";
        const existing = acc.find((item) => item.name === category);
        if (existing) {
          existing.value += Math.abs(transaction.amount);
        } else {
          acc.push({ name: category, value: Math.abs(transaction.amount) });
        }
        return acc;
      }, []);

    setCategoryData(data);
  }, [transactions]); // ✅ Updates dynamically when transactions change

  return (
    <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6">
          Category-wise Expenses for {transactions.length ===0 ? `Next Month` : latestMonth}
        </h2>

        {/* Show message if no data is available */}
        {transactions.length === 0 ? (
          <div className="text-center text-white/70">
            No data available for {`Next Month`}.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 1.3;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={12}
                    >
                      {`${categoryData[index]?.name}: $${value}`}
                    </text>
                  );
                }}
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Legend layout="horizontal" wrapperStyle={{ color: "#ffffff" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
