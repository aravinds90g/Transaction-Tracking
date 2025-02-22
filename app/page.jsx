"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import SpendingInsights from "@/components/SpendingInsights";
import BudgetModal from "@/components/BudgetModal";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryWiseExpenses from "@/components/CategoryWiseExpenses";
import DashboardSummary from "@/components/DashboardSummary";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
  });
  const [editMode, setEditMode] = useState(null); // Store transaction ID being edited
  const [editForm, setEditForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
  });
  const [budgetData, setBudgetData] = useState([]);

  // State for current month
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const currentMonthName = new Date(2023, currentMonth).toLocaleString(
    "en-US",
    {
      month: "long",
    }
  );

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsResponse, budgetResponse] = await Promise.all([
          axios.get("/api/transactions"),
          axios.get("http://localhost:3000/api/budgets"),
        ]);
        setTransactions(transactionsResponse.data);
        setBudgetData(budgetResponse.data?.budgets || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter transactions for the current month
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionMonth = new Date(transaction.date).getMonth();
      return transactionMonth === currentMonth;
    });
  }, [transactions, currentMonth]);

  // Handle month change
  const handleMonthChange = useCallback((direction) => {
    setCurrentMonth((prevMonth) =>
      direction === "prev"
        ? prevMonth === 0
          ? 11
          : prevMonth - 1
        : prevMonth === 11
        ? 0
        : prevMonth + 1
    );
  }, []);

  // Add Transaction
  const addTransaction = async () => {
    if (!form.amount || !form.date || !form.description || !form.category) {
      alert("Please fill all fields");
      return;
    }

    const newTransaction = { ...form, amount: parseFloat(form.amount) };
    try {
      const response = await axios.post("/api/transactions", newTransaction);
      setTransactions((prev) => [...prev, response.data]);
      setForm({ amount: "", date: "", description: "", category: "" });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Start Edit Transaction
  const startEdit = (transaction) => {
    setEditMode(transaction._id);
    setEditForm({
      amount: transaction.amount,
      date: transaction.date.split("T")[0],
      description: transaction.description,
      category: transaction.category || "",
    });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditMode(null);
    setEditForm({ amount: "", date: "", description: "", category: "" });
  };

  // Update Transaction
  const updateTransaction = async () => {
    if (
      !editForm.amount ||
      !editForm.date ||
      !editForm.description ||
      !editForm.category
    ) {
      alert("Please fill all fields");
      return;
    }

    const updatedTransaction = {
      amount: parseFloat(editForm.amount),
      date: editForm.date,
      description: editForm.description,
      category: editForm.category,
    };

    try {
      const response = await axios.patch(
        `/api/transactions/${editMode}`,
        updatedTransaction
      );
      setTransactions((prev) =>
        prev.map((t) => (t._id === editMode ? response.data : t))
      );
      cancelEdit();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Process data for charts
  const chartData = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
      });
      const existing = acc.find((item) => item.name === month);
      if (existing) existing.expense += Math.abs(transaction.amount);
      else acc.push({ name: month, expense: Math.abs(transaction.amount) });
      return acc;
    }, []);
  }, [transactions]);

  const categoryData = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category || "Uncategorized";
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.value += Math.abs(transaction.amount);
      } else {
        acc.push({ name: category, value: Math.abs(transaction.amount) });
      }
      return acc;
    }, []);
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="fixed top-8 right-8 z-50">
        <BudgetModal />
      </div>

      {/* Fixed Month Navigation Buttons */}
      <div className="fixed top-80 left-0 z-50">
        <Button
          onClick={() => handleMonthChange("prev")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          Previous Month
        </Button>
      </div>
      <div className="fixed top-80 right-0 z-50">
        <Button
          onClick={() => handleMonthChange("next")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          Next Month
        </Button>
      </div>

      {/* Selected Month Display */}
      <div className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
        {currentMonthName}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* First Column: Add Transaction and Transactions */}
        <div className="space-y-8">
          {/* Add Transaction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6">
                  Add Transaction
                </h2>
                <Input
                  type="number"
                  min="0"
                  value={form.amount}
                  placeholder="Amount"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="bg-white/10 border border-white/10 text-white placeholder-gray-400"
                />
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="bg-white/10 border border-white/10 text-white placeholder-gray-400"
                />
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                >
                  <SelectTrigger className="bg-white/10 border border-white/10 text-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-white/10">
                    {[
                      "Food",
                      "Transport",
                      "Shopping",
                      "Bills",
                      "Entertainment",
                      "Others",
                    ].map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="hover:bg-gray-700"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="bg-white/10 border border-white/10 text-white placeholder-gray-400"
                />
                <Button
                  onClick={addTransaction}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Add
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spending Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div>
              <SpendingInsights transactions={filteredTransactions} />
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-opacity-20 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6">
                  Transactions
                </h2>
                <div className="max-h-96 overflow-y-auto">
                  {filteredTransactions.length === 0 ? (
                    <h1 className="text-center text-gray-300">
                      No Data Available
                    </h1>
                  ) : (
                    filteredTransactions.map((t) => (
                      <motion.div
                        key={t._id}
                        className="flex justify-between p-4 border-b border-white/10 hover:bg-white/5 transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        {editMode === t._id ? (
                          <div className="grid gap-2 w-full">
                            <Input
                              type="number"
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  amount: e.target.value,
                                })
                              }
                              className="bg-white/10 border border-white/10 text-white placeholder-gray-400"
                            />
                            <Input
                              type="date"
                              value={editForm.date}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  date: e.target.value,
                                })
                              }
                              className="bg-white/10 border border-white/10 text-white placeholder-gray-400"
                            />
                            <Select
                              onValueChange={(value) =>
                                setEditForm({ ...editForm, category: value })
                              }
                            >
                              <SelectTrigger className="bg-white/10 border border-white/10 text-white">
                                <SelectValue
                                  placeholder={
                                    editForm.category || "Select Category"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border border-white/10">
                                {[
                                  "Food",
                                  "Transport",
                                  "Shopping",
                                  "Bills",
                                  "Entertainment",
                                  "Others",
                                ].map((cat) => (
                                  <SelectItem
                                    key={cat}
                                    value={cat}
                                    className="hover:bg-gray-700"
                                  >
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  description: e.target.value,
                                })
                              }
                              className="bg-white/10 border border-white/10 text-white placeholder-gray-400"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={updateTransaction}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={cancelEdit}
                                className="bg-white/10 border border-white/10 text-white hover:bg-white/20"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between w-full items-center">
                            <span className="text-lg">
                              {t.description} - ${t.amount} ({t.category})
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => startEdit(t)}
                                className="bg-white/10 border border-white/10 text-white hover:bg-white/20"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteTransaction(t._id)}
                                className="bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Second Column: Charts and Insights */}
        <div className="space-y-20">
          {/* Dashboard Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div>
              <DashboardSummary
                transactions={filteredTransactions}
                categoryData={categoryData}
              />
            </div>
          </motion.div>

          {/* Monthly Expenses Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <MonthlyExpensesChart chartData={chartData} />
            </div>
          </motion.div>

          {/* Category-Wise Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div>
              <CategoryWiseExpenses transactions={filteredTransactions} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-Width Budget Comparison Chart */}
      <div className="mt-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <BudgetComparisonChart transactions={filteredTransactions} />
        </motion.div>
      </div>
    </div>
  );
}
