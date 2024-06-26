import React, { ReactNode, useState } from 'react';
import TrayContainer from './TrayContainer';
import WithApolloProvider from '../config/apollo';
import './Dashboard.css';

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
        <ul className="list">
          {tables.map((table, index) => (
            <li key={index} className="listItem">
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
      <main className="mainContent">
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
