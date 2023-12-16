import { prisma } from 'config';
import { faker } from '@faker-js/faker';
import { Extra, FoodOrder, Order, OrderFoodExtras } from '@prisma/client';

type Foods = {
  id: number;
  quantity: number;
  extras: Pick<Extra, 'id'>[];
}[];
type TransactionOrderInput = { foods: Foods; paymentTypeId: number };

type TransctionOrderOutput = {
  result: unknown;
  data: {
    order: Order;
    foodOrders: FoodOrder[];
    orderFoodExtras: OrderFoodExtras[];
  };
};

export const createOrder = async ({
  paymentTypeId,
  foods,
}: TransactionOrderInput): Promise<TransctionOrderOutput | null> => {
  try {
    const result = prisma.$transaction(async prismaT => {
      /* create the order */
      const order = await prismaT.order.create({
        data: {
          code: faker.number.int({ max: 999, min: 1 }),
          customerName: faker.person.firstName(),
          status: 'PREPARING',
          paymentTypeId,
        },
      });

      /* assemble a SQL INSERT string with the values related to the food */
      const foodOrdersValues = foods
        .map(({ id, quantity }) => `(${quantity}, ${id}, ${order.id})`)
        .join(', ');
      /* use the INSERT SQL string to create the relation between the recently created order and the foods */
      const foodOrders = await prismaT.$queryRaw<FoodOrder[]>`
        INSERT INTO
          "FoodOrder" (quantity, "foodId", "orderId")
        VALUES
          ${foodOrdersValues}
        RETURNING *
      ;`;

      /* assemble a SQL INSERT string with the values related to the relation between the order and your foods */
      const orderFoodExtrasValues = foodOrders
        .flatMap(({ foodId, orderId }) => {
          const extrasFromFoodId = foods.find(({ id }) => foodId === id).extras;
          return extrasFromFoodId.map(extra => `(${orderId}, ${extra.id})`);
        })
        .join(', ');
      /* use the INSERT SQL string to create the relation between the recently created relation
      between order and foods with the extras related to your foods */
      const orderFoodExtras = await prismaT.$queryRaw<OrderFoodExtras[]>`
        INSERT INTO
          "OrderFoodExtras" ("foodOrderId", "extraId")
        VALUES
          ${orderFoodExtrasValues}
        RETURNING *
      ;`;

      return { result, data: { order, foodOrders, orderFoodExtras } };
    });

    return result;
  } catch (error) {
    return null;
  }
};
