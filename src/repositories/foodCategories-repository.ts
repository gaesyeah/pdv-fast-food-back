import { prisma } from 'config';

const read = () => {
  return prisma.foodCategory.findMany();
};

const readById = (id: number) => {
  return prisma.foodCategory.findUnique({
    where: { id },
  });
};

export const foodCategoriesRepository = { read, readById };
