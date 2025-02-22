import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  budgets: {
    type: Map,
    of: {
      type: Number,
      min: 0, 
    },
    default: {},
  },
});

const BudgetModel =
  mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);

export default BudgetModel;
