import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import ExpenseForm from "./ExpenseForm";
import { DELETE_EXPENSE, UPDATE_EXPENSE } from "../graphql/expenseMutations";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
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
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(folder.expenses);
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Expense>({
    category: "",
    amount: 0,
    description: "",
  });

  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: (data) => {
      setLocalExpenses(data.deleteExpenseFromFolder.expenses);
    },
    onError: (error) => {
      console.error("Failed to delete expense:", error.message);
    },
  });

  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    onCompleted: (data) => {
      setLocalExpenses(data.updateExpenseInFolder.expenses);
      setEditingIndex(null);
    },
    onError: (error) => {
      console.error("Failed to update expense:", error.message);
    },
  });

  useEffect(() => {
    setLocalExpenses(folder.expenses);
    }, [folder.expenses]);

  const handleDelete = (index: number) => {
    deleteExpense({
      variables: {
        folderId: folder._id,
        expenseIndex: index,
      },
    });
  };

  const startEditing = (index: number) => {
    const expense = localExpenses[index];
    setEditingIndex(index);
    setEditValues({ ...expense });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValues({ category: "", amount: 0, description: "" });
  };

  const handleUpdate = () => {
    if (editingIndex === null) return;

    updateExpense({
      variables: {
        folderId: folder._id,
        expenseIndex: editingIndex,
        category: editValues.category,
        amount: editValues.amount,
        description: editValues.description,
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
              {editingIndex === idx ? (
                <>
                  <select
                    value={editValues.category}
                    onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                  >
                    <option value="Airfare">Airfare</option>
                    <option value="Food">Food</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  <input
                    type="number"
                    value={editValues.amount}
                    onChange={(e) => setEditValues({ ...editValues, amount: parseFloat(e.target.value) })}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={editValues.description || ""}
                    onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  />
                  <button onClick={handleUpdate} title="Save">
                    <FaSave />
                  </button>
                  <button onClick={cancelEditing} title="Cancel">
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <strong>{expense.category}</strong>: ${expense.amount.toFixed(2)}
                  {expense.description && ` - ${expense.description}`}
                  <button onClick={()  => startEditing(idx)} title="Edit">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(idx)} title="Delete" className="delete-expense-btn">
                    <FaTrash size={14} color="red" />
                  </button>
                </>
              )}
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