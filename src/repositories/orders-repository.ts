import { prisma } from 'config';
import { FoodOrder, OrderFoodExtras } from '@prisma/client';
import { OrderInput } from '../../protocols';

const read = () => {
  return 1;
};

const create = (body: OrderInput) => {
  const { foods, paymentTypeId, customerName } = body;
  const result = prisma.$transaction(async prismaT => {
    /* create the order */
    const order = await prismaT.order.create({
      data: {
        customerName,
        paymentTypeId,
      },
    });

    /* assemble a SQL INSERT string with the values related to the food */
    const foodOrdersValues = foods
      .map(({ foodId, quantity }) => `(${quantity}, ${foodId}, ${order.id})`)
      .join(', ');
    console.log(foodOrdersValues);
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
        const extrasFromFoodId = foods.find(
          ({ foodId: id }) => foodId === id,
        ).extras;
        return extrasFromFoodId.map(extra => `(${orderId}, ${extra.id})`);
      })
      .join(', ');
    console.log(orderFoodExtrasValues);
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
};

export const ordersRepository = { create, read };
