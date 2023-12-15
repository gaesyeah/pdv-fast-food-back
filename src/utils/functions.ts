import { Food } from '@prisma/client';

export const invalidReqParam = (param: unknown): boolean => {
  return !param || Number.isNaN(param as number) || (param as number) < 1;
};

type DateFromDB = Pick<Food, 'createdAt' | 'updatedAt'>;

export const convertDateToISOstring = (food: DateFromDB) => {
  const { updatedAt, createdAt } = food;
  return {
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};

export const convertDecimalToString = (food: Food) => {
  return {
    price: Number(food.price).toString(),
  };
};
