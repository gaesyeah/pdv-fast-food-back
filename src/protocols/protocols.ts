import { Order } from '@prisma/client';

type FoodInput = {
  foodId: number;
  observation?: string;
  quantity: number;
  extras?: { extraId: number }[];
}[];

export type OrderInput = Omit<
  Order,
  'createdAt' | 'id' | 'status' | 'updatedAt' | 'observation' | 'code'
> & { foods: FoodInput };

export type OrderStateType = {
  foodId: number;
  paymentTypeId: number;
  extraId: number;
};
