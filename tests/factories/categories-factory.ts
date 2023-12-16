import { faker } from '@faker-js/faker';
import { prisma } from 'config';

export const createFoodCategory = (name: string = faker.lorem.word()) => {
  return prisma.foodCategory.create({
    data: { name, frontBackGroundUrl: faker.internet.url() },
  });
};
