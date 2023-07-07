import validator from 'validator';

export const validateUsername = (name: string): string => {
  if (
    name?.length > 0 &&
    name?.length <= 32 &&
    validator.matches(name, '^[a-zA-Z0-9_.-]*$')
  ) {
    return '';
  } else {
    return 'Username is not valid';
  }
};

export const validatePwd = (pwd: string): string => {
  if (pwd?.length >= 6 && pwd?.length <= 32) {
    return '';
  } else {
    return 'Password must be from 6 to 32 characters';
  }
};
