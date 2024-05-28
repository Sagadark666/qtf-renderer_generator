import React from 'react';
import { TextField, NumberField, DateField, EmailField, CheckboxField } from '../components/FormFieldComponents';

const fieldMapper = (dataType: string, name: string, maxLength: number, defaultValue: any, handleInputChange: (name: string, value: any) => void) => {
    if (name === 't_id') {
        return null;
    }

    const specialCases: any = {
        documento_identidad: <NumberField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        numero_celular: <NumberField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        correo_electronico: <EmailField name={name} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
    };

    if (specialCases[name]) {
        return specialCases[name];
    }

    const dataTypeCases: any = {
        'character varying': <TextField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'text': <TextField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'number': <NumberField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'bigint': <NumberField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'int': <NumberField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'date': <DateField name={name} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'email': <EmailField name={name} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />,
        'checkbox': <CheckboxField name={name} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.checked)} />,
    };

    return dataTypeCases[dataType] || <TextField name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(name, e.target.value)} />;
};

export default fieldMapper;
