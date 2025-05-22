// Helper function for generating options from enums
export function createOptionsFromEnum<T extends object>(
  enumObj: T,
  labelFormatter: (label: string) => string
): { value: number; label: string }[] {
  return Object.entries(enumObj)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      value: value as number,
      label: labelFormatter(key)
    }));
}