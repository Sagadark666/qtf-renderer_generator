import React, { useState, useEffect } from 'react';
import fieldMapper from '../mapper/FieldMapper';
import { toTitleCase } from '../mapper/LabelMapper';
import { formToDto } from '../mapper/dtoMapper';
import { useMutation } from '@apollo/client';
import { insertTableData } from '../apollo/insertQuery';

interface FieldInterface {
  id: string;
  field: string;
  maxLength: number;
  dataType: string;
  isNullable: boolean;
  default: any;
}

interface FormProps {
  tableName: string;
  fields: FieldInterface[];
  onFormSubmit: (formData: Record<string, any>) => void; // Add this prop to handle form submission
}

const DynamicForm: React.FC<FormProps> = ({ tableName, fields, onFormSubmit }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [insertData] = useMutation(insertTableData());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form values with default values
  useEffect(() => {
    const initialFormValues: { [key: string]: any } = {};
    fields.forEach(field => {
      initialFormValues[field.field] = field.default || '';
    });
    setFormValues(initialFormValues);
  }, [fields]);

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
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
    if (validate()) {
      const toInsert = formToDto(formValues);
      if (tableName.startsWith('gc')) {
        toInsert.push({ column_name: 't_basket', value: '701' });
      } else if (tableName.startsWith('gp')) {
        toInsert.push({ column_name: 't_basket', value: '546' });
      }
      try {
        const response = await insertData({
          variables: { data: { table_name: tableName, toInsert } },
        });
        if (response.data.insertData.success) {
          const recordId = response.data.insertData.id;
          setSuccessMessage(`The new record was created successfully with id: ${recordId}`);
          // Reset the form
          const initialFormValues: { [key: string]: any } = {};
          fields.forEach(field => {
            initialFormValues[field.field] = field.default || '';
          });
          setFormValues(initialFormValues);
          // Call the onFormSubmit prop to show the grid again
          onFormSubmit(recordId); // Pass the response ID as argument
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
    width: 'calc(50% - 10px)', // Adjust width to account for the margin
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
    boxSizing: 'border-box',
  };

  const formGroupStyleFirstColumn: React.CSSProperties = {
    ...formGroupStyle,
    marginRight: '10px', // Add margin to the first column
  };

  const formGroupStyleSecondColumn: React.CSSProperties = {
    ...formGroupStyle,
    marginLeft: '10px', // Add margin to the second column
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
    backgroundColor: '#405189', // Updated to purple
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const submitHoverStyle: React.CSSProperties = {
    backgroundColor: '#323b6a', // Updated hover color
  };

  return(
    <div>
    {successMessage && <div className="success-message">{successMessage}</div>}
    <form style={formStyle} onSubmit={handleSubmit}>
      <div style={formRowStyle}>
        {fields.map((field, index) => {
          const fieldElement = fieldMapper(field.dataType, field.field, field.maxLength, field.default, handleInputChange);
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
