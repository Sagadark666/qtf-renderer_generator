import React from 'react';

const commonStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
};

export const TextField: React.FC<{ name: string; maxLength: number; defaultValue?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, maxLength, defaultValue, onChange }) => (
    <input type="text" name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={onChange} style={commonStyle} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; defaultValue?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, maxLength, defaultValue, onChange }) => (
    <input type="number" name={name} maxLength={maxLength} defaultValue={defaultValue} onChange={onChange} style={commonStyle} />
);

export const DateField: React.FC<{ name: string; defaultValue?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, defaultValue, onChange }) => (
    <input type="date" name={name} defaultValue={defaultValue} onChange={onChange} style={commonStyle} />
);

export const EmailField: React.FC<{ name: string; defaultValue?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, defaultValue, onChange }) => (
    <input type="email" name={name} defaultValue={defaultValue} onChange={onChange} style={commonStyle} />
);

export const CheckboxField: React.FC<{ name: string; defaultValue?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, defaultValue, onChange }) => (
    <input type="checkbox" name={name} defaultChecked={defaultValue} onChange={onChange} />
);

export const DateTimeField: React.FC<{ name: string; defaultValue?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, defaultValue, onChange }) => {
    // Format the default value to "YYYY-MM-DDTHH:MM" as required by the datetime-local input type
    const formattedDefaultValue = defaultValue ? new Date(defaultValue).toISOString().slice(0, 16) : undefined;
    return (
        <input type="datetime-local" name={name} defaultValue={formattedDefaultValue} onChange={onChange} style={commonStyle} />
    );
};
