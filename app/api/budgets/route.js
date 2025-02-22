import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import BudgetModel from "../../../model/BudgetSchema";

// Save or update budget
export async function POST(req) {
  try {
    await connectToDatabase();
    const { budgets } = await req.json();

    if (!budgets) {
      return NextResponse.json(
        { message: "Invalid budget data" },
        { status: 400 }
      );
    }

    const budget = await BudgetModel.findOneAndUpdate(
      {},
      { budgets },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Budget saved", budget },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Get budget

export async function GET() {
  try {
    await connectToDatabase();

    const budgetDoc = await BudgetModel.findOne({}).lean();
    if (!budgetDoc || !budgetDoc.budgets) {
      return NextResponse.json([], { status: 200 });
    }

    // Convert the Map to an array
    const budgetArray = Object.entries(budgetDoc.budgets).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    return NextResponse.json(budgetArray, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
