import { FormattedMetadataField, MetadataField } from "../types/metadataInterface";

export function formatMetadata(fields: MetadataField[]): FormattedMetadataField[] {
  return fields.map((field) => ({
    id: field.column_name,
    field: field.column_name,
    maxLength: field.character_maximum_length,
    dataType: field.data_type,
    isNullable: field.is_nullable,
    default: field.column_default,
    isReference: field.is_reference,
    isCatalog: field.is_catalog,
    referenceSchema: field.reference_schema,
    referenceTable: field.reference_table,
    referenceColumn: field.reference_column,
    reverseReferences: field.reverse_references?.map(ref => ({
      referenceSchema: ref.reference_schema,
      referenceTable: ref.reference_table,
      referenceColumn: ref.reference_column
    })) || [],
  }));
}
