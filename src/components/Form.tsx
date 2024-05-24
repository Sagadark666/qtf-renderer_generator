import React from 'react';
import fieldMapper from '../mapper/FieldMapper';

interface FormProps {
  id: string;
  field: string;
  maxLength: number;
  dataType: string;
}

const DynamicForm: React.FC<{ fields: FormProps[] }> = ({ fields }) => {

    console.error("Form: ", fields)

  return (
      <form>
        {fields.map((field) => (
            <div key={field.id}>
                <label>
                    {field.field}:
                    {fieldMapper(field.dataType, field.field, field.maxLength)}
                </label>
            </div>
        ))}
        <input type="submit" value="Submit" />
    </form>
);
};

export default DynamicForm;
