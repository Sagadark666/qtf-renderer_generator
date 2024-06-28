// src/components/DynamicForm.tsx
import { useLazyQuery } from '@apollo/client';
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { getTableData } from '../apollo/dataQuery';
import { getRelatedTableMetadata } from '../apollo/metadataQuery';
import { formatMetadata } from '../mapper/metadataMapper';
import { toTitleCase } from '../mapper/LabelMapper';
import fieldMapper from '../mapper/FieldMapper';
import './DynamicForm.css';

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
  fields?: FieldInterface[];
  onFormChange: (fieldName: string, value: any) => void;
  formValues: { [key: string]: any };
  formErrors?: { [key: string]: string };
  isMainForm: boolean;
}

const DynamicForm = forwardRef(({ schemaName, tableName, fields, onFormChange, formValues, formErrors, isMainForm }: FormProps, ref) => {
  const [formFields, setFormFields] = useState<FieldInterface[]>(fields || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dropdownOptions, setDropdownOptions] = useState<{ [key: string]: any[] }>({});

  const [fetchReferencedTableData] = useLazyQuery(getTableData(), {
    fetchPolicy: 'network-only',
  });

  const [fetchMetadata, { data: metadata, error: metadataError }] = useLazyQuery(getRelatedTableMetadata(), {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!fields) {
      fetchMetadata({ variables: { schemaName, tableName } });
    }
  }, [fields, schemaName, tableName, fetchMetadata]);

  useEffect(() => {
    if (metadata && metadata.tableMetadata) {
      const filteredMetadata = formatMetadata(metadata.tableMetadata).filter((field: any) => !field.isReference || (field.isReference && field.isCatalog));
      setFormFields(filteredMetadata);
    }
  }, [metadata]);

  useEffect(() => {
    formFields.forEach((field) => {
      fetchDropdownData(field);
    });
  }, [formFields]);

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

  return (
    <div>
      {metadataError && <p>Error: {metadataError.message}</p>}
      <form className="form">
        <div className="form-row">
          {formFields.map((field, index) => {
            let value = formValues[field.field] || '';
            if (field.isReference && field.isCatalog) {
              value = getDropdownValue(field, formValues[field.field]);
            }
            const isNew = !value;
            const fieldElement = fieldMapper(
              field,
              handleInputChange,
              dropdownOptions[field.field] || [],
              value,
              isNew,
              isMainForm,
              tableName,
              schemaName
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
                {errors[field.field] && <span className="error">{errors[field.field]}</span>}
                {formErrors && formErrors[field.field] && <span className="error">{formErrors[field.field]}</span>}
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
});

export default DynamicForm;
