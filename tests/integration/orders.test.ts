import supertest from 'supertest';
import httpStatus from 'http-status';
import { OrderStatus } from '@prisma/client';
import { convertDateToISOstring } from 'utils';
import { cleanDb, orderDefaultBody } from '../helpers';
import app, { init } from '../../src/app';
import {
  createExtra,
  createFood,
  createFoodCategory,
  createOrder,
  createPaymentType,
  updateOrder,
} from '../factories';
import { OrderStateType } from '../../protocols';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

const createDefaultOrderAmbient = async (): Promise<OrderStateType> => {
  const foodCategory = await createFoodCategory();
  const food = await createFood(foodCategory.id);
  const paymentType = await createPaymentType();
  const extra = await createExtra(food.id);
  return { foodId: food.id, paymentTypeId: paymentType.id, extraId: extra.id };
};

const createAndUpdateOrderAmbientState = async (orderState: OrderStatus) => {
  const ambient = await createDefaultOrderAmbient();

  const {
    order: { id },
  } = await createOrder(ambient);

  const { status } = await updateOrder(id, orderState);

  return { id, changeTo: orderState, newState: status };
};

describe('POST /orders', () => {
  it('should respond with status 422 when body is missing', async () => {
    const { status } = await server.post('/orders');
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 when the body is invalid', async () => {
    const { status } = await server.post('/orders').send({ wrong: 'wrong' });
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 404 when the paymentTypeId doesnt exist', async () => {
    const { status } = await server.post('/orders').send({
      foods: [{ foodId: 1, quantity: 1, extras: [{ extraId: 1 }] }],
      paymentTypeId: 999,
      ...orderDefaultBody,
    });
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 500 if the transaction related to the inserts fail', async () => {
    const { id } = await createPaymentType();

    const { status } = await server.post('/orders').send({
      foods: [{ foodId: 999, quantity: 1, extras: [{ extraId: 999 }] }],
      paymentTypeId: id,
      ...orderDefaultBody,
    });
    expect(status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should respond with status 201 when everything is ok', async () => {
    const { extraId, paymentTypeId, foodId } =
      await createDefaultOrderAmbient();

    const { status } = await server.post('/orders').send({
      foods: [{ foodId, quantity: 10, extras: [{ extraId }] }],
      paymentTypeId,
      ...orderDefaultBody,
    });
    expect(status).toBe(httpStatus.CREATED);
  });
});

describe('GET /orders', () => {
  it('should respond with status 200 with all informations related to all orders', async () => {
    const ambient = await createDefaultOrderAmbient();

    const { order } = await createOrder(ambient);

    const { status, body } = await server.get('/orders');
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([
      {
        ...order,
        PaymentType: expect.objectContaining({ name: expect.any(String) }),
        Foods: expect.arrayContaining([]),
        ...convertDateToISOstring(order),
      },
    ]);
  });
});

describe('PATCH /orders/finish/:orderId', () => {
  it('should respond with status 400 if the orderId param is smaller than 1', async () => {
    const { status } = await server.patch(`/orders/finish/${-100}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the orderId param is not a number', async () => {
    const { status } = await server.patch(`/orders/finish/${'aaaaa'}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the orderId param is undefined', async () => {
    const { status } = await server.patch(`/orders/finish/${undefined}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if the order doesnt exist', async () => {
    const { status } = await server.patch(`/orders/finish/${1}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if the order status is already "DELIVERED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('DELIVERED');

    const { status } = await server.patch(`/orders/finish/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if the order status is already "FINHISHED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('FINISHED');

    const { status } = await server.patch(`/orders/finish/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if the order status is "CANCELED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('CANCELED');

    const { status } = await server.patch(`/orders/finish/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 204 if the order status is sucessfuly changed FROM "PREPARING" to "FINISHED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('PREPARING');

    const { status, body } = await server.patch(`/orders/finish/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(expect.objectContaining({ status: 'FINISHED' }));
  });
});

describe('PATCH /orders/deliver/:orderId', () => {
  it('should respond with status 400 if the orderId param is smaller than 1', async () => {
    const { status } = await server.patch(`/orders/deliver/${-100}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the orderId param is not a number', async () => {
    const { status } = await server.patch(`/orders/deliver/${'aaaaa'}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the orderId param is undefined', async () => {
    const { status } = await server.patch(`/orders/deliver/${undefined}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if the order doesnt exist', async () => {
    const { status } = await server.patch(`/orders/deliver/${1}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if the order status is already "DELIVERED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('DELIVERED');

    const { status } = await server.patch(`/orders/deliver/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if the order status is still "PREPARING"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('PREPARING');

    const { status } = await server.patch(`/orders/deliver/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if the order status is "CANCELED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('CANCELED');

    const { status } = await server.patch(`/orders/deliver/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 204 if the order status is sucessfuly changed FROM "FINISHED" to "DELIVERED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('FINISHED');

    const { status, body } = await server.patch(`/orders/deliver/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(expect.objectContaining({ status: 'DELIVERED' }));
  });
});

describe('PATCH /orders/cancel/:orderId', () => {
  it('should respond with status 400 if the orderId param is smaller than 1', async () => {
    const { status } = await server.patch(`/orders/cancel/${-100}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the orderId param is not a number', async () => {
    const { status } = await server.patch(`/orders/cancel/${'aaaaa'}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the orderId param is undefined', async () => {
    const { status } = await server.patch(`/orders/cancel/${undefined}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if the order doesnt exist', async () => {
    const { status } = await server.patch(`/orders/cancel/${1}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if the order status is already "CANCELED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('CANCELED');

    const { status } = await server.patch(`/orders/cancel/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if the order status is already "DELIVERED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('DELIVERED');

    const { status } = await server.patch(`/orders/cancel/${id}`);
    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 204 if the order status is sucessfuly changed from "PREPARING" to "CANCELED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('PREPARING');

    const { status, body } = await server.patch(`/orders/cancel/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(expect.objectContaining({ status: 'CANCELED' }));
  });

  it('should respond with status 204 if the order status is sucessfuly changed from "FINISHED" to "CANCELED"', async () => {
    const { id } = await createAndUpdateOrderAmbientState('FINISHED');

    const { status, body } = await server.patch(`/orders/cancel/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(expect.objectContaining({ status: 'CANCELED' }));
  });
});
