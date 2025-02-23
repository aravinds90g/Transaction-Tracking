import connectMongo from "../../../lib/mongodb";
import TransactionModel from "../../../model/Transaction";

export async function GET() {
  try {
    await connectMongo();
    const transactions = await TransactionModel.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(transactions), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const {
      amount,
      date,
      description,
      category = "Uncategorized",
    } = await req.json();

    if (!amount || !date || !description) {
      return new Response(
        JSON.stringify({ message: "All fields are required!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newTransaction = await TransactionModel.create({
      amount,
      date,
      description,
      category,
    });

    return new Response(JSON.stringify(newTransaction), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
