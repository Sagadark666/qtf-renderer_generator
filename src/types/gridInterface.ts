export interface TableMetadata {
    column_name: string;
    data_type: string;
    character_maximum_length: number;
    column_default: string | null;
    is_nullable: string;  // Typically 'YES' or 'NO'
}