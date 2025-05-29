import React from "react";
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
    return (
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>{folder.title}</h3>
            <p style={{ color: "#777" }}>
                Created on: {new Date(folder.createdAt).toLocaleDateString()}
            </p>

            {folder.expenses.length === 0 ? (
                <p>No expenses added yet.</p>
            ) : (
                <ul style={{ marginBottom: "1rem" }}>
                    {folder.expenses.map((expense, idx) => (
                        <li key={idx}>
                            <strong>{expense.category}</strong>: ${expense.amount.toFixed(2)}
                            {expense.description && ` - ${expense.description}`}
                        </li>
                    ))}
                </ul>
            )}

            <ExpenseForm folderId={folder._id} />
        </div>
    );
};

export default FolderCard;