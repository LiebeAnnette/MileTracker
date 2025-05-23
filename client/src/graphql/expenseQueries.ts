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