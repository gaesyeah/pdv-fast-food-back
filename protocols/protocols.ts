import { Extra } from '@prisma/client';

type FoodInput = {
  foodId: number;
  quantity: number;
  extras: Pick<Extra, 'id'>[];
}[];

export type OrderInput = {
  customerName: string;
  foods: FoodInput;
  paymentTypeId: number;
};
