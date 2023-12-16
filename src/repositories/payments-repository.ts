import { prisma } from 'config';

const readById = (id: number) => {
  return prisma.paymentType.findUnique({
    where: {
      id,
    },
  });
};

const read = () => {
  return prisma.paymentType.findMany();
};

export const paymentsRepository = { readById, read };
