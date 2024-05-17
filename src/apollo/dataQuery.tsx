import {DocumentNode, gql} from "@apollo/client";

export function getTableData(tableName: string): DocumentNode {
    return gql`
        query GetTableData($tableName: String!) {
            tableData(tableName: $tableName)
        }`;
}
