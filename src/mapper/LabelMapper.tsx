export function toTitleCase(fieldName: string): string {
    return fieldName
        .split('_') // Split the string by underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join them back with spaces
}
