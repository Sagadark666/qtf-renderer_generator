import React from 'react';
import './FormFieldComponents.css';
const commonStyle = "common-style";
const dropdownStyle = 'dropdown'

export const TextField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
    <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle}
           disabled={disabled} />
);

export const NumberField: React.FC<{ name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean }> = ({ name, maxLength, value, onChange, disabled }) => (
            <input type="number" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle}
                   disabled={disabled} />
        );

export const DateField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
            const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';
            return (
                <input type="date" name={name} value={formattedValue} onChange={onChange} className={commonStyle} disabled={disabled} />
            );
        };

export const EmailField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
            <input type="email" name={name} value={value || ''} onChange={onChange} className={commonStyle} disabled={disabled} />
);

export const CheckboxField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean }> = ({ name, value, onChange, disabled }) => (
            <input type="checkbox" name={name} checked={value || false} onChange={onChange} disabled={disabled} />
);

export const DateTimeField: React.FC<{ name: string; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean }> = ({ name, value, onChange, disabled }) => {
            const formattedValue = value ? new Date(value).toISOString().slice(0, 16) : '';
            return (
                <input type="datetime-local" name={name} value={formattedValue} onChange={onChange} className={commonStyle}
                       disabled={disabled} />
            );
        };

//TODO Review if reference column is necessary
export const DropdownField: React.FC<{name: string; value?: any; options: any[]; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
        disabled?: boolean; referenceColumn?: string; }> = ({ name, value, options, onChange, disabled, referenceColumn }) => (
            <select name={name} onChange={onChange} className={dropdownStyle} disabled={disabled} value={value || ''}>
                <option value="">Seleccione</option>
                {options.map((option: any) => (
                    <option key={option[referenceColumn || 'id']} value={option[referenceColumn || 'id']}>
                        {option.dispname}
                    </option>
                ))}
            </select>
        );

export const IdField: React.FC<{name: string; maxLength: number; value?: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean; onIconClick: () => void; }> = ({ name, maxLength, value, onChange, disabled, onIconClick }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" name={name} maxLength={maxLength} value={value || ''} onChange={onChange} className={commonStyle}
              disabled={disabled}
            />
            <button type="button" onClick={onIconClick} style={{ marginLeft: '8px' }}>🔍</button>
          </div>
        );
      };
