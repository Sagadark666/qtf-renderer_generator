// src/components/DynamicForm.tsx
import { useLazyQuery } from '@apollo/client';
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { getTableData } from '../../apollo/dataQuery';
import { getRelatedTableMetadata } from '../../apollo/metadataQuery';
import './DynamicForm.module.css';
import {formatMetadata} from "../../mapper/metadataMapper";
import { toTitleCase } from '../../mapper/LabelMapper';
import fieldMapper from '../../mapper/FieldMapper';

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
  formErrors?: { [key: string]: string }; // Added formErrors prop
  isMainForm: boolean; // New prop to indicate if this is the main form
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

        // Check if `dispname` returned null or empty results
        if (!data || !data.data || !data.data.tableData || data.data.tableData.length === 0) {
          data = await fetchReferencedTableData({
            variables: { schemaName: field.referenceSchema, tableName: field.referenceTable, columns: [field.referenceColumn, 'nombre'] },
          });
        }

        if (data && data.data && data.data.tableData) {
          // Normalize the data to use 'dispname' key
          const normalizedData = data.data.tableData.map((item: any) => ({
            ...item,
            dispname: item.dispname || item.nombre, // Use 'nombre' if 'dispname' is not present
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
    const matchedOption = options.find(option => option.dispname === label);
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
    console.log('validateForm - Errors:', newErrors);
    return valid;
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

  const handleInputChange = (name: string, value: any) => {
    onFormChange(name, value);

    const field = formFields.find(f => f.field === name);
    if (field) {
      const error = validateField(field, value);
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
            const isNew = !value; // Treat empty string as new value
            console.log(`Field: ${field.field}, Value: ${value}, isNew: ${isNew}, isMainForm: ${isMainForm}`); // Add logging here
            const fieldElement = fieldMapper(
              field,
              (value: any) => handleInputChange(field.field, value),
              dropdownOptions[field.field] || [],
              value, // Pass the value to fieldMapper
              isNew, // Dynamically determine isNew
              isMainForm // Pass isMainForm to fieldMapper
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
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.field, e.target.value),
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
