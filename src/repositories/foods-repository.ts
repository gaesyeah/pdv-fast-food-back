import { prisma } from 'config';

const read = () => {
  return prisma.food.findMany({
    include: {
      Extras: true,
    },
  });
};

const readByIdentifier = (identifier: string) => {
  return prisma.food.findMany({
    where: {
      OR: [
        { name: { contains: identifier, mode: 'insensitive' } },
        { code: { contains: identifier, mode: 'insensitive' } },
      ],
    },
    include: {
      Extras: true,
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
