export const invalidReqParam = (param: unknown): boolean => {
  return !param || Number.isNaN(param as number) || (param as number) < 1;
};
