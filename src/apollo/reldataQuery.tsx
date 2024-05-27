import { DocumentNode, gql } from "@apollo/client";

export function getTableReldata(): DocumentNode {
    
    return gql`
        query GetTableReldata($tableName: String!, $exceptions: String) {
            tableRelationship(tableName: $tableName, exceptions: $exceptions) {
                constraint_name
                table_name
                column_name
                referenced_table
                referenced_column
            }
        }`;
}
