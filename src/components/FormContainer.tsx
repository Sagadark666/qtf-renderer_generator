import React from 'react';
import { Tabs, Tab } from '@mui/material';
import Form from './Form'; // Your existing form component

interface FormContainerProps {
    mainTableName: string;
    formData: any;
    relationships: { tableName: string, columnName: string, referenced_table: string, referencedColumn: string }[];
}

const FormContainer: React.FC<FormContainerProps> = ({ mainTableName, relationships, formData }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    console.error("Container: ", formData)

    return (
        <div>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label={mainTableName} />
                {relationships.map((rel, index) => (
                    <Tab key={index} label={`${rel.referenced_table}`} />
                ))}
            </Tabs>
            <div>
                {selectedTab === 0 && <Form fields={formData} />}
                {relationships.map((rel, index) => (
                    selectedTab === index + 1 && <Form key={index} fields={formData} />
                ))}
            </div>
        </div>
    );
};

export default FormContainer;
