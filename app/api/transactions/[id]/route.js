import connectMongo from "../../../../lib/mongodb";
import TransactionModel from "../../../../model/Transaction";

export async function GET(req, { params }) {
  try {
    await connectMongo();
    const transaction = await TransactionModel.findOne({ _id: params.id });

    if (!transaction) {
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return Response.json(transaction);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectMongo();

    if (!params.id) {
      return new Response(
        JSON.stringify({ message: "Transaction ID is required!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const deletedTransaction = await TransactionModel.findByIdAndDelete(
      params.id
    );

    if (!deletedTransaction) {
      return new Response(
        JSON.stringify({ message: "Transaction not found!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Transaction deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



export async function PATCH(req, { params }) {
  try {
    await connectMongo();

    if (!params.id) {
      return new Response(
        JSON.stringify({ message: "Transaction ID is required!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(updatedTransaction), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
