import { prisma } from 'config';

const readById = (id: number) => {
  return prisma.paymentType.findUnique({
    where: {
      id,
    },
  });
};

export const paymentRepository = { readById };
