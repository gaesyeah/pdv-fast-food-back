import { prisma } from '../src/config';

export async function cleanDb() {
  await prisma.orderFoodExtras.deleteMany();
  await prisma.foodOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.food.deleteMany();
  await prisma.paymentType.deleteMany();
  await prisma.food.deleteMany();
  await prisma.foodCategory.deleteMany();
  await prisma.extra.deleteMany();
}
