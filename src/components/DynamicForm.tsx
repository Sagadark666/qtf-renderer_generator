import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import fieldMapper from '../mapper/FieldMapper';
import { toTitleCase } from '../mapper/LabelMapper';
import { useLazyQuery } from '@apollo/client';
import { getTableData } from '../apollo/dataQuery';
import { getRelatedTableMetadata } from '../apollo/metadataQuery';
import { formatMetadata } from '../mapper/metadataMapper';

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
}

const DynamicForm = forwardRef(({ schemaName, tableName, fields, onFormChange, formValues, formErrors }: FormProps, ref) => {
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
    console.log('Form values received:', formValues);
  }, [formValues]);

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

  const formStyle: React.CSSProperties = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  };

  const formRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
  };

  const formGroupStyle: React.CSSProperties = {
    width: 'calc(50% - 10px)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
    boxSizing: 'border-box',
  };

  const formGroupStyleFirstColumn: React.CSSProperties = {
    ...formGroupStyle,
    marginRight: '10px',
  };

  const formGroupStyleSecondColumn: React.CSSProperties = {
    ...formGroupStyle,
    marginLeft: '10px',
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const errorStyle: React.CSSProperties = {
    color: 'red',
    marginTop: '5px',
  };

  return (
    <div>
      {metadataError && <p>Error: {metadataError.message}</p>}
      <form style={formStyle}>
        <div style={formRowStyle}>
          {formFields.map((field, index) => {
            let value = formValues[field.field] || '';
            if (field.isReference && !field.isCatalog) {
              value = getDropdownValue(field, formValues[field.field]);
            }
            const fieldElement = fieldMapper(
              field,
              (value: any) => handleInputChange(field.field, value),
              dropdownOptions[field.field] || [],
              value // Pass the value to fieldMapper
            );
            if (fieldElement === null) return null;
            console.log(`Field: ${field.field}, Value: ${value}`);
            return (
              <div
                key={field.id}
                style={index % 2 === 0 ? formGroupStyleFirstColumn : formGroupStyleSecondColumn}
              >
                <label style={labelStyle}>
                  {toTitleCase(field.field)}:
                </label>
                {React.cloneElement(fieldElement, {
                  value: value,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.field, e.target.value),
                })}
                {errors[field.field] && <span style={errorStyle}>{errors[field.field]}</span>}
                {formErrors && formErrors[field.field] && <span style={errorStyle}>{formErrors[field.field]}</span>}
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
});

export default DynamicForm;
