import { DocumentNode, gql } from "@apollo/client";

export function insertTableData(): DocumentNode {
  return gql`
    mutation InsertData($data: InsertInput!) {
      insertData(data: $data) {
        success
        message
        id
        }
    }`;
}
