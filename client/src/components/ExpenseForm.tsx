import React, { useState } from "react";

interface ExpenseInput {
    category: string;
    amount: number;
    description?: string;
}

interface ExpenseFormProps {
    onAdd: (expense: ExpenseInput) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd }) => {
    const [formState, setFormState] = useState<ExpenseInput>({
        category: "",
        amount: 0,
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: name === "amount" ? parseFloat(value) : value,
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.category || formState.amount <= 0) return;
        onAdd(formState);
        setFormState({ category: "", amount: 0, description: "" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <select 
                name="category"
                value={formState.category}
                onChange={handleChange}
                required
            >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Airfare">Airfare</option>
                <option value="Hotel">Hotel</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Miscellaneous">Miscellaneous</option>
            </select>

            <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formState.amount || ""}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                value={formState.description}
                onChange={handleChange}
            />

            <button type="submit">Add Expense</button>
        </form>
    );
};

export default ExpenseForm;