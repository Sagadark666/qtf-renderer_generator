// src/components/QTFDashboard.tsx
import React, { ReactNode, useState } from 'react';
import WithApolloProvider from '../config/apollo';
import './Dashboard.module.css';
import TrayContainer from "./TrayContainer/TrayContainer";

interface TableConfig {
  id: string;
  name: string;
  schema: string;
  exceptions?: string[];
  customForm?: ReactNode | string;
}

interface QTFDashboardProps {
  tables: TableConfig[];
}

const QTFDashboard: React.FC<QTFDashboardProps> = ({ tables }) => {
  const [selectedTable, setSelectedTable] = useState<TableConfig | null>(null);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <ul style={{ padding: 0 }}>
          {tables.map((table, index) => (
            <li key={index} className="list-item">
              <button
                className="button"
                onClick={() => setSelectedTable(table)}
              >
                {table.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        {selectedTable && (
          <TrayContainer
            tableName={selectedTable.id}
            schemaName={selectedTable.schema}
            exceptions={selectedTable.exceptions}
            customForm={selectedTable.customForm}
          />
        )}
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
