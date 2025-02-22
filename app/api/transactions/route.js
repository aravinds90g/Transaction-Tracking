import connectMongo from "../../../lib/mongodb";
import TransactionModel from "../../../model/Transaction";


export async function GET() {
  try {
    await connectMongo();
    const transactions = await TransactionModel.find().sort({ createdAt: -1 });

    return Response.json(transactions);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
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
      return Response.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const newTransaction = await TransactionModel.create({
      amount,
      date,
      description,
      category, // Assign the category (defaults to "Uncategorized" if empty)
    });

    return Response.json(newTransaction, { status: 201 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

