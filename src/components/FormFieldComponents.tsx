import React, {useEffect, useState } from 'react';
import Modal from './Modal';
import './FormFieldComponents.css';
import Grid from './Grid';
import {transformLabel} from "../mapper/LabelMapper";
import { formatMetadata } from '../mapper/metadataMapper';
import {useLazyQuery, useQuery } from '@apollo/client';
import {getTableMetadata} from "../apollo/metadataQuery";
import { getJoinedTableData } from '../apollo/dataQuery';
const commonStyle = "common-style";

export const TextField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="number" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const DateField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
    const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';
    return (
        <input type="date" name={name} value={formattedValue} onChange={onChange} className={commonStyle} disabled={disabled} />
    );
};

export const EmailField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <input type="email" name={name} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const CheckboxField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <input type="checkbox" name={name} checked={value || false} onChange={onChange} disabled={disabled} />
);

export const DateTimeField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
    const formattedValue = value ? new Date(value).toISOString().slice(0, 16) : '';
    return (
        <input type="datetime-local" name={name} value={formattedValue} onChange={onChange} className={commonStyle} disabled={disabled} />
    );
};

export const IdField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onIconClick: () => void; disabled?: boolean; tableName: string; tableSchema: string }> = ({ name, maxLength, value, onChange, onIconClick, disabled, tableName, tableSchema }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<any[]>([]);

    const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(), {
        variables: { schemaName: tableSchema, tableName },
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

            fetchJoinedTableData({ variables: { schemaName: tableSchema, tableName, relationships } });
        }
    }, [metadata, tableSchema, tableName, fetchJoinedTableData]);

    const handleRowSelection = (selectedRow: any) => {
        for (const key in selectedRow) {
            const event = { target: { name: key, value: selectedRow[key] } } as React.ChangeEvent<HTMLInputElement>;
            onChange(event); // Ensure this updates the form value correctly
        }
        setModalOpen(false);
    };



    if (metaLoading || !metadata || !rowDataResponse) return <p>Loading...</p>;
    if (metaError) return <p>Error: {metaError.message}</p>;
    if (dataError) return <p>Error: {dataError.message}</p>;

    const formattedMetadata = formatMetadata(metadata.tableMetadata);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
            <button type="button" onClick={() => setModalOpen(true)} style={{ marginLeft: '8px' }}>🔍</button>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Seleccione un/a ${transformLabel(tableName)}`}>
                <Grid
                    metadata={metadata}
                    rowDataResponse={rowDataResponse?.joinedTableData || []}
                    exceptions={['t_basket', 't_ili_tid']} // Provide any exceptions if needed
                    onRowClicked={handleRowSelection}
                />
            </Modal>
        </div>
    );
};
