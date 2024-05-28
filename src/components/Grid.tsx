import React, { useState, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface GridProps {
    metadata: any
    rowDataResponse: any
}

const Grid: React.FC<GridProps> = ({ metadata, rowDataResponse }) => {
    
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [rowData, setRowData] = useState<any[]>([]);  // Define state for rowData here

    useEffect(() => {
        if (metadata && metadata.tableMetadata) {
            const newColDefs = metadata.tableMetadata.map((meta: any) => ({
                headerName: meta.column_name.toUpperCase(),
                field: meta.column_name,
                sortable: true,
                filter: true,
                width: getColumnWidth(meta.column_name) // Dynamically set the column width
            }));
            setColDefs(newColDefs);
        }
    }, [metadata]);

    useEffect(() => {
        if (rowDataResponse && rowDataResponse.tableData) {
            setRowData(rowDataResponse.tableData);
        }
    }, [rowDataResponse]);

    const defaultColDef: ColDef = {
        resizable: true, // Allow columns to be resizable
    };

    const getColumnWidth = (label: string) => {
        const length = label.length;
        const baseWidth = 50; // Base width for columns
        const extraWidth = length * 10; // Adjust the multiplier as needed for label length
        return baseWidth + extraWidth;
    };

    return (
        <div className={"ag-theme-quartz"} style={{ width: '100%', height: '400px', overflowX: 'auto' }}>
            <AgGridReact 
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
            />
        </div>
    );
};

export default Grid;
