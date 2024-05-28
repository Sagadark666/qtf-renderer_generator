import { DocumentNode, gql } from "@apollo/client";

export function getTableMetadata(): DocumentNode {
    return gql`
        query GetTableMetadata($tableName: String!) {
            tableMetadata(tableName: $tableName) {
                column_name
                data_type
                character_maximum_length
                column_default
                is_nullable
                is_reference
                reference_table
                reference_column
            }
        }
    `;
}
