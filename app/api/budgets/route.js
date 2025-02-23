import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import BudgetModel from "../../../model/BudgetSchema";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Save or update budget
export async function POST(req) {
  try {
    await connectToDatabase();
    const { budgets } = await req.json();

    if (!budgets) {
      return NextResponse.json(
        { message: "Invalid budget data" },
        { status: 400, headers: corsHeaders }
      );
    }

    const budget = await BudgetModel.findOneAndUpdate(
      {},
      { budgets },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Budget saved", budget },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Get budget
export async function GET() {
  try {
    await connectToDatabase();

    const budgetDoc = await BudgetModel.findOne({}).lean();
    if (!budgetDoc || !budgetDoc.budgets) {
      return NextResponse.json([], { status: 200, headers: corsHeaders });
    }

    // Convert the Map to an array
    const budgetArray = Object.entries(budgetDoc.budgets).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    return NextResponse.json(budgetArray, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
