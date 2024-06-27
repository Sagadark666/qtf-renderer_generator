import { DocumentNode, gql } from "@apollo/client";

export function getTableData(): DocumentNode {
  return gql`
    query Query($schemaName: String!, $tableName: String!, $columns: [String!], $where: JSON) {
      tableData(schemaName: $schemaName, tableName: $tableName, columns: $columns, where: $where)
    }
  `;
}

export function getJoinedTableData(): DocumentNode {
  return gql`
    query Query($relationships: [JSON!]!, $tableName: String!, $schemaName: String!, $where: JSON) {
      joinedTableData(relationships: $relationships, tableName: $tableName, schemaName: $schemaName, where: $where)
    }
  `;
}
