import { DocumentNode, gql } from "@apollo/client";

export function getTableData(): DocumentNode {
  return gql`
    query Query($tableName: String!, $columns: [String!]) {
      tableData(tableName: $tableName, columns: $columns)
    }
  `;
}
