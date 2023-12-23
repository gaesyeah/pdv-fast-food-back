import xss from 'xss';

export const invalidReqParam = (param: unknown): boolean => {
  return !param || Number.isNaN(param as number) || (param as number) < 1;
};

export const xssN = (number: number) => {
  return Number(xss(number.toString()));
};
