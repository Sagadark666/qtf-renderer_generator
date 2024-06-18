export interface MetadataField {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  column_default: any;
  is_nullable: boolean;
  is_reference: boolean;
  is_catalog: boolean;
  reference_schema?: string;
  reference_table?: string;
  reference_column?: string;
  reverse_references?: Array<{
    reference_schema: string;
    reference_table: string;
    reference_column: string;
  }>;
}

export interface FormattedMetadataField {
  id: string;
  field: string;
  maxLength: number | null;
  dataType: string;
  isNullable: boolean;
  default: any;
  isReference: boolean;
  isCatalog: boolean;
  referenceSchema?: string;
  referenceTable?: string;
  referenceColumn?: string;
  reverseReferences: Array<{
    referenceSchema: string;
    referenceTable: string;
    referenceColumn: string;
  }>;
}
