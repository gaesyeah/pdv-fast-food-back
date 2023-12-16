import { faker } from '@faker-js/faker';
import { prisma } from 'config';

export const createExtras = (foodId: number) => {
  return prisma.extra.create({
    data: {
      foodId,
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(),
      price: faker.number.float({ max: 10, min: 1 }),
    },
  });
};
