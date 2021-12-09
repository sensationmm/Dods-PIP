export const ucFirst = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

type UserOber = {
  firstName: string;
  lastName: string;
};

export const getUserName = (userObj: UserOber): string => {
  return `${userObj.firstName} ${userObj.lastName}`;
};
