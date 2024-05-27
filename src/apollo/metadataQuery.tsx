import { DocumentNode, gql } from "@apollo/client";

export function getTableMetadata(): DocumentNode {
    return gql`
        query GetTableMetadata($tableName: String!, $exceptions: String) {
            tableMetadata(tableName: $tableName, exceptions: $exceptions) {
                column_name
                column_default
                data_type
                is_nullable
                character_maximum_length
            }
        }
    `;
}
