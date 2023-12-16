import { faker } from '@faker-js/faker';
import { prisma } from '../src/config';

export async function cleanDb() {
  await prisma.orderFoodExtras.deleteMany();
  await prisma.foodOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentType.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.food.deleteMany();
  await prisma.foodCategory.deleteMany();
}

export const orderDefaultBody = {
  paidValue: faker.number.float({ max: 100, min: 10 }),
  customerName: faker.person.firstName(),
};
