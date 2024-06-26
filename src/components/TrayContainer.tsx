// src/components/TrayContainer.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { getTableMetadata } from '../apollo/metadataQuery';
import { getJoinedTableData } from '../apollo/dataQuery';
import WithApolloProvider from '../config/apollo';
import Grid from './Grid';
import FormContainer from './FormContainer';
import { formatMetadata } from '../mapper/metadataMapper';
import './TrayContainer.css'; // Import the CSS file

interface TrayContainerProps {
  tableName: string;
  schemaName: string;
  exceptions?: string[];
  customForm?: ReactNode | string;
}

const TrayContainer: React.FC<TrayContainerProps> = ({ schemaName, tableName, exceptions = [], customForm }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);

  const toggleForm = () => setShowForm(!showForm);

  const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(), {
    variables: { schemaName, tableName },
  });

  const [fetchJoinedTableData, { data: rowDataResponse, error: dataError, refetch }] = useLazyQuery(getJoinedTableData());

  useEffect(() => {
    if (metadata) {
      const relationships = metadata.tableMetadata.map((field: any) => ({
        columnName: field.column_name,
        isReference: field.column_name === 't_basket' ? false : field.is_reference,
        isCatalog: field.is_catalog,
        referenceSchema: field.reference_schema,
        referenceTable: field.reference_table,
        referenceColumn: field.reference_column,
        reverseReferences: field.reverse_references || [],
      }));

      fetchJoinedTableData({ variables: { schemaName, tableName, relationships } });
    }
  }, [metadata, schemaName, tableName, fetchJoinedTableData]);

  const handleFormSubmit = (response: Record<string, any>) => {
    alert(`Formulario cargado! Un nuevo registro ha sido creado existosamente con id: ${response}`);
    setShowForm(false);
    refetch();
  };

  const handleRowClick = (rowData: any) => {
    setSelectedRowData(rowData);
    setShowForm(true);
  };

  if (metaLoading || !metadata || !rowDataResponse) return <p>Loading...</p>;
  if (metaError) return <p>Error: {metaError.message}</p>;
  if (dataError) return <p>Error: {dataError.message}</p>;

  const formattedMetadata = formatMetadata(metadata.tableMetadata);

  return (
    <div className="tray-container">
      <div className="tray-card">
        {showForm ? (
          <span className="tray-text">Agregar Nuevo</span>
        ) : (
          <button
            onClick={() => { setShowForm(true); setSelectedRowData(null); }}
            className="tray-button tray-new-button"
          >
            <i className="ri-file-add-line tray-icon"></i>
            Agregar Nuevo
          </button>
        )}
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className="tray-button tray-cancel-button"
          >
            <i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i>
            Cancelar
          </button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {showForm ? (
          <FormContainer
            schemaName={schemaName}
            tableName={tableName}
            fields={formattedMetadata}
            onFormSubmit={handleFormSubmit}
            initialValues={selectedRowData || {}}
          />
        ) : (
          <Grid
            metadata={metadata}
            rowDataResponse={rowDataResponse?.joinedTableData || []}
            exceptions={exceptions}
            onRowClicked={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

const TrayContainerWithProvider: React.FC<TrayContainerProps> = (props) => {
  return (
    <WithApolloProvider>
      <TrayContainer {...props} />
    </WithApolloProvider>
  );
};

export default TrayContainerWithProvider;
