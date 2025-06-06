import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_EXPENSE } from "../graphql/expenseMutations";
import { GET_EXPENSE_FOLDERS } from "../graphql/expenseQueries";
import "../../styles/expenseManager.css";

interface ExpenseFormProps {
    folderId: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ folderId }) => {
    const [category, setCategory] = useState("Airfare");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [addExpense, {loading, error}] = useMutation(ADD_EXPENSE, {
        refetchQueries: [{ query: GET_EXPENSE_FOLDERS }],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try { 
            await addExpense({
                variables: {
                    folderId,
                    category,
                    amount: parsedAmount,
                    description: description || null,
                },
            });

            // Reset form
            setCategory("Airfare");
            setAmount("");
            setDescription("");
          } catch (err) {
            console.error("Failed to add expense:", err);
          }
        };

    return (
        <form onSubmit={handleSubmit}>
            <h4>Add Expense</h4>

            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="Airfare">Airfare</option>
                <option value="Food">Food</option>
                <option value="Hotel">Hotel</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Miscellaneous">Miscellaneous</option>
            </select>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <div className="bubble-button-wrapper">
                <div className="bubble-button">
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Expense"}
                </button>
            </div>
        </div>

        {error && <p className="folder-error">Error: {error.message}</p>}
    </form>
    );
};

export default ExpenseForm;