import React, { useState } from 'react';
import DynamicForm from './Form';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useMutation } from '@apollo/client';
import { insertTableData } from '../apollo/insertQuery';

interface FormContainerProps {
  schemaName: string;
  tableName: string;
  fields: any[]; // Metadata fields
  onFormSubmit: (formData: Record<string, any>) => void;
}

const transformLabel = (tableName: string): string => {
  const parts = tableName.split('_').slice(1); // Remove first part
  const label = parts.join(' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const FormContainer: React.FC<FormContainerProps> = ({ schemaName, tableName, fields, onFormSubmit }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({}); // Holds all form data
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // Holds all form errors

  const [insertData] = useMutation(insertTableData());

  const formFields = fields.filter(field => !field.isReference || (field.isReference && field.isCatalog));
  const tabFields = fields.filter(field => field.isReference && !field.isCatalog);
  const reverseReferences = fields.find(field => field.id === 't_id')?.reverseReferences || [];

  const handleFormChange = (fieldName: string, value: any) => {
    setFormValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
  };

  const validateForm = () => {
    let valid = true;
    let errors: { [key: string]: string } = {};

    fields.forEach((field) => {
      if (!field.isNullable && !formValues[field.field]) {
        valid = false;
        errors[field.field] = `${field.field} es requerido`;
      }
    });

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await insertData({
        variables: { data: { schemaName, tableName, formValues } },
      });
      if (response.data.insertData.success) {
        const recordId = response.data.insertData.id;
        alert(`Formulario cargado! Un nuevo registro ha sido creado existosamente con id: ${recordId}`);
        onFormSubmit(formValues);
      } else {
        console.error('Error submitting form:', response.data.insertData.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

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

  const directReferenceTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: '#e0f7fa', // Light blue
  };

  const reverseReferenceTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: '#fde0dc', // Light red
  };

  const submitContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: '20px',
    };

    const submitStyle: React.CSSProperties = {
      width: '20%',
      padding: '10px 15px',
      backgroundColor: '#405189',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    };

    const submitHoverStyle: React.CSSProperties = {
      backgroundColor: '#323b6a',
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
              style={activeTab === index + 1 ? selectedTabStyle : directReferenceTabStyle}
            >
              {transformLabel(field.referenceTable)}
            </Tab>
          ))}
          {reverseReferences.map((ref: any, index: any) => (
            <Tab
              key={ref.reference_table}
              style={activeTab === index + tabFields.length + 1 ? selectedTabStyle : reverseReferenceTabStyle}
            >
              {transformLabel(ref.reference_table)}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <DynamicForm
            schemaName={schemaName}
            tableName={tableName}
            fields={formFields}
            onFormChange={handleFormChange}
            formValues={formValues}
          />
        </TabPanel>
        {tabFields.map((field, index) => (
          <TabPanel key={field.referenceTable}>
            <p>Content for {transformLabel(field.referenceTable)} goes here.</p>
            {/* Future content or component for each related table */}
          </TabPanel>
        ))}
        {reverseReferences.map((ref: any, index: any) => (
          <TabPanel key={ref.reference_table}>
            <p>Content for {transformLabel(ref.reference_table)} goes here.</p>
            {/* Future content or component for each reverse reference */}
          </TabPanel>
        ))}
      </Tabs>
      <div style={submitContainerStyle}>
        <button
          onClick={handleSubmit}
          style={submitStyle}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = submitHoverStyle.backgroundColor!)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = submitStyle.backgroundColor!)}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default FormContainer;
