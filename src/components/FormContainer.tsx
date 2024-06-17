import React, { useState } from 'react';
import DynamicForm from './Form';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface FormContainerProps {
  schemaName: string;
  tableName: string;
  fields: any[]; // Metadata fields
  onFormSubmit: (formData: Record<string, any>) => void;
}

// Function to transform tab label
const transformLabel = (tableName: string): string => {
  const parts = tableName.split('_').slice(1); // Remove first part
  const label = parts.join(' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const FormContainer: React.FC<FormContainerProps> = ({ schemaName, tableName, fields, onFormSubmit }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Filter fields
  const formFields = fields.filter(field => !field.isReference || (field.isReference && field.isCatalog));
  const tabFields = fields.filter(field => field.isReference && !field.isCatalog);

  // Styles for the container and tabs
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const tabsStyle: React.CSSProperties = {
    display: 'block',
  };

  const tabListStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0',
    margin: '0 0 20px 0',
    listStyleType: 'none',
    borderBottom: '1px solid #ddd',
  };

  const tabStyle: React.CSSProperties = {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginRight: '10px',
    fontWeight: 'bold',
    color: '#405189',
  };

  const selectedTabStyle: React.CSSProperties = {
    ...tabStyle,
    borderBottom: '2px solid #405189',
  };

  return (
    <div style={containerStyle}>
      <Tabs selectedIndex={activeTab} onSelect={(index: any) => setActiveTab(index)} style={tabsStyle}>
        <TabList style={tabListStyle}>
          <Tab style={activeTab === 0 ? selectedTabStyle : tabStyle}>
            {transformLabel(tableName)}
          </Tab>
          {tabFields.map((field, index) => (
            <Tab
              key={field.referenceTable}
              style={activeTab === index + 1 ? selectedTabStyle : tabStyle}
            >
              {transformLabel(field.referenceTable)}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <DynamicForm
            schemaName={schemaName}
            tableName={tableName}
            fields={formFields}
            onFormSubmit={onFormSubmit}
          />
        </TabPanel>
        {tabFields.map((field, index) => (
          <TabPanel key={field.referenceTable}>
            <p>Content for {transformLabel(field.referenceTable)} goes here.</p>
            {/* Future content or component for each related table */}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default FormContainer;
