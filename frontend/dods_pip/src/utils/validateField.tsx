const validateField = (
  field: string,
  label: string,
  value: string,
  errors: Record<string, unknown>,
  setErrors: (errors: Record<string, unknown>) => void,
  message?: string,
): void => {
  const formErrors = { ...errors };
  if (value === '') {
    formErrors[field] = `${label} ${message || 'is required'}`;
  } else {
    delete formErrors[field];
  }
  setErrors(formErrors);
};

export default validateField;
