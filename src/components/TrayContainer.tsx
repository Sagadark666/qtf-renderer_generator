// src/components/TrayContainer.tsx
import React, { ReactNode, useState } from 'react';
import Grid from './Grid'; // Adjust the import path if necessary
import TabbedFormContainer from './FormContainer'; // Adjust the import path if necessary
import { useQuery } from '@apollo/client';
import { getTableMetadata } from '../apollo/metadataQuery';
import { getTableData } from '../apollo/dataQuery';
import { getTableReldata } from '../apollo/reldataQuery';
import WithApolloProvider from '../config/apollo';
import ShadowDomComponent from './ShadowDomComponent';

interface TrayContainerProps {
  tableName: string;
  exceptions?: string;
  customForm?: ReactNode | string;
}

export const TrayContainer: React.FC<TrayContainerProps> = ({ tableName, exceptions, customForm }) => {
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(!showForm);

  const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(tableName, exceptions), {
    variables: { tableName, exceptions },
  });

  const { data: reldata, error: relError } = useQuery(getTableReldata(tableName, exceptions), {
    variables: { tableName, exceptions },
  });

  const { data: rowDataResponse, error: dataError } = useQuery(getTableData(tableName), {
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
                <TabbedFormContainer mainTableName={tableName} formData={metadata} relationships={reldata?.tableRelationship || []} />
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
