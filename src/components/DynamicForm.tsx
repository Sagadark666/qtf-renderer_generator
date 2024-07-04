import { useLazyQuery } from '@apollo/client';
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import {getJoinedTableData, getTableData} from '../apollo/dataQuery';
import {toTitleCase, transformLabel} from '../mapper/LabelMapper';
import fieldMapper from '../mapper/FieldMapper';
import './DynamicForm.css';
import {getTableMetadata} from "../apollo/metadataQuery";
import Modal from './Modal';
import Grid from "./Grid";

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
}

interface FormProps {
  schemaName: string;
  tableName: string;
  fields: FieldInterface[];
  onFormChange: (fieldName: string, value: any) => void;
  formValues: { [key: string]: any };
  formErrors?: { [key: string]: string };
  isMainForm: boolean;
}

const DynamicForm = forwardRef(({ schemaName, tableName, fields, onFormChange, formValues, formErrors, isMainForm }: FormProps, ref) => {
  const [formFields, setFormFields] = useState<FieldInterface[]>(fields);
  const [fieldTypes, setFieldTypes] = useState<{ [key: string]: string }>({});
  const [fieldEnabled, setFieldEnabled] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dropdownOptions, setDropdownOptions] = useState<{ [key: string]: any[] }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIdField, setCurrentIdField] = useState<string | null>(null);
  const [idFieldsMetadata, setIdFieldsMetadata] = useState<{ [key: string]: any }>({});
  const [idFieldsData, setIdFieldsData] = useState<{ [key: string]: any }>({});

  const [fetchTableMetadata] = useLazyQuery(getTableMetadata());
  const [fetchJoinedTableData] = useLazyQuery(getJoinedTableData());
  const [fetchReferencedTableData] = useLazyQuery(getTableData(), {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    setFormFields(fields);
  }, [fields]);

  useEffect(() => {
    const updateFieldStates = () => {
      const newFieldTypes: { [key: string]: string } = {};
      const newFieldEnabled: { [key: string]: boolean } = {};

      fields.forEach((field) => {
        newFieldTypes[field.field] = getFieldType(field);
        newFieldEnabled[field.field] = getEnableStatus(field);
      });

      setFieldTypes(newFieldTypes);
      setFieldEnabled(newFieldEnabled);
    };

    updateFieldStates();
  }, [fields, isMainForm]);

  useEffect(() => {
    const fetchAllDropdownData = async () => {
      for (const field of fields) {
        if (fieldTypes[field.field] === 'dropdown' && fieldEnabled[field.field]) {
          await fetchDropdownData(field);
        }
      }
    };

    if (Object.keys(fieldTypes).length > 0 && Object.keys(fieldEnabled).length > 0) {
      fetchAllDropdownData();
    }
  }, [fields, fieldTypes, fieldEnabled]);

  const getFieldType = (field: FieldInterface): string => {
    const { field: fieldName, isReference, isCatalog, dataType } = field;

    const isNew = formValues === null || Object.keys(formValues).length === 0;

    if (fieldName === 't_id') return isMainForm && isNew ? 'none' : isMainForm ? 'number' : 'idType';
    if (fieldName === 't_basket' || fieldName === 't_ili_tid') return 'none';
    if (isReference) return isCatalog ? 'dropdown' : 'idType';

    const specialCases: Record<string, string> = {
      documento_identidad: 'number',
      numero_celular: 'number',
      correo_electronico: 'email',
    };

    return specialCases[fieldName] || dataType;
  };

  const getEnableStatus = (field: FieldInterface): boolean => {
    return field.field !== 't_id';
  };

  const fetchDropdownData = async (field: FieldInterface) => {
    if (field.isReference && field.referenceTable) {
      let data: any;

      try {
        data = await fetchReferencedTableData({
          variables: { schemaName: field.referenceSchema, tableName: field.referenceTable, columns: [field.referenceColumn, 'dispname'] },
        });

        if (!data || !data.data || !data.data.tableData || data.data.tableData.length === 0) {
          data = await fetchReferencedTableData({
            variables: { schemaName: field.referenceSchema, tableName: field.referenceTable, columns: [field.referenceColumn, 'nombre'] },
          });
        }

        if (data && data.data && data.data.tableData) {
          const normalizedData = data.data.tableData.map((item: any) => ({
            ...item,
            dispname: item.dispname || item.nombre,
          }));
          setDropdownOptions((prevOptions) => ({
            ...prevOptions,
            [field.field]: normalizedData,
          }));
        } else {
          console.warn(`No data found for ${field.referenceTable} with columns 'dispname' or 'nombre'`);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    }
  };

  const getDropdownValue = (field: FieldInterface, label: string) => {
    const options = dropdownOptions[field.field] || [];
    let matchedOption = options.find(option => option.t_id === label);
    if(!matchedOption){
      matchedOption = options.find(option => option.dispname === label);
    }
    return matchedOption && field.referenceColumn ? matchedOption[field.referenceColumn] : '';
  };

  const validateField = (field: FieldInterface, value: any) => {
    if (!field.isNullable && (value === undefined || value === null || value === '')) {
      return `${toTitleCase(field.field)} es requerido`;
    }
    return '';
  };

  const validateForm = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};

    formFields.forEach((field) => {
      const error = validateField(field, formValues[field.field]);
      if (error) {
        newErrors[field.field] = error;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

  const handleInputChange = (nameOrEvent: string | React.ChangeEvent<HTMLInputElement>, value?: any) => {
    let name: string;
    let inputValue: any;

    if (typeof nameOrEvent === 'string') {
      name = nameOrEvent;
      inputValue = value;
    } else {
      name = nameOrEvent.target.name;
      inputValue = nameOrEvent.target.value;
    }

    onFormChange(name, inputValue);

    const field = formFields.find(f => f.field === name);
    if (field) {
      const error = validateField(field, inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleIdFieldClick = async (fieldName: string, referenceSchema: string, referenceTable: string) => {
    setCurrentIdField(fieldName);
    setIsModalOpen(true);

    const targetSchema = fieldName === 't_id' ? schemaName : referenceSchema;
    const targetTable = fieldName === 't_id' ? tableName : referenceTable;

    try {
      // Fetch metadata
      const { data: metadataData } = await fetchTableMetadata({
        variables: { schemaName: targetSchema, tableName: targetTable },
      });

      // Immediately use the fetched metadata
      const metadata = metadataData.tableMetadata;

      // Update the state with the new metadata
      setIdFieldsMetadata(prev => ({ ...prev, [fieldName]: metadata }));

      // Use the fetched metadata to get relationships
      const relationships = metadata.map((field: any) => ({
        columnName: field.column_name,
        isReference: field.column_name === 't_basket' ? false : field.is_reference,
        isCatalog: field.is_catalog,
        referenceSchema: field.reference_schema,
        referenceTable: field.reference_table,
        referenceColumn: field.reference_column,
        reverseReferences: field.reverse_references || [],
      }));
      // Fetch joined table data
      const { data: joinedData } = await fetchJoinedTableData({
        variables: { schemaName: targetSchema, tableName: targetTable, relationships },
      });

      setIdFieldsData(prev => ({ ...prev, [fieldName]: joinedData.joinedTableData }));
    } catch (error) {
      console.error('Error fetching data for IdField:', error);
    }
  };

  const handleRowSelection = (selectedRow: any) => {
    if (currentIdField) {
      // Assuming the ID field is always named 't_id'
      const idValue = selectedRow.t_id;

      // Update the form value for the current ID field
      handleInputChange(currentIdField, idValue);

      // If the current field is 't_id', update all other fields from the selected row
      if (currentIdField === 't_id') {
        Object.entries(selectedRow).forEach(([key, value]) => {
          if (key !== 't_id') {
            handleInputChange(key, value);
          }
        });
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <form className="form">
        <div className="form-row">
          {formFields.map((field, index) => {
            let value = formValues[field.field] || '';
            if (field.isReference && field.isCatalog) {
              value = getDropdownValue(field, formValues[field.field]);
            }

            const fieldProps = {
              ...field,
              dataType: fieldTypes[field.field],
              isEnabled: fieldEnabled[field.field],
            };

            const fieldElement = fieldMapper(
              fieldProps,
              handleInputChange,
              dropdownOptions[field.field] || [],
              value,
              tableName,
              schemaName,
              field.isReference || field.field === 't_id'
                ? () => handleIdFieldClick(field.field, field.referenceSchema!, field.referenceTable!)
                : undefined
            );
            if (fieldElement === null) return null;
            return (
              <div
                key={field.id}
                className={`form-group ${index % 2 === 0 ? 'form-group-first-column' : 'form-group-second-column'}`}
              >
                <label className="label">
                  {toTitleCase(field.field)}:
                </label>
                {React.cloneElement(fieldElement, {
                  value: value,
                  onChange: handleInputChange,
                  name: field.field,
                })}
                {(errors[field.field] || (formErrors && formErrors[field.field])) && (
                  <span className="error">{errors[field.field] || (formErrors && formErrors[field.field])}</span>
                )}
              </div>
            );
          })}
        </div>
      </form>
      {currentIdField && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Seleccione ${currentIdField === 't_id' ? transformLabel(tableName) : toTitleCase(currentIdField) }`}
        >
          {idFieldsMetadata[currentIdField] && idFieldsData[currentIdField] ? (
            <Grid
              metadata={{tableMetadata: idFieldsMetadata[currentIdField]}}
              rowDataResponse={idFieldsData[currentIdField]}
              exceptions={['t_basket', 't_ili_tid']}
              onRowClicked={handleRowSelection}
            />
          ) : (
            <p>Cargando...</p>
          )}
        </Modal>
      )}
    </div>
  );
});

export default DynamicForm;
