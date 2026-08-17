export const createNegativeInt = (): number => {
  const min = -999;
  const max = -100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
