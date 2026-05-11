import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardSummary({ transactions, categoryData }) {
  const totalExpenses = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const topCategory = categoryData.length > 0
    ? categoryData.reduce((max, c) => c.value > max.value ? c : max).name
    : "No Data";
  const recentTransaction = transactions.length > 0
    ? transactions[transactions.length - 1]
    : null;

  return (
    <Card className="bg-white border-[#d4c5b9] shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-[#3d405b] mb-5">Dashboard Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-[#f0ebe4] rounded-xl text-center">
            <h3 className="text-sm font-medium text-[#81b29a] mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-[#3d405b]">${totalExpenses.toFixed(2)}</p>
          </div>

          <div className="p-5 bg-[#f0ebe4] rounded-xl text-center">
            <h3 className="text-sm font-medium text-[#81b29a] mb-2">Top Category</h3>
            <p className="text-xl font-bold text-[#3d405b]">{topCategory}</p>
          </div>

          <div className="p-5 bg-[#f0ebe4] rounded-xl text-center">
            <h3 className="text-sm font-medium text-[#81b29a] mb-2">Recent</h3>
            <p className="text-sm font-bold text-[#3d405b]">
              {recentTransaction
                ? `${recentTransaction.description.substring(0, 12)}${recentTransaction.description.length > 12 ? '...' : ''}`
                : "No Data"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}