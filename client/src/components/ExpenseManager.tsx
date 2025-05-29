import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EXPENSE_FOLDERS } from "../graphql/expenseQueries";
import { ADD_EXPENSE_FOLDER } from "../graphql/expenseMutations";
import FolderCard from "./FolderCard";

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

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Trip Expense Folders</h2>

            <form onSubmit={handleCreateFolder} style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="New trip title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                />
                <button type="submit">Create Folder</button>
            </form>

            {loading ? (
                <p>Loading folder...</p>
            ) : error ? (
                <p>Error loading folders: {error.message}</p>
            ) : data?.getMyExpenseFolders.length === 0 ? (
                <p>No folders yet. Create your first one!</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {data.getMyExpenseFolders.map((folder: any) => (
                        <FolderCard key={folder._id} folder={folder} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseManager;
