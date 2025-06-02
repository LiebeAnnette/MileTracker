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
    mutation AddExpenseToFolder(
        $folderId: ID!
        $category: String!
        $amount: Float!
        $description: String
    ) {
        addExpenseToFolder(
            folderId: $folderId
            category: $category
            amount: $amount
            description: $description
        ) {
        _id
        title
        expenses {
            category
            description
            amount
        }
      }
    }
`;