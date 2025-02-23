import connectMongo from "../../../../lib/mongodb";
import TransactionModel from "../../../../model/Transaction";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(req, { params }) {
  try {
    await connectMongo();
    const transaction = await TransactionModel.findOne({ _id: params.id });

    if (!transaction) {
      return new Response(
        JSON.stringify({ message: "Transaction not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify(transaction), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongo();

    if (!params.id) {
      return new Response(
        JSON.stringify({ message: "Transaction ID is required!" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const deletedTransaction = await TransactionModel.findByIdAndDelete(
      params.id
    );

    if (!deletedTransaction) {
      return new Response(
        JSON.stringify({ message: "Transaction not found!" }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ message: "Transaction deleted successfully" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectMongo();

    if (!params.id) {
      return new Response(
        JSON.stringify({ message: "Transaction ID is required!" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await req.json(); // Parse request body

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      params.id,
      { $set: body }, // Update fields dynamically
      { new: true } // Return updated document
    );

    if (!updatedTransaction) {
      return new Response(
        JSON.stringify({ message: "Transaction not found!" }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify(updatedTransaction), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
