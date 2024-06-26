// src/components/FormFieldComponents.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import Grid from './Grid';
import './FormFieldComponents.css';

const commonStyle = "common-style";

export const TextField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="number" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const DateField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
    const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';
    return (
        <input type="date" name={name} value={formattedValue} onChange={onChange} className={commonStyle} disabled={disabled} />
    );
};

export const EmailField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <input type="email" name={name} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const CheckboxField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
    <input type="checkbox" name={name} checked={value || false} onChange={onChange} disabled={disabled} />
);

export const DateTimeField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
    const formattedValue = value ? new Date(value).toISOString().slice(0, 16) : '';
    return (
        <input type="datetime-local" name={name} value={formattedValue} onChange={onChange} className={commonStyle} disabled={disabled} />
    );
};

export const IdField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onIconClick: () => void; disabled?: boolean }> = ({ name, maxLength, value, onChange, onIconClick, disabled }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const handleRowSelection = (selectedRow: any) => {
        onChange({ target: { value: selectedRow.id } } as React.ChangeEvent<HTMLInputElement>);
        setModalOpen(false);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
            <button type="button" onClick={() => setModalOpen(true)} disabled={disabled} style={{ marginLeft: '8px' }}>🔍</button>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <Grid
                    metadata={null} // Provide the appropriate metadata
                    rowDataResponse={[]} // Provide the appropriate row data
                    exceptions={[]} // Provide any exceptions if needed
                    onRowClicked={handleRowSelection}
                />
            </Modal>
        </div>
    );
};
