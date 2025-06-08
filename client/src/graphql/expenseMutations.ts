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

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpenseInFolder(
    $folderId: ID!
    $expenseIndex: Int!
    $category: String!
    $amount: Float!
    $description: String
  ) {
    updateExpenseInFolder(
      folderId: $folderId
      expenseIndex: $expenseIndex
      category: $category
      amount: $amount
      description: $description
    ) {
      _id
      title
      createdAt
      expenses {
        category
        description
        amount
      }
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpenseFromFolder($folderId: ID!, $expenseIndex: Int!) {
    deleteExpenseFromFolder(folderId: $folderId, expenseIndex: $expenseIndex) {
      _id
      title
      createdAt
      expenses {
        category
        description
        amount
      }
    }
  }
`;
