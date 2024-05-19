// src/components/QTFDashboard.tsx
import React, { useState } from 'react';
import TrayContainer from "./TrayContainer";
import WithApolloProvider from "../config/apollo";

interface TableConfig {
        id: string;
        name: string;
        exceptions?: string;
}

interface QTFDashboardProps {
        tables: TableConfig[];
}

const QTFDashboard: React.FC<QTFDashboardProps> = ({ tables }) => {
    const [selectedTable, setSelectedTable] = useState<TableConfig | null>(null);

    return (
        <div style={{ display: 'flex' }}>
            <aside style={{ width: '200px', background: '#f0f0f0' }}>
                <ul style={{ listStyle: 'none', padding: '20px' }}>
                    {tables.map((table, index) => (
                        <li key={index}>
                            <button
                                style={{ padding: '10px', width: '100%', cursor: 'pointer' }}
                                onClick={() => setSelectedTable(table)}
                            >
                                {table.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main style={{ flex: 1 }}>
                {selectedTable &&
                    <TrayContainer tableName={selectedTable.id} exceptions={selectedTable.exceptions} />
                }
            </main>
        </div>
    );
};

// Wrap QTFDashboard with the Apollo provider
const QTFDashboardWithProvider: React.FC<QTFDashboardProps> = (props) => {
    return (
        <WithApolloProvider>
            <QTFDashboard {...props} />
        </WithApolloProvider>
    );
};

export default QTFDashboardWithProvider;
