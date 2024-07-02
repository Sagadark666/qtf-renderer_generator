import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useMutation } from '@apollo/client';
import './FormContainer.css';
import DynamicForm from "./DynamicForm";
import { insertTableData } from "../apollo/insertQuery";
import { transformLabel } from "../mapper/LabelMapper";

interface FieldInterface {
  id: string;
  field: string;
  maxLength: number | null;
  dataType: string;
  isNullable: boolean;
  default: any;
  isReference: boolean;
  isCatalog: boolean;
  referenceSchema?: string;
  referenceTable?: string;
  referenceColumn?: string;
  reverseReferences?: any[];
}

interface FormContainerProps {
  schemaName: string;
  tableName: string;
  fields: FieldInterface[]; // Metadata fields
  onFormSubmit: (formData: Record<string, any>) => void;
  initialValues?: { [key: string]: any };
  subformData?: Record<string, any>; // Add this prop
}

const FormContainer: React.FC<FormContainerProps> = ({ schemaName, tableName, fields, onFormSubmit, initialValues = {}, subformData = {} }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>(initialValues);
  const [subformValues, setSubformValues] = useState<Record<string, { [key: string]: any }>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [subformErrors, setSubformErrors] = useState<Record<string, { [key: string]: string }>>({});
  const [tabErrors, setTabErrors] = useState<{ [key: number]: boolean }>({});

  const formRefs = useRef<{ [key: number]: any }>({});

  const [insertData] = useMutation(insertTableData());

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    setSubformValues(subformData);
  }, [subformData]);

  const formFields = fields.filter(field => !field.isReference || (field.isReference && field.isCatalog));
  const tabFields = fields.filter(field => field.isReference && !field.isCatalog);
  const reverseReferences = fields.find(field => field.id === 't_id')?.reverseReferences || [];

  // Ensure formErrors are properly initialized and maintained as flat structures or properly managed.
  const handleFormChange = (fieldName: string, value: any, tabIndex?: number) => {
    if (tabIndex === undefined || tabIndex === 0) {
      setFormValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
      setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
    } else {
      const tabKey = tabFields[tabIndex - 1]?.referenceTable || reverseReferences[tabIndex - tabFields.length - 1]?.referenceTable;
      if (tabKey) {
        setSubformValues((prevValues) => ({
          ...prevValues,
          [tabKey]: { ...(prevValues[tabKey] || {}), [fieldName]: value }
        }));
        setSubformErrors((prevErrors) => ({
          ...prevErrors,
          [tabKey]: { ...(prevErrors[tabKey] || {}), [fieldName]: '' }
        }));
      }
    }
    if (tabIndex !== undefined) {
      setTabErrors((prevErrors) => ({ ...prevErrors, [tabIndex]: false }));
    }
  };

  const validateForm = (fieldsToValidate: FieldInterface[], formValues: Record<string, any>, formErrors: Record<string, any>): { valid: boolean, errors: Record<string, string> } => {
    let valid = true;
    let errors: Record<string, string> = { ...formErrors };

    fieldsToValidate.forEach((field) => {
      const value = formValues[field.field];
      if (!field.isNullable && !value) {
        valid = false;
        errors[field.field] = `${transformLabel(field.field)} es requerido`;
      }
    });

    return { valid, errors };
  };

  const validateAllTabs = () => {
    let allValid = true;
    let newFormErrors: Record<string, string> = {};
    let newSubformErrors: Record<string, Record<string, string>> = {};
    let newTabErrors: Record<number, boolean> = {};

    // Validate main form
    const { valid: mainFormValid, errors: mainFormErrors } = validateForm(formFields, formValues, formErrors);
    newFormErrors = { ...mainFormErrors };
    newTabErrors[0] = !mainFormValid;
    allValid = mainFormValid;

    // Validate subforms
    tabFields.forEach((field, index) => {
      const tabIndex = index + 1;
      const referenceTable = field.referenceTable || "";
      const subformValuesForTab = subformValues[referenceTable] || {};
      const { valid: subformValid, errors: subformErrorsForTab } = validateForm([field], subformValuesForTab, subformErrors[referenceTable] || {});
      newSubformErrors[referenceTable] = subformErrorsForTab;
      newTabErrors[tabIndex] = !subformValid;
      allValid = allValid && subformValid;
    });

    // Validate reverse references
    reverseReferences.forEach((ref, index) => {
      const tabIndex = index + tabFields.length + 1;
      const referenceTable = ref.referenceTable || "";
      const subformValuesForTab = subformValues[referenceTable] || {};
      const { valid: subformValid, errors: subformErrorsForTab } = validateForm([ref], subformValuesForTab, subformErrors[referenceTable] || {});
      newSubformErrors[referenceTable] = subformErrorsForTab;
      newTabErrors[tabIndex] = !subformValid;
      allValid = allValid && subformValid;
    });

    setFormErrors(newFormErrors);
    setSubformErrors(newSubformErrors);
    setTabErrors(newTabErrors);

    return allValid;
  };

  const handleSubmit = async () => {
    const allTabsValid = validateAllTabs();

    if (!allTabsValid) {
      return;
    }

    const structuredData = formValuesToInsertValues(formValues);
    const relatedData = Object.entries(subformValues).map(([tableName, values]) => {
      const idColumn = fields.find(field => field.referenceTable === tableName)?.field || '';
      return {
        tableName,
        toInsert: formValuesToInsertValues(values),
        idColumn,
        schemaName: fields.find(field => field.referenceTable === tableName)?.referenceSchema || schemaName,
      };
    });

    try {
      const response = await insertData({
        variables: { data: { schemaName, tableName, structuredData, relatedData } },
      });
      if (response.data.insertData.success) {
        const recordId = response.data.insertData.id;
        onFormSubmit(recordId);
      } else {
        console.error('Error submitting form:', response.data.insertData.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleTabSwitch = (index: number) => {
    setActiveTab(index);
    setTabIndex(index);
    return true;
  };

  const formErrorsForCurrentTab = (tabIndex === 0 ? formErrors.main : formErrors[tabFields[tabIndex - 1]?.referenceTable || reverseReferences[tabIndex - tabFields.length - 1]?.referenceTable || '']) || {};

  const formValuesToInsertValues = (values: Record<string, any>): { column_name: string; value: any }[] => {
    return Object.entries(values).map(([column_name, value]) => ({ column_name, value }));
  };

  return (
    <div className="container">
      <Tabs selectedIndex={activeTab} onSelect={handleTabSwitch} className="tabs">
        <TabList className="tab-list">
          <Tab className={activeTab === 0 ? 'tab selected-tab' : 'tab'}>
            {transformLabel(tableName)}
            {tabErrors[0] && <span className="tab-error">!</span>}
          </Tab>
          {tabFields.map((field, index) => {
            const referenceTable = field.referenceTable || "";
            return (
              <Tab
                key={referenceTable}
                className={activeTab === index + 1 ? 'tab selected-tab' : 'tab direct-reference-tab'}
              >
                {transformLabel(referenceTable)}
                {tabErrors[index + 1] && <span className="tab-error">!</span>}
              </Tab>
            );
          })}
          {reverseReferences.map((ref: FieldInterface, index: number) => {
            const referenceTable = ref.referenceTable || "";
            return (
              <Tab
                key={referenceTable}
                className={activeTab === index + tabFields.length + 1 ? 'tab selected-tab' : 'tab reverse-reference-tab'}
              >
                {transformLabel(referenceTable!)}
                {tabErrors[index + tabFields.length + 1] && <span className="tab-error">!</span>}
              </Tab>
            );
          })}
        </TabList>

        <TabPanel>
          <DynamicForm
            schemaName={schemaName}
            tableName={tableName}
            fields={formFields}
            onFormChange={handleFormChange}
            formValues={formValues}
            ref={(ref) => (formRefs.current[0] = ref)}
            formErrors={formErrorsForCurrentTab}
            isMainForm={true}
          />
        </TabPanel>
        {tabFields.map((field, index) => {
          const referenceTable = field.referenceTable || "";
          return (
            <TabPanel key={referenceTable}>
              <DynamicForm
                schemaName={field.referenceSchema!}
                tableName={referenceTable}
                fields={undefined}
                onFormChange={(fieldName, value) => handleFormChange(fieldName, value, index + 1)}
                formValues={referenceTable ? (subformValues[referenceTable] || {}) : {}}
                ref={(ref) => (formRefs.current[index + 1] = ref)}
                formErrors={formErrorsForCurrentTab}
                isMainForm={false}
              />
            </TabPanel>
          );
        })}
        {reverseReferences.map((ref: FieldInterface, index: number) => {
          const referenceTable = ref.referenceTable || "";
          return (
            <TabPanel key={referenceTable}>
              <DynamicForm
                schemaName={ref.referenceSchema!}
                tableName={referenceTable}
                fields={undefined}
                onFormChange={(fieldName, value) => handleFormChange(fieldName, value, index + tabFields.length + 1)}
                formValues={referenceTable ? (subformValues[referenceTable] || {}) : {}}
                ref={(ref) => (formRefs.current[index + tabFields.length + 1] = ref)}
                formErrors={formErrorsForCurrentTab}
                isMainForm={false}
              />
            </TabPanel>
          );
        })}
      </Tabs>
      <div className="submit-container">
        <button
          onClick={handleSubmit}
          className="submit"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default FormContainer;