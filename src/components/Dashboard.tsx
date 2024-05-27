import React, { ReactNode, useState } from 'react';
import TrayContainer from './TrayContainer';
import WithApolloProvider from '../config/apollo';

interface TableConfig {
  id: string;
  name: string;
  rExceptions?: string;
  cExceptions?: string;
  customForm?: ReactNode | string;
}

interface QTFDashboardProps {
  tables: TableConfig[];
}

const QTFDashboard: React.FC<QTFDashboardProps> = ({ tables }) => {
  const [selectedTable, setSelectedTable] = useState<TableConfig | null>(null);

  const dashboardStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
  };

  const sidebarStyle: React.CSSProperties = {
    width: '200px',
    background: '#f8f9fa',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  };

  const listItemStyle: React.CSSProperties = {
    listStyle: 'none',
    marginBottom: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px',
    width: '100%',
    cursor: 'pointer',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    textAlign: 'left',
    transition: 'background 0.3s',
  };

  const buttonHoverStyle: React.CSSProperties = {
    background: '#0056b3',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    background: '#f1f1f1',
  };

  return (
    <div style={dashboardStyle}>
      <aside style={sidebarStyle}>
        <ul style={{ padding: 0 }}>
          {tables.map((table, index) => (
            <li key={index} style={listItemStyle}>
              <button
                style={buttonStyle}
                onClick={() => setSelectedTable(table)}
                onMouseOver={(e) => (e.currentTarget.style.background = buttonHoverStyle.background as string)}
                onMouseOut={(e) => (e.currentTarget.style.background = buttonStyle.background as string)}
              >
                {table.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={mainContentStyle}>
        {selectedTable && (
          <TrayContainer
            tableName={selectedTable.id}
            rExceptions={selectedTable.rExceptions}
            cExceptions={selectedTable.cExceptions}
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
