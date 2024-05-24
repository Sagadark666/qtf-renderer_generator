import React from 'react';
import { TextField, NumberField, DateField, EmailField, CheckboxField } from '../components/FormFieldComponents';

const fieldMapper = (dataType: string, name: string, maxLength: number) => {
    switch (dataType) {
        case 'text':
            return <TextField name={name} maxLength={maxLength} />;
        case 'number':
            return <NumberField name={name} maxLength={maxLength} />;
        case 'date':
            return <DateField name={name} />;
        case 'email':
            return <EmailField name={name} />;
        case 'checkbox':
            return <CheckboxField name={name} />;
        default:
            return <TextField name={name} maxLength={maxLength} />; // Default to text field
    }
};

export default fieldMapper;
