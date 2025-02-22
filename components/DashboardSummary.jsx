import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardSummary({ transactions, categoryData }) {
  return (
    <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-5">
          Dashboard Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Expenses */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-white/20 transition-all">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-transparent bg-clip-text text-white">
              ${transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-white/20 transition-all">
            <h3 className="text-lg font-semibold text-gray-800">
              Top Category
            </h3>
            <p className="text-xl font-bold text-transparent bg-clip-text text-white mt-6 ">
              {categoryData.length > 0
                ? categoryData.reduce((max, c) =>
                    c.value > max.value ? c : max
                  ).name
                : "No Data"}
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-white/20 transition-all">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Transaction
            </h3>
            <p className="text-md font-bold text-transparent bg-clip-text text-white">
              {transactions.length > 0
                ? `${transactions[transactions.length - 1].description} - $${
                    transactions[transactions.length - 1].amount
                  }`
                : "No Transactions"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
