import React, { useState, useEffect } from 'react';
import fieldMapper from '../mapper/FieldMapper';
import { toTitleCase } from '../mapper/LabelMapper';
import { formToDto } from '../mapper/dtoMapper';
import { useMutation, useLazyQuery } from '@apollo/client';
import { insertTableData } from '../apollo/insertQuery';
import { getTableData } from '../apollo/dataQuery';

interface FieldInterface {
  id: string;
  field: string;
  maxLength: number;
  dataType: string;
  isNullable: boolean;
  default: any;
  isReference: boolean;
  referenceTable?: string;
  referenceColumn?: string;
}

interface FormProps {
  schemaName: string;
  tableName: string;
  fields: FieldInterface[];
  onFormSubmit: (formData: Record<string, any>) => void;
}

const DynamicForm: React.FC<FormProps> = ({ schemaName, tableName, fields, onFormSubmit }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [insertData] = useMutation(insertTableData());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<{ [key: string]: any[] }>({});

  const [fetchReferencedTableData] = useLazyQuery(getTableData(), {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const initialFormValues: { [key: string]: any } = {};
    fields.forEach((field) => {
      initialFormValues[field.field] = field.default || '';
      if (field.isReference && field.referenceTable) {
        fetchReferencedTableData({
          variables: { tableName: field.referenceTable, columns: [field.referenceColumn, 'dispname'] },
        }).then(({ data }) => {
          setDropdownOptions((prevOptions) => ({
            ...prevOptions,
            [field.field]: data.tableData,
          }));
        });
      }
    });
    setFormValues(initialFormValues);
  }, [fields, fetchReferencedTableData]);

  const handleInputChange = (name: string, value: any) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};

    fields.forEach((field) => {
      const value = formValues[field.field];
      if (!field.isNullable && (value === undefined || value === null || value === '')) {
        valid = false;
        newErrors[field.field] = `${toTitleCase(field.field)} es requerido`;
      }
    });

    setErrors(newErrors);
    return valid;
  };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (tableName.startsWith('gc')) {
        formValues.t_basket = '701';
      } else if (tableName.startsWith('gp')) {
        formValues.t_basket = '546';
      }
      if (validate()) {
        const toInsert = formToDto(formValues);
        try {
          const response = await insertData({
            variables: { data: { table_name: tableName, toInsert } },
          });
          if (response.data.insertData.success) {
            const recordId = response.data.insertData.id;
            setSuccessMessage(`The new record was created successfully with id: ${recordId}`);
            const initialFormValues: { [key: string]: any } = {};
            fields.forEach((field) => {
              initialFormValues[field.field] = field.default || '';
            });
            setFormValues(initialFormValues);
            onFormSubmit(recordId);
          } else {
            console.error('Error submitting form:', response.data.insertData.message);
          }
        } catch (err) {
          console.error('Error submitting form:', err);
        }
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
      <div>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={formRowStyle}>
            {fields.map((field, index) => {
              const fieldElement = fieldMapper(
                field,
                handleInputChange,
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
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.field, e.target.value),
                  })}
                  {errors[field.field] && <span style={errorStyle}>{errors[field.field]}</span>}
                </div>
              );
            })}
          </div>
          <div style={submitContainerStyle}>
            <input
              type="submit"
              value="Guardar"
              style={submitStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = submitHoverStyle.backgroundColor!)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = submitStyle.backgroundColor!)}
            />
          </div>
        </form>
      </div>
    );
  };

  export default DynamicForm;
