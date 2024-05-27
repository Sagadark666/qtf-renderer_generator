import React, { ReactNode, useState } from 'react';
import Grid from './Grid';
import TabbedFormContainer from './FormContainer';
import { useQuery } from '@apollo/client';
import { getTableMetadata } from '../apollo/metadataQuery';
import { getTableData } from '../apollo/dataQuery';
import { getTableReldata } from '../apollo/reldataQuery';
import WithApolloProvider from '../config/apollo';
import ShadowDomComponent from './ShadowDomComponent';

interface TrayContainerProps {
  tableName: string;
  rExceptions?: string;
  cExceptions?: string;
  customForm?: ReactNode | string;
}

export const TrayContainer: React.FC<TrayContainerProps> = ({ tableName, rExceptions, cExceptions, customForm }) => {
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(!showForm);

  const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(), {
    variables: { tableName, exceptions: cExceptions },
  });

  const { data: reldata, error: relError } = useQuery(getTableReldata(), {
      variables: { tableName, exceptions: rExceptions },
});

const { data: rowDataResponse, error: dataError } = useQuery(getTableData(), {
    variables: { tableName },
});

const handleFormSubmit = (formData: Record<string, any>) => {
    console.log('Form submitted:', formData);
    alert('Form submitted! Check the console for details.');
};

if (metaLoading || !metadata || !rowDataResponse) return <p>Loading...</p>;
if (metaError) return <p>Error: {metaError.message}</p>;
if (relError) return <p>Error: {relError.message}</p>;
if (dataError) return <p>Error: {dataError.message}</p>;

const formattedMetadata = metadata.tableMetadata.map((field: any) => ({
    id: field.column_name,
    field: field.column_name,
    maxLength: field.character_maximum_length,
    dataType: field.data_type,
    isNullable: field.is_nullable,
    default: field.column_default
}));

return (
    <div>
        <button onClick={toggleForm}>{showForm ? 'Cancelar' : 'Nuevo Registro'}</button>
        {showForm ? (
            customForm ? (
                typeof customForm === 'string' ? (
                    <ShadowDomComponent htmlContent={customForm} onSubmit={handleFormSubmit} />
                ) : (
                    customForm
                )
            ) : (
                <TabbedFormContainer mainTableName={tableName} formData={formattedMetadata} relationships={reldata?.tableRelationship || []} />
            )
        ) : (
            <Grid metadata={metadata} rowDataResponse={rowDataResponse} />
        )}
    </div>
);
};

// Wrap TrayContainer with the Apollo provider
const TrayContainerWithProvider: React.FC<TrayContainerProps> = (props) => {
return (
    <WithApolloProvider>
        <TrayContainer {...props} />
    </WithApolloProvider>
);
};

export default TrayContainerWithProvider;
