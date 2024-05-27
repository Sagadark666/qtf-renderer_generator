import React from 'react';
import { TextField, NumberField, DateField, EmailField, CheckboxField } from '../components/FormFieldComponents';

const fieldMapper = (dataType: string, name: string, maxLength: number, placeholder: string) => {
  if (name === 't_id') {
    return null;
  }

  const specialCases: any = {
      documento_identidad: <NumberField name={name} maxLength={maxLength} placeholder={placeholder} />,
      numero_celular: <NumberField name={name} maxLength={maxLength} placeholder={placeholder} />,
      correo_electronico: <EmailField name={name} placeholder={placeholder} />,
};

if (specialCases[name]) {
    return specialCases[name];
}

const dataTypeCases: any = {
    'character varying': <TextField name={name} maxLength={maxLength} placeholder={placeholder} />,
    'text': <TextField name={name} maxLength={maxLength} placeholder={placeholder} />,
    'number': <NumberField name={name} maxLength={maxLength} placeholder={placeholder} />,
    'bigint': <NumberField name={name} maxLength={maxLength} placeholder={placeholder} />,
    'int': <NumberField name={name} maxLength={maxLength} placeholder={placeholder} />,
    'date': <DateField name={name} placeholder={placeholder} />,
    'email': <EmailField name={name} placeholder={placeholder} />,
    'checkbox': <CheckboxField name={name} />,
};

return dataTypeCases[dataType] || <TextField name={name} maxLength={maxLength} placeholder={placeholder} />;
};

export default fieldMapper;
