"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Others",
];

// Initialize budgets with default values for all categories
const initialBudgets = categories.reduce((acc, category) => {
  acc[category] = "";
  return acc;
}, {});

export default function BudgetModal() {
  const [open, setOpen] = useState(false);
  const [budgets, setBudgets] = useState(initialBudgets);

  const handleChange = (category, value) => {
    setBudgets({ ...budgets, [category]: value });
  };

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      // Check if all categories have a budget value
      const allFilled = categories.every((category) => budgets[category]);
      if (!allFilled) {
        alert("Please fill in all budget fields.");
        return;
      }

      const response = await axios.post("/api/budgets", {
        budgets,
      });

      window.location.reload();
      alert("Budgets saved successfully");

      setOpen(false);
    } catch (error) {
      console.error(
        "Error saving budget:",
        error.response?.data || error.message
      );
    }
  };


  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        Set Monthly Budgets
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 my-6">
              Set Monthly Category Budgets
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {categories.map((category) => (
              <div
                key={category}
                className="flex justify-between items-center space-x-4"
              >
                <span className="text-gray-700 font-medium">{category}</span>
                <Input
                  type="number"
                  placeholder="Enter budget"
                  value={budgets[category]}
                  required={true}
                  onChange={(e) => handleChange(category, e.target.value)}
                  className="w-32 md:w-48 lg:w-64 px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
              </div>
            ))}
          </div>
          <Button
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={handleSave}
          >
            Save Budgets
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
