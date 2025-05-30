import mongoose from "mongoose";

const expenseItemSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Airfare", "Food", "Hotel", "Vehicle", "Miscellaneous"],
        required: true,
    },
    description: String,
    amount: { type: Number, required: true },
});

const expenseFolderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    title: { 
        type: String, 
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
    },
    expenses: [expenseItemSchema],
});

const ExpenseFolder = mongoose.model("ExpenseFolder", expenseFolderSchema);
export default ExpenseFolder;