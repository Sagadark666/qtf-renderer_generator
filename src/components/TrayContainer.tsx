import React, { ReactNode, useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import './TrayContainer.css';
import { getTableMetadata } from "../apollo/metadataQuery";
import { getTableData } from '../apollo/dataQuery';
import { formatMetadata } from "../mapper/metadataMapper";
import WithApolloProvider from "../config/apollo";
import Grid from './Grid';
import FormContainer from "./FormContainer";

interface TrayContainerProps {
  tableName: string;
  schemaName: string;
  exceptions?: string[];
  customForm?: ReactNode | string;
}

const TrayContainer: React.FC<TrayContainerProps> = ({ schemaName, tableName, exceptions = [], customForm }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);
  const [subformData, setSubformData] = useState<Record<string, any>>({});

  const toggleForm = () => setShowForm(!showForm);

  const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(), {
    variables: { schemaName, tableName },
  });

  const [fetchTableData, { data: rowDataResponse, error: dataError, refetch }] = useLazyQuery(getTableData());

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

      fetchTableData({ variables: { schemaName, tableName } });
    }
  }, [metadata, schemaName, tableName, fetchTableData]);

  const handleFormSubmit = (response: Record<string, any>) => {
    alert(`Formulario cargado! Un nuevo registro ha sido creado existosamente con id: ${response}`);
    setShowForm(false);
    refetch();
  };

  const handleRowClick = async (rowData: any) => {
    setSelectedRowData(rowData);
    setShowForm(true);

    if (metadata) {
      const subformRequests = metadata.tableMetadata
        .filter((field: any) => field.is_reference && rowData[field.column_name])
        .map((field: any) => {
          const where = {
            referenceColumn: "t_id",
            value: rowData[field.column_name],
          };
          return fetchTableData({ variables: { schemaName: field.reference_schema, tableName: field.reference_table, where } });
        });

      const results = await Promise.all(subformRequests);
      const newSubformData = results.reduce((acc, result, index) => {
        const field = metadata.tableMetadata.filter((field: any) => field.is_reference && rowData[field.column_name])[index];
        acc[field.reference_table] = result.data.tableData[0];
        return acc;
      }, {});

      setSubformData(newSubformData);
    }
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
            subformData={subformData} // Pass subform data
          />
        ) : (
          <Grid
            metadata={metadata}
            rowDataResponse={rowDataResponse?.tableData || []}
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
