import React from 'react';
import {
    TextField,
    NumberField,
    DateField,
    EmailField,
    CheckboxField,
    DateTimeField
} from '../components/FormFieldComponents';

const excludedFields = new Set(['t_id', 't_basket', 't_ili_tid']);

const fieldMapper = (field: any, handleInputChange: (name: string, value: any) => void, options: any[] = []) => {
    const { dataType, field: fieldName, maxLength, default: defaultValue, isReference } = field;

    if (excludedFields.has(fieldName)) {
        return null;
    }

    const specialCases: any = {
        documento_identidad: <NumberField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        numero_celular: <NumberField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        correo_electronico: <EmailField name={fieldName} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
    };

    if (specialCases[fieldName]) {
        return specialCases[fieldName];
    }

    if (isReference) {
        return (
            <select
                name={fieldName}
                style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                }}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
            >
                <option value="">Seleccione</option>
                {options.map((option: any) => (
                    <option key={option[field.referenceColumn]} value={option[field.referenceColumn]}>
                        {option.dispname}
                    </option>
                ))}
            </select>
        );
    }

    const dataTypeCases: any = {
        'character varying': <TextField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'timestamp without time zone': <DateTimeField name={fieldName} defaultValue={new Date().toISOString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'text': <TextField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'number': <NumberField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'bigint': <NumberField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'int': <NumberField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'date': <DateField name={fieldName} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'email': <EmailField name={fieldName} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />,
        'checkbox': <CheckboxField name={fieldName} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.checked)} />,
    };

    return dataTypeCases[dataType] || <TextField name={fieldName} maxLength={maxLength} defaultValue={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value)} />;
};

export default fieldMapper;
