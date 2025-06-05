import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EXPENSE_FOLDERS } from "../graphql/expenseQueries";
import { ADD_EXPENSE_FOLDER } from "../graphql/expenseMutations";
import FolderCard from "./FolderCard";
import "../../styles/expenseManager.css";


const ExpenseManager: React.FC = () => {
    const [newTitle, setNewTitle] = useState("");

    const { data, loading, error } = useQuery(GET_EXPENSE_FOLDERS);
    const [addExpenseFolder] = useMutation(ADD_EXPENSE_FOLDER, {
        refetchQueries: [{ query: GET_EXPENSE_FOLDERS }],
    });

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await addExpenseFolder({ variables: { title: newTitle } });
            setNewTitle("");
        } catch (err) {
            console.error("Failed to create folder:", err);
        }
    };

    if (loading) return <p>Loading folders...</p>;
    if (error) return <p style={{ color: "red" }}>Error loading folders: {error.message}</p>;

    return (
        <div className="expense-container">
            <h2 className="expense-title">Trip Expense Folders</h2>

            <form onSubmit={handleCreateFolder} className="expense-form">
                <input
                    type="text"
                    placeholder="New trip title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="expense-input"
                />
                <div className="bubble-button-wrapper">
                    <div className="bubble-button">
                        <button type="submit">Create Folder</button>
                    </div>
                </div>
            </form>

            <div className="folder-grid">
                {data.getMyExpenseFolders.map((folder: any) => (
                    <div key={folder._id} className="folder-wrapper">
                        <FolderCard folder={folder} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpenseManager;
