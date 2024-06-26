import React from 'react';
import {
    CheckboxField,
    DateField,
    DateTimeField,
    EmailField,
    IdField,
    NumberField,
    TextField
} from "../components/FormFieldsComponents/FormFieldComponents";

// Fields that should be excluded always
const permanentExcludedFields = new Set(['t_basket', 't_ili_tid']);

const fieldMapper = (field: any, handleInputChange: (name: string, value: any) => void, options: any[] = [], value: any, isNew: boolean, isMainForm: boolean) => {
    const { dataType, field: fieldName, maxLength, isReference } = field;

    // Exclude fields based on whether the record is new or not
    if (permanentExcludedFields.has(fieldName)) {
        return null;
    }

    const commonProps = {
        name: fieldName,
        maxLength: maxLength,
        value: value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value),
        disabled: fieldName === 't_id' && !isNew // Disable if fieldName is 't_id' and it's not a new record
    };

    const specialCases: any = {
        documento_identidad: <NumberField {...commonProps} />,
        numero_celular: <NumberField {...commonProps} />,
        correo_electronico: <EmailField {...commonProps} />,
    };

    if (specialCases[fieldName]) {
        return specialCases[fieldName];
    }

    if (fieldName === 't_id') {
        if (isNew) {
            if (!isMainForm) {
                return <IdField {...commonProps} onIconClick={() => { console.log('Icon clicked for t_id'); /* Add logic to open new component */ }} />;
            }
            return null;
        }
        return <NumberField {...commonProps} />;
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
                value={value}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                disabled={fieldName === 't_id' && !isNew} // Disable if fieldName is 't_id' and it's not a new record
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
        'character varying': <TextField {...commonProps} />,
        'timestamp without time zone': <DateTimeField {...commonProps} />,
        'text': <TextField {...commonProps} />,
        'number': <NumberField {...commonProps} />,
        'bigint': <NumberField {...commonProps} />,
        'int': <NumberField {...commonProps} />,
        'date': <DateField {...commonProps} />,
        'email': <EmailField {...commonProps} />,
        'checkbox': <CheckboxField name={fieldName} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.checked)} disabled={fieldName === 't_id' && !isNew} />,
    };

    return dataTypeCases[dataType] || <TextField {...commonProps} />;
};

export default fieldMapper;
