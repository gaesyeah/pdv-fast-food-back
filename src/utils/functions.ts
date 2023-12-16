import { Extra, Food } from '@prisma/client';

export const invalidReqParam = (param: unknown): boolean => {
  return !param || Number.isNaN(param as number) || (param as number) < 1;
};

type DateFromDB = Pick<Food, 'createdAt' | 'updatedAt'>;

export const convertDateToISOstring = (date: DateFromDB) => {
  const { updatedAt, createdAt } = date;
  return {
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
