import { gql } from "@apollo/client";

export const ADD_EXPENSE_FOLDER = gql`
    mutation AddExpenseFolder($title: String!) {
        addExpenseFolder(title: $title) {
            _id
            title
            createdAt
        }
    }
`;

export const ADD_EXPENSE = gql`
    mutation AddExpenseToFolder($folderId: ID!, $expense: ExpenseInput!) {
        addExpenseToFolder(folderId: $folderId, expense: $expense) {
            _id
            title
            createdAt
            expenses {
                category
                amount
                description
            }
        }
    }
`;