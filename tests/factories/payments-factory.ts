import { faker } from '@faker-js/faker';
import { prisma } from 'config';

export const createPaymentType = () => {
  return prisma.paymentType.create({
    data: {
      name: faker.lorem.word(),
    },
  });
};
