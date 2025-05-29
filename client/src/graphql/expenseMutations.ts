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
    mutation AddExpense(
        $folderID: ID!
        $category: String!
        $amount: Float!
        $description: String
    ) {
        addExpense(
            folderID: $folderID
            category: $category
            amount: $amount
            description: $description
        ) {
        _id
        title
        expense {
            category
            description
            amount
        }
      }
    }
`;