import { prisma } from 'config';

const read = () => {
  return prisma.food.findMany();
};

const readByIdenfier = (identifier: string) => {
  return prisma.food.findMany({
    where: {
      OR: [{ name: identifier }, { code: identifier }],
    },
  });
};

const readByCategoryId = (categoryId: number) => {
  return prisma.foodCategory.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      Foods: true,
    },
  });
};

export const foodsRepository = { read, readByIdenfier, readByCategoryId };
