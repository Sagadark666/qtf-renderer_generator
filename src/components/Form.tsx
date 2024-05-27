import React, { useState } from 'react';
import fieldMapper from '../mapper/FieldMapper';
import { toTitleCase } from '../mapper/LabelMapper';

interface FormProps {
  id: string;
  field: string;
  maxLength: number;
  dataType: string;
  isNullable: boolean;
  default: any;
}

const DynamicForm: React.FC<{ fields: FormProps[] }> = ({ fields }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};

    fields.forEach(field => {
      if (!field.isNullable && !formValues[field.field]) {
        valid = false;
        newErrors[field.field] = `${toTitleCase(field.field)} is required`;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formValues);
      // handle form submission
    }
  };

  const formStyle: React.CSSProperties = {
    maxWidth: '80%',
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

  const submitStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  };

  const submitHoverStyle: React.CSSProperties = {
    backgroundColor: '#0056b3',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <div style={formRowStyle}>
        {fields.map((field, index) => {
          const fieldElement = fieldMapper(field.dataType, field.field, field.maxLength, field.default);
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
      <input
        type="submit"
        value="Guardar"
        style={submitStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = submitHoverStyle.backgroundColor!)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = submitStyle.backgroundColor!)}
      />
    </form>
  );
};

export default DynamicForm;
