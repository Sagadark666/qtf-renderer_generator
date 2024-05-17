import React, { useState } from 'react';
import TrayContainer from './components/TrayContainer'

// Define the tables and their exceptions
interface TableConfig {
    id: string;
    name: string;
    exceptions?: string;
}

const tables: TableConfig[] = [ 
  { id: "gc_terreno", name: "Terrenos", exceptions: "t_id,t_basket,t_ili_tid,t_ili2db_basket"},
  { id: "gc_predio", name: "Predios", exceptions: "t_id,t_basket,t_ili_tid,t_ili2db_basket"},
  { id: "gp_usuario", name: "Usuarios", exceptions: "t_id,t_basket,t_ili_tid,t_ili2db_basket"},
];

function App() {
  // Use useState with a generic type parameter for better type inference
  const [selectedTable, setSelectedTable] = useState<TableConfig | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <p>Prototipo de Formularios Dinámicos</p>
      </header>
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
    </div>
  );
}

export default App;
