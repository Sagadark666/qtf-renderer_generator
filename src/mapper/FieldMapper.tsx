import React from 'react';
import {
    CheckboxField,
    DateField,
    DateTimeField,
    EmailField,
    IdField,
    NumberField,
    TextField,
    DropdownField
} from "../components/FormFieldComponents";
const fieldMapper = (field: any, handleInputChange: (name: string, value: any) => void, options: any[] = [], value: any, tableName: string, tableSchema: string, onIdFieldClick?: () => void) => {
    const { dataType, field: fieldName, maxLength, isEnabled } = field;

    if (dataType === 'none') {
        return null;
    }

    const commonProps = {
        name: fieldName,
        maxLength: maxLength,
        value: value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.value),
        disabled: !isEnabled,
        tableName: tableName,
        tableSchema: tableSchema
    };

    const dataTypeCases: any = {
        'character varying': <TextField {...commonProps} />,
        'timestamp without time zone': <DateTimeField {...commonProps} />,
        'text': <TextField {...commonProps} />,
        'number': <NumberField {...commonProps} />,
        'bigint': <NumberField {...commonProps} />,
        'int': <NumberField {...commonProps} />,
        'date': <DateField {...commonProps} />,
        'email': <EmailField {...commonProps} />,
        'checkbox': <CheckboxField {...commonProps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(fieldName, e.target.checked)} />,
        'idType': <IdField {...commonProps} onIconClick={onIdFieldClick || (() => { console.log(`Icon clicked for ${fieldName}`); })} />,
        'dropdown': <DropdownField {...commonProps} onChange={(e) => handleInputChange(fieldName, e.target.value)} options={options} referenceColumn={field.referenceColumn}/>
    };

    return dataTypeCases[dataType] || <TextField {...commonProps} />;
};

export default fieldMapper;