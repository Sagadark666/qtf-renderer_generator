import React from 'react';

const commonStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
};

export const TextField: React.FC<{ name: string; maxLength: number; placeholder?: string }> = ({ name, maxLength, placeholder }) => (
    <input type="text" name={name} maxLength={maxLength} placeholder={placeholder} style={commonStyle} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; placeholder?: string }> = ({ name, maxLength, placeholder }) => (
    <input type="number" name={name} maxLength={maxLength} placeholder={placeholder} style={commonStyle} />
);

export const DateField: React.FC<{ name: string; placeholder?: string }> = ({ name, placeholder }) => (
    <input type="date" name={name} placeholder={placeholder} style={commonStyle} />
);

export const EmailField: React.FC<{ name: string; placeholder?: string }> = ({ name, placeholder }) => (
    <input type="email" name={name} placeholder={placeholder} style={commonStyle} />
);

export const CheckboxField: React.FC<{ name: string }> = ({ name }) => (
    <input type="checkbox" name={name} style={{ margin: '0 10px' }} />
);
