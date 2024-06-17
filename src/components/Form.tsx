import React, { useState, useEffect } from 'react';
import fieldMapper from '../mapper/FieldMapper';
import { toTitleCase } from '../mapper/LabelMapper';
import { useLazyQuery } from '@apollo/client';
import { getTableData } from '../apollo/dataQuery';

interface FieldInterface {
  id: string;
  field: string;
  maxLength: number;
  dataType: string;
  isNullable: boolean;
  default: any;
  isReference: boolean;
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
}

const DynamicForm: React.FC<FormProps> = ({ schemaName, tableName, fields, onFormChange, formValues }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dropdownOptions, setDropdownOptions] = useState<{ [key: string]: any[] }>({});

  const [fetchReferencedTableData] = useLazyQuery(getTableData(), {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    fields.forEach((field) => {
      if (field.isReference && field.referenceTable) {
        fetchReferencedTableData({
          variables: { schemaName: field.referenceSchema, tableName: field.referenceTable, columns: [field.referenceColumn, 'dispname'] },
        }).then(({ data }) => {
          setDropdownOptions((prevOptions) => ({
            ...prevOptions,
            [field.field]: data.tableData,
          }));
        });
      }
    });
  }, [fields, fetchReferencedTableData]);

  const validateField = (field: FieldInterface, value: any) => {
    if (!field.isNullable && (value === undefined || value === null || value === '')) {
      return `${toTitleCase(field.field)} es requerido`;
    }
    return '';
  };

  const handleInputChange = (name: string, value: any) => {
    onFormChange(name, value);

    const field = fields.find(f => f.field === name);
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
      <form style={formStyle}>
        <div style={formRowStyle}>
          {fields.map((field, index) => {
            const fieldElement = fieldMapper(
              field,
              (value: any) => handleInputChange(field.field, value),
              dropdownOptions[field.field] || []
            );
            if (fieldElement === null) return null;
            return (
              <div
                key={field.id}
                style={index % 2 === 0 ? formGroupStyleFirstColumn : formGroupStyleSecondColumn}
              >
                <label style={labelStyle}>
                  {toTitleCase(field.field)}:
                </label>
                {React.cloneElement(fieldElement, {
                  value: formValues[field.field],
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.field, e.target.value),
                })}
                {errors[field.field] && <span style={errorStyle}>{errors[field.field]}</span>}
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
