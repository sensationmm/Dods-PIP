export const validateEmail = (email: string): boolean => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  return !email || re.test(email);
};

export const validateMatching = (input: string, inputToMatch: string): boolean => {
  return input === inputToMatch && !!input;
};

export const validateNumeric = (input: any): boolean => {
  if (input === '') {
    return false;
  }

  return !isNaN(input);
};

export const validateRequired = (input: any): boolean => {
  return !!input && (!Array.isArray(input) || (Array.isArray(input) && input.length > 0));
};
