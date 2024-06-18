import { DocumentNode, gql } from "@apollo/client";

export function getTableMetadata(): DocumentNode {
    return gql`
        query GetTableMetadata($schemaName: String!, $tableName: String!) {
            tableMetadata(schemaName: $schemaName, tableName: $tableName) {
                column_name
                data_type
                character_maximum_length
                column_default
                is_nullable
                is_reference
                is_catalog
                reference_schema
                reference_table
                reference_column
                reverse_references {
                    reference_column
                    reference_schema
                    reference_table
                }
            }
        }
    `;
}

export function getRelatedTableMetadata(): DocumentNode {
    return gql`
        query GetTableMetadata($schemaName: String!, $tableName: String!) {
            tableMetadata(schemaName: $schemaName, tableName: $tableName) {
                column_name
                data_type
                character_maximum_length
                column_default
                is_nullable
                is_reference
                is_catalog
                reference_schema
                reference_table
                reference_column
            }
        }
    `;
}
