import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../src/config';

export const createFoodCategory = (name: string = faker.lorem.word()) => {
  return prisma.foodCategory.create({
    data: { name },
  });
};

export const createFoods = (
  foodCategoryId: number,
  code: string = uuidv4(),
) => {
  return prisma.food.createMany({
    data: [
      {
        code,
        name: faker.lorem.word(),
        price: faker.number.float({ min: 10, max: 50 }),
        foodCategoryId,
      },
      {
        code: uuidv4(),
        name: faker.lorem.word(),
        price: faker.number.float({ min: 10, max: 50 }),
        foodCategoryId,
      },
    ],
  });
};
