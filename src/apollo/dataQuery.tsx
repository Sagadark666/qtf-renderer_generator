import { DocumentNode, gql } from "@apollo/client";

export function getTableData(): DocumentNode {
  return gql`
    query Query($tableName: String!, $columns: [String!]) {
      tableData(tableName: $tableName, columns: $columns)
    }
  `;
}

export function getJoinedTableData(): DocumentNode {
  return gql`
    query Query($relationships: [JSON!]!, $tableName: String!) {
      joinedTableData(relationships: $relationships, tableName: $tableName)
    }
  `;
}
