import React, { useState } from 'react';
import Grid from './Grid'; // Assume this is the path to your Grid component
import TabbedFormContainer from './FormContainer'; // New component
import { useQuery } from '@apollo/client';
import { getTableMetadata } from '../apollo/metadataQuery';
import { getTableData } from '../apollo/dataQuery';
import { getTableReldata } from '../apollo/reldataQuery';

interface TrayContainerProps {
    tableName: string;
    exceptions?: string;
}

const TrayContainer: React.FC<TrayContainerProps> = ({ tableName, exceptions }) => {
    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => setShowForm(!showForm);
    
    const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(tableName, exceptions), {
        variables: {
            tableName,
            exceptions
        }
    });
    
    const { data: reldata, error: relError } = useQuery(getTableReldata(tableName, exceptions), {
        variables: {
            tableName,
            exceptions
        }
    });
    
    const { data: rowDataResponse, error: dataError } = useQuery(getTableData(tableName), {
        variables: { tableName }
    });
    
    if (metaLoading) return <p>Loading...</p>;
    if (metaError) return <p>Error: {metaError.message}</p>;
    if (relError) return <p>Error: {relError.message}</p>;
    if (dataError) return <p>Error: {dataError.message}</p>;

    return (
        <div>
            <button onClick={toggleForm}>
                {showForm ? 'Cancelar' : 'Nuevo Registro'} {/* Change labels for clarity */}
            </button>
            {showForm ? 
                <TabbedFormContainer mainTableName={tableName} relationships={reldata?.tableRelationship || []} /> 
                : 
                <Grid metadata={metadata} rowDataResponse={rowDataResponse} />
            }
        </div>
    );
};

export default TrayContainer;
