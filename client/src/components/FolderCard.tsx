import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import ExpenseForm from "./ExpenseForm";
import { DELETE_EXPENSE } from "../graphql/expenseMutations";
import "../../styles/expenseManager.css";
import { FaTrash } from "react-icons/fa";



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
  
  useEffect(() => {
    setLocalExpenses(folder.expenses);
    }, [folder.expenses]);


  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: (data) => {
      setLocalExpenses(data.deleteExpenseFromFolder.expenses);
    },
    onError: (error) => {
      console.error("Failed to delete expense:", error);
    },
  });

  const handleDelete = (index: number) => {
    console.log("Deleting expense for index", index);
    console.log("folderId:", folder._id);
    console.log("Variables", {
        folderId: folder._id,
        expenseIndex: index,
    });
    deleteExpense({
      variables: {
        folderId: folder._id,
        expenseIndex: index,
      },
    });
  };

    const totalCost = localExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="folder-card">
            <h3>{folder.title}</h3>
            <p className="folder-created">
                Created on: {new Date(Number(folder.createdAt)).toLocaleDateString()}
            </p>

            {localExpenses.length === 0 ? (
                <p>No expenses added yet.</p>
            ) : (
                <ul className="folder-expense-list">
                    {localExpenses.map((expense, idx) => (
                        <li key={idx}>
                            <strong>{expense.category}</strong>: ${expense.amount.toFixed(2)}
                            {expense.description && ` - ${expense.description}`}
                            <button
                                className="delete-expense-btn"
                                onClick={() => handleDelete(idx)}
                                title="Delete"
                            >
                                <FaTrash size={14} color="red" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="folder-total">
                <strong>Total:</strong> ${totalCost.toFixed(2)}
            </div>
            <ExpenseForm folderId={folder._id} />
        </div>
    );
};

export default FolderCard;