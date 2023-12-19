import { faker } from '@faker-js/faker';
import { prisma } from 'config';

export const createExtra = (foodId: number) => {
  return prisma.extra.create({
    data: {
      imageUrl: faker.internet.url(),
      foodId,
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(),
      price: faker.number.float({ max: 10, min: 1 }),
    },
  });
};
