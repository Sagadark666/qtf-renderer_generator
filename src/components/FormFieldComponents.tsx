import React from 'react';

export const TextField: React.FC<{ name: string; maxLength: number }> = ({ name, maxLength }) => (
    <input type="text" name={name} maxLength={maxLength} />
);

export const NumberField: React.FC<{ name: string; maxLength: number }> = ({ name, maxLength }) => (
    <input type="number" name={name} maxLength={maxLength} />
);

// Add more field components as needed
export const DateField: React.FC<{ name: string }> = ({ name }) => (
    <input type="date" name={name} />
);

export const EmailField: React.FC<{ name: string }> = ({ name }) => (
    <input type="email" name={name} />
);

export const CheckboxField: React.FC<{ name: string }> = ({ name }) => (
    <input type="checkbox" name={name} />
);
