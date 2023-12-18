import { prisma } from 'config';

const read = () => {
  return prisma.food.findMany();
};

const readByIdentifier = (identifier: string) => {
  return prisma.food.findMany({
    where: {
      OR: [{ name: identifier }, { code: identifier }],
    },
  });
};

const readByCategoryId = (foodCategoryId: number) => {
  return prisma.food.findMany({
    where: { foodCategoryId },
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
  readByIdentifier,
  readByCategoryId,
  readByFoodId,
};
