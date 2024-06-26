import React from 'react';

const commonStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
};

export const TextField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} style={commonStyle} disabled={disabled} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="number" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} style={commonStyle} disabled={disabled} />
);

export const DateField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
    const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';
    return (
        <input type="date" name={name} value={formattedValue} onChange={onChange} style={commonStyle} disabled={disabled} />
    );
};

export const EmailField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <input type="email" name={name} value={value || ''} onChange={onChange} style={commonStyle} disabled={disabled} />
);

export const CheckboxField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <input type="checkbox" name={name} checked={value || false} onChange={onChange} disabled={disabled} />
);

export const DateTimeField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
    const formattedValue = value ? new Date(value).toISOString().slice(0, 16) : '';
    return (
        <input type="datetime-local" name={name} value={formattedValue} onChange={onChange} style={commonStyle} disabled={disabled} />
    );
};
