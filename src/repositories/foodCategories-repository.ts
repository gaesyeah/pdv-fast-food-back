import { prisma } from 'config';

const read = () => {
  return prisma.foodCategory.findMany();
};

export const foodCategoriesRepository = { read };
