import React, { useState, useRef, useEffect } from 'react';
import DynamicForm from './DynamicForm';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useMutation } from '@apollo/client';
import { insertTableData } from '../apollo/insertQuery';

interface FormContainerProps {
  schemaName: string;
  tableName: string;
  fields: any[]; // Metadata fields
  onFormSubmit: (formData: Record<string, any>) => void;
  initialValues?: { [key: string]: any }; // Add this prop
}

const transformLabel = (tableName: string | undefined): string => {
  if (!tableName) {
    console.warn("transformLabel: Received undefined or empty tableName");
    return "Unknown"; // Provide a default label to avoid errors
  }
  const parts = tableName.split('_').slice(1); // Remove first part
  const label = parts.join(' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const FormContainer: React.FC<FormContainerProps> = ({ schemaName, tableName, fields, onFormSubmit, initialValues = {} }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>(initialValues); // Initialize with initialValues
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [tabErrors, setTabErrors] = useState<{ [key: number]: boolean }>({});

  const formRefs = useRef<{ [key: number]: any }>({});

  const [insertData] = useMutation(insertTableData());

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const formFields = fields.filter(field => !field.isReference || (field.isReference && field.isCatalog));
  const tabFields = fields.filter(field => field.isReference && !field.isCatalog);
  const reverseReferences = fields.find(field => field.id === 't_id')?.reverseReferences || [];

  const handleFormChange = (fieldName: string, value: any, tabIndex: number) => {
    setFormValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
    setTabErrors((prevErrors) => ({ ...prevErrors, [tabIndex]: false }));
  };

  const validateForm = (fieldsToValidate: any[], tabIndex: number) => {
    let valid = true;
    let errors: { [key: string]: string } = {};

    fieldsToValidate.forEach((field) => {
      if (!field.isNullable && !formValues[field.field]) {
        valid = false;
        errors[field.field] = `${field.field} es requerido`;
      }
    });

    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    setTabErrors((prevErrors) => ({ ...prevErrors, [tabIndex]: !valid }));

    return valid;
  };

  const validateCurrentTab = async (index: number) => {
    const currentFields = fieldsForTab(index);
    if (Array.isArray(currentFields)) {
      return validateForm(currentFields, index);
    } else {
      console.error('Fields for tab are not an array:', currentFields);
      return false;
    }
  };

  const validateAllTabs = async () => {
    let allValid = true;
    let newTabErrors: { [key: number]: boolean } = {};

    const tabsToValidate = [0, ...Array.from({ length: tabFields.length }, (_, i) => i + 1), ...Array.from({ length: reverseReferences.length }, (_, i) => i + tabFields.length + 1)];

    for (const tabIndex of tabsToValidate) {
      const valid = await validateCurrentTab(tabIndex);
      newTabErrors[tabIndex] = !valid;
      allValid = allValid && valid;
    }

    setTabErrors(newTabErrors);

    return allValid;
  };

  const handleSubmit = async () => {
    const allTabsValid = await validateAllTabs();

    if (!allTabsValid) {
      return;
    }

    try {
      const response = await insertData({
        variables: { data: { schemaName, tableName, formValues } },
      });
      if (response.data.insertData.success) {
        const recordId = response.data.insertData.id;
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
    display: 'flex',
    alignItems: 'center',
  };

  const selectedTabStyle: React.CSSProperties = {
    ...tabStyle,
    borderBottom: '2px solid #405189',
  };

  const tabErrorStyle: React.CSSProperties = {
    color: 'red',
    marginLeft: '10px',
    fontWeight: 'bold',
  };

  const directReferenceTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: '#e0f7fa',
  };

  const reverseReferenceTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: '#fde0dc',
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

  const handleTabSwitch = (index: number) => {
    setActiveTab(index);
    return true;
  };

  const fieldsForTab = (tabIndex: number): any[] => {
    if (tabIndex === 0) return formFields;
    if (tabIndex <= tabFields.length) return [tabFields[tabIndex - 1]] || [];
    const reverseRefIndex = tabIndex - tabFields.length - 1;
    return [reverseReferences[reverseRefIndex]] || [];
  };

  const getFormErrorsForTab = (fieldsForTab: any[], formErrors: { [key: string]: string }) => {
    const formErrorsForTab: { [key: string]: string } = {};
    if (Array.isArray(fieldsForTab)) {
      fieldsForTab.forEach(field => {
        if (formErrors[field.field]) {
          formErrorsForTab[field.field] = formErrors[field.field];
        }
      });
    } else {
      console.error('fieldsForTab is not an array:', fieldsForTab);
    }
    return formErrorsForTab;
  };

  return (
    <div style={containerStyle}>
      <Tabs selectedIndex={activeTab} onSelect={handleTabSwitch} style={tabsStyle}>
        <TabList style={tabListStyle}>
          <Tab style={activeTab === 0 ? selectedTabStyle : tabStyle}>
            {transformLabel(tableName)}
            {tabErrors[0] && <span style={tabErrorStyle}>!</span>}
          </Tab>
          {tabFields.map((field, index) => (
            <Tab
              key={field.referenceTable}
              style={activeTab === index + 1 ? selectedTabStyle : directReferenceTabStyle}
            >
              {transformLabel(field.referenceTable)}
              {tabErrors[index + 1] && <span style={tabErrorStyle}>!</span>}
            </Tab>
          ))}
          {reverseReferences.map((ref: any, index: any) => (
            <Tab
              key={ref.referenceTable}
              style={activeTab === index + tabFields.length + 1 ? selectedTabStyle : reverseReferenceTabStyle}
            >
              {transformLabel(ref.referenceTable)}
              {tabErrors[index + tabFields.length + 1] && <span style={tabErrorStyle}>!</span>}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <DynamicForm
            schemaName={schemaName}
            tableName={tableName}
            fields={formFields}
            onFormChange={(fieldName, value) => handleFormChange(fieldName, value, 0)}
            formValues={formValues}
            ref={(ref) => (formRefs.current[0] = ref)}
            formErrors={getFormErrorsForTab(formFields, formErrors)} // Pass specific formErrors for this tab
          />
        </TabPanel>
        {tabFields.map((field, index) => (
          <TabPanel key={field.referenceTable}>
            <DynamicForm
              schemaName={field.referenceSchema}
              tableName={field.referenceTable}
              fields={undefined} // No fields passed, DynamicForm will fetch metadata
              onFormChange={(fieldName, value) => handleFormChange(fieldName, value, index + 1)}
              formValues={formValues}
              ref={(ref) => (formRefs.current[index + 1] = ref)}
              formErrors={getFormErrorsForTab(fieldsForTab(index + 1), formErrors)} // Pass specific formErrors for this tab
            />
          </TabPanel>
        ))}
        {reverseReferences.map((ref: any, index: any) => (
          <TabPanel key={ref.referenceTable}>
            <DynamicForm
              schemaName={ref.referenceSchema}
              tableName={ref.referenceTable}
              fields={undefined} // No fields passed, DynamicForm will fetch metadata
              onFormChange={(fieldName, value) => handleFormChange(fieldName, value, index + tabFields.length + 1)}
              formValues={formValues}
              ref={(ref) => (formRefs.current[index + tabFields.length + 1] = ref)}
              formErrors={getFormErrorsForTab(fieldsForTab(index + tabFields.length + 1), formErrors)} // Pass specific formErrors for this tab
            />
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
