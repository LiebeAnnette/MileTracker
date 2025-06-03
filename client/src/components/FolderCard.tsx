import React from "react";
import ExpenseForm from "./ExpenseForm";
import "../../styles/expenseManager.css";


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
        <div className="folder-card">
            <h3>{folder.title}</h3>
            <p className="folder-created">
                Created on: {new Date(Number(folder.createdAt)).toLocaleDateString()}
            </p>
            {folder.expenses.length === 0 ? (
                <p>No expenses added yet.</p>
            ) : (
                <ul className="folder-expense-list">
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