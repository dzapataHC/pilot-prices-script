export const createNegativeInt = (): number => {
  const min = -9999;
  const max = -1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
