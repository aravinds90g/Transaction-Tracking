"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

export default function SpendingInsights({ transactions }) {
  const [budgetData, setBudgetData] = useState([]); // Ensure budgetData is an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/budgets");

        // Ensure budgetData is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setBudgetData(data);

        console.log("Budget Data:", data);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();
  }, []);

  // Merge budget data with actual spending
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

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);

  // Calculate total actual spending
  const totalSpent = mergedData.reduce((sum, item) => sum + item.actual, 0);
  const remainingBudget = totalBudget - totalSpent;

  // Find overspent categories
  const overspentCategories = mergedData
    .filter((item) => item.actual > item.budget)
    .map((item) => ({
      category: item.category,
      overspentAmount: item.actual - item.budget,
      overspentPercent: Math.round(
        ((item.actual - item.budget) / item.budget) * 100
      ),
    }));

  // Find the biggest expense category (handle empty mergedData)
  const biggestExpense =
    mergedData.length > 0
      ? mergedData.reduce((max, item) =>
          item.actual > max.actual ? item : max
        )
      : { category: "None", actual: 0 };

  return (
    <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6">
          Spending Insights
        </h2>

        {/* Remaining Budget */}
        <div
          className={`p-4 rounded-md ${
            remainingBudget >= 0
              ? "bg-green-300 backdrop-blur-md border border-green-900"
              : "bg-red-300 backdrop-blur-md border border-red-900 "
          }`}
        >
          <p className="text-lg font-semibold text-black">
            {remainingBudget >= 0
              ? `You have $${remainingBudget} left in your budget this month.`
              : `You have overspent $${Math.abs(remainingBudget)} this month!`}
          </p>
        </div>

        {/* Overspending Alerts */}
        {overspentCategories.length > 0 && (
          <div className="mt-4 space-y-3">
            {overspentCategories.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-red-300 backdrop-blur-md border border-red-900 rounded-md"
              >
                <p className="text-black">
                  ⚠ You overspent ${item.overspentAmount} in the "
                  {item.category}" category by {item.overspentPercent}%.
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Biggest Expense */}
        <div className="mt-4 p-4 bg-orange-300 backdrop-blur-md border border-orange-400 rounded-md">
          <p className="text-black">
            🔍 Your biggest expense this month is "{biggestExpense.category}"
            with ${biggestExpense.actual} spent.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
