import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_EXPENSE } from "../graphql/expenseMutations";
import ExpenseForm from "./ExpenseForm";

interface Expense {
    category: string;
    description?: string;
    amount: number;
}

interface Folder {
    _id: string;
    title: string;
    createdAt: string;
    expenses: Expense[];
}

interface FolderCardProps {
    folder: Folder;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
    const [localExpenses, setLocalExpenses] = useState<Expense[]>(folder.expenses);

    const [addExpense] = useMutation(ADD_EXPENSE, {
        onError: (error) => console.error("Failed to add expense:", error.message),
        onCompleted: (data) => {
            if (data?.addExpenseToFolder?.expenses) {
                setLocalExpenses(data.addExpenseToFolder.expenses);
            }
        },
    });

    const handleAddExpense = async (expense: Expense) => {
        await addExpense({
            variables: {
                folderId: folder._id,
                expense,
            },
        });
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>{folder.title}</h3>
            <p style={{ color: "#777" }}>
                Created on: {" "} 
                {folder.createdAt
                    ? new Date(folder.createdAt).toLocaleDateString()
                    : "Unkown"}
            </p>

            {localExpenses.length === 0 ? (
                <p>No expenses added yet.</p>
            ) : (
                <ul style={{ marginBottom: "1rem" }}>
                    {localExpenses.map((expense, idx) => (
                        <li key={idx}>
                            <strong>{expense.category}</strong>: ${expense.amount.toFixed(2)}
                            {expense.description && ` - ${expense.description}`}
                        </li>
                    ))}
                </ul>
            )}

            <ExpenseForm onAdd={handleAddExpense} />
        </div>
    );
};

export default FolderCard;