import React, { useState, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface GridProps {
    metadata: any;
    rowDataResponse: any[];
    exceptions: string[];
    onRowClicked: (rowData: any) => void; // Add this prop
}

const Grid: React.FC<GridProps> = ({ metadata, rowDataResponse, exceptions, onRowClicked }) => {
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [rowData, setRowData] = useState<any[]>([]);

    useEffect(() => {
        if (metadata && metadata.tableMetadata) {
            const newColDefs = metadata.tableMetadata
                .filter((meta: any) => !exceptions.includes(meta.column_name))
                .map((meta: any) => ({
                    headerName: meta.column_name.toUpperCase(),
                    field: meta.column_name,
                    sortable: true,
                    filter: true,
                    width: getColumnWidth(meta.column_name),
                }));
            setColDefs(newColDefs);
        }
    }, [metadata, exceptions]);

    useEffect(() => {
        if (rowDataResponse) {
            setRowData(rowDataResponse);
        }
    }, [rowDataResponse]);

    const defaultColDef: ColDef = {
        resizable: true,
    };

    const getColumnWidth = (label: string) => {
        const length = label.length;
        const baseWidth = 80;
        const extraWidth = length * 10;
        return baseWidth + extraWidth;
    };

    const onRowClickedHandler = (event: any) => {
        onRowClicked(event.data);
    };

    return (
        <div className={"ag-theme-quartz"} style={{ width: '100%', height: '400px', overflowX: 'auto' }}>
            <AgGridReact 
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                onRowClicked={onRowClickedHandler} // Attach the click handler
            />
        </div>
    );
};

export default Grid;
