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

const readByCategoryId = (id: number) => {
  return prisma.foodCategory.findUnique({
    where: { id },
    include: {
      Foods: true,
    },
  });
};

const readByFoodId = (id: number) => {
  return prisma.food.findUnique({
    where: { id },
    include: {
      Extras: true,
    },
  });
};

export const foodsRepository = {
  read,
  readByIdenfier,
  readByCategoryId,
  readByFoodId,
};
