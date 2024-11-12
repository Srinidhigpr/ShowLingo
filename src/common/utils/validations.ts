export enum ValidationErrorMessages {
  FieldRequired = "Field is required",
}

export const validateIsEmpty = (value: string): boolean => {
  return value?.length > 0;
};
