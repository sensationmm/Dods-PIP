export const inArray = (item: string, array: Array<string>): boolean => {
  return array.indexOf(item) >= 0;
};

export const getIndexById = (
  arr: Array<Record<string, unknown>>,
  key: string,
  value: unknown,
): number | undefined => {
  let index;
  arr.forEach((obj, count) => {
    if (obj[key] === value) {
      index = count;
    }
  });
  return index;
};
