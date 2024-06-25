import React from 'react';

const commonStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
};

export const TextField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, maxLength, value, onChange }) => (
    <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} style={commonStyle} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, maxLength, value, onChange }) => (
    <input type="number" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} style={commonStyle} />
);

export const DateField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, onChange }) => (
    <input type="date" name={name} value={value || ''} onChange={onChange} style={commonStyle} />
);

export const EmailField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, onChange }) => (
    <input type="email" name={name} value={value || ''} onChange={onChange} style={commonStyle} />
);

export const CheckboxField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, onChange }) => (
    <input type="checkbox" name={name} checked={value || false} onChange={onChange} />
);

export const DateTimeField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, onChange }) => {
    // Format the value to "YYYY-MM-DDTHH:MM" as required by the datetime-local input type
    const formattedValue = value ? new Date(value).toISOString().slice(0, 16) : '';
    return (
        <input type="datetime-local" name={name} value={formattedValue} onChange={onChange} style={commonStyle} />
    );
};
