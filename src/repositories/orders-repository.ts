import {
  FoodOrder,
  OrderFoodExtras,
  OrderStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { prisma } from 'config';
import { OrderInput } from '../../protocols';

const read = () => {
  return prisma.order.findMany({
    include: {
      PaymentType: true,
      Foods: {
        include: {
          Extras: true,
        },
      },
    },
  });
};

const createOrder = ({
  prismaT,
  body,
}: {
  prismaT: PrismaClient;
  body: OrderInput;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { foods, ...rest } = body;
  return prismaT.order.create({
    data: { ...rest },
  });
};

const createFoodOrder = ({
  prismaT,
  body,
  orderId,
}: {
  prismaT: PrismaClient;
  body: OrderInput;
  orderId: number;
}) => {
  // assemble a SQL INSERT string with the values related to the food
  const foodOrdersValues = body.foods
    .map(
      ({ foodId, quantity }) => `(${quantity}, ${foodId}, ${orderId}, NOW())`,
    )
    .join(', ');
  // use the INSERT SQL string to create the relation between the recently created order and the foods
  return prismaT.$queryRaw<FoodOrder[]>(
    Prisma.raw(`
      INSERT INTO
        "FoodOrder" (quantity, "foodId", "orderId", "updatedAt")
      VALUES
        ${foodOrdersValues}
      RETURNING *
    ;`),
  );
};

const createOrderFoodExtras = ({
  prismaT,
  foodOrders,
  body,
}: {
  prismaT: PrismaClient;
  foodOrders: FoodOrder[];
  body: OrderInput;
}) => {
  // assemble a SQL INSERT string with the values related to the relation between the order and your foods extras
  const orderFoodExtrasValues = foodOrders
    .flatMap(({ foodId, orderId }) => {
      const extrasFromFoodId = body.foods.find(
        ({ foodId: id }) => foodId === id,
      ).extras;

      if (!extrasFromFoodId) return [];

      return extrasFromFoodId.map(
        ({ extraId }) => `(${orderId}, ${extraId}, NOW())`,
      );
    })
    .join(', ');

  if (orderFoodExtrasValues.length === 0) return null;

  // use the INSERT SQL string to create the relation between the recently created
  // relation between order and foods with the extras related to your foods
  return prismaT.$queryRaw<OrderFoodExtras[]>(
    Prisma.raw(`
      INSERT INTO
        "OrderFoodExtras" ("foodOrderId", "extraId", "updatedAt")
      VALUES
        ${orderFoodExtrasValues}
      RETURNING *
    ;`),
  );
};

const create = (body: OrderInput) => {
  return prisma.$transaction(async (prismaT: PrismaClient) => {
    const order = await createOrder({ prismaT, body });

    const foodOrders = await createFoodOrder({
      prismaT,
      body,
      orderId: order.id,
    });

    const orderFoodExtras = await createOrderFoodExtras({
      prismaT,
      body,
      foodOrders,
    });

    if (!orderFoodExtras) return { order, foodOrders };

    return { order, foodOrders, orderFoodExtras };
  });
};

const updateById = (id: number, status: OrderStatus) => {
  return prisma.order.update({
    where: { id },
    data: {
      status,
    },
  });
};

const readById = (id: number) => {
  return prisma.order.findUnique({
    where: { id },
  });
};

export const ordersRepository = {
  create,
  read,
  readById,
  updateById,
};