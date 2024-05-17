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
                filter: true
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
        flex: 1,
    };

    return (
        <div className={"ag-theme-quartz"} style={{ width: '100%', height: '685px' }}>
            <AgGridReact 
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
            />
        </div>
    );
};

export default Grid;
