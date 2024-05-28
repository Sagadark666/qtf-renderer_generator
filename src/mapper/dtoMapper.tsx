export function formToDto(formValues: any) {
    return Object.entries(formValues)
        .filter(([key, value]) => value !== '' && value !== null && value !== undefined && key !== 't_id')
        .map(([key, value]) => ({
            column_name: key,
            value: value
        }));
}
