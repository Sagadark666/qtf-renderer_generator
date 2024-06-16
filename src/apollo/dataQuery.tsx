import { DocumentNode, gql } from "@apollo/client";

export function getTableData(): DocumentNode {
  return gql`
    query Query($schemaName: String!, $tableName: String!, $columns: [String!]) {
      tableData(schemaName: $schemaName, tableName: $tableName, columns: $columns)
    }
  `;
}

export function getJoinedTableData(): DocumentNode {
  return gql`
    query Query($relationships: [JSON!]!, $tableName: String!, $schemaName: String!) {
      joinedTableData(relationships: $relationships, tableName: $tableName, schemaName: $schemaName)
    }
  `;
}
