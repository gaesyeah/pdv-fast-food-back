import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../src/config';

export const createFood = (foodCategoryId: number, code: string = uuidv4()) => {
  return prisma.food.create({
    data: {
      code,
      description: faker.lorem.paragraph(),
      name: faker.lorem.word(),
      price: faker.number.float({ min: 10, max: 50 }),
      foodCategoryId,
    },
  });
};
