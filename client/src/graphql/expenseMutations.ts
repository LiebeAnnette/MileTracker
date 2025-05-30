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

export const ADD_EXPENSE = gql `
    mutation AddExpenseToFolder($folderID: ID!, $expense: ExpenseInput!) {
        addExpenseToFolder(folderID: $folderId, expense: $expense) {
            _id
            title
            expense {
                category
                amount
                description
                }
            }
        }
    }
`;