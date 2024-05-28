import React from 'react';
import { Tabs, Tab } from '@mui/material';
import DynamicForm from "./Form";


interface FormContainerProps {
  mainTableName: string;
  formData: any;
  relationships: { tableName: string, columnName: string, referenced_table: string, referencedColumn: string }[];
  onFormSubmit: (formData: Record<string, any>) => void; // Ensure this is updated if necessary
}

const FormContainer: React.FC<FormContainerProps> = ({ mainTableName, relationships, formData, onFormSubmit }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label={mainTableName} />
        {relationships.map((rel, index) => (
          <Tab key={index} label={`${rel.referenced_table}`} />
        ))}
      </Tabs>
      <div>
        {selectedTab === 0 && <DynamicForm tableName={mainTableName} fields={formData} onFormSubmit={onFormSubmit} />}
        {relationships.map((rel, index) => (
          selectedTab === index + 1 && <DynamicForm tableName={rel.referenced_table} key={index} fields={formData} onFormSubmit={onFormSubmit} />
        ))}
      </div>
    </div>
  );
};

export default FormContainer;
