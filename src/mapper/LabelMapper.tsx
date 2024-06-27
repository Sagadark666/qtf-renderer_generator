export function toTitleCase(fieldName: string): string {
    return fieldName
        .split('_') // Split the string by underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join them back with spaces
}

export const transformLabel = (tableName: string | undefined): string => {
    if (!tableName) {
      console.warn("transformLabel: Received undefined or empty tableName");
      return "Unknown"; // Provide a default label to avoid errors
    }
    const parts = tableName.split('_').slice(1); // Remove first part
    const label = parts.join(' ');
    return label.charAt(0).toUpperCase() + label.slice(1);
  };