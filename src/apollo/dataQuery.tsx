import {DocumentNode, gql} from "@apollo/client";

export function getTableData(): DocumentNode {
    return gql`
        query GetTableData($tableName: String!) {
            tableData(tableName: $tableName)
        }`;
}
