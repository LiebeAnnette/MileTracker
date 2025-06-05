import { gql } from "@apollo/client";

export const GET_EXPENSE_FOLDERS = gql`
    query GetMyExpenseFolders {
      getMyExpenseFolders {
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

export const CREATE_EXPENSE_FOLDER = gql`
  mutation CreateExpenseFolder($title: String!) {
    addExpenseFolder(title: $title) {
      _id
      title
      createdAt
    }
  }
`;