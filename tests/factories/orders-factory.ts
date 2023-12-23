import { OrderStatus } from '@prisma/client';
import { prisma } from 'config';
import { ordersRepository } from 'repositories';
import { OrderStateType } from 'protocols';
import { orderDefaultBody } from '../helpers';

export const createOrder = ({
  foodId,
  extraId,
  paymentTypeId,
}: OrderStateType) => {
  return ordersRepository.create({
    foods: [{ foodId, quantity: 10, extras: [{ extraId }] }],
    paymentTypeId,
    ...orderDefaultBody,
  });
};

export const updateOrder = (id: number, status: OrderStatus) => {
  return prisma.order.update({
    where: { id },
    data: {
      status,
    },
  });
};
