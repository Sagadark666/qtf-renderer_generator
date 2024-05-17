import { DocumentNode, gql } from "@apollo/client";

export function getTableMetadata(tableName: string, exceptions?: string): DocumentNode {
    
//    console.log(tableName)
//    console.log(additionalExceptions)
//    const defaultExceptions = "t_id,t_basket,t_ili_tid";
//    
//    const exceptions = additionalExceptions 
//                       ? `${defaultExceptions},${additionalExceptions}`
//                       : defaultExceptions;
//    console.log(exceptions)
    
    return gql`
        query GetTableMetadata($tableName: String!, $exceptions: String) {
            tableMetadata(tableName: $tableName, exceptions: $exceptions) {
                column_name
            }
        }`;
}
