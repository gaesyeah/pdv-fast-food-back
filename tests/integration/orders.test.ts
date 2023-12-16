import supertest from 'supertest';
import httpStatus from 'http-status';
import { cleanDb } from '../helpers';
import app, { init } from '../../src/app';
import {
  createExtras,
  createFood,
  createFoodCategory,
  createOrder,
  createPaymentType,
} from '../factories';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

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
      foods: [{ id: 1, quantity: 1, extras: [{ id: 1 }] }],
      paymentTypeId: 999,
    });
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 500 if the transaction related to the inserts fail', async () => {
    const { id } = await createPaymentType();

    const { status } = await server.post('/orders').send({
      foods: [{ id: 999, quantity: 1, extras: [{ id: 999 }] }],
      paymentTypeId: id,
    });
    expect(status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should respond with status 201 when everything is ok', async () => {
    const foodCategory = await createFoodCategory();
    const food = await createFood(foodCategory.id);
    const extra = await createExtras(food.id);
    const paymentType = await createPaymentType();

    const { status } = await server.post('/orders').send({
      foods: [{ id: food.id, quantity: 10, extras: [{ id: extra.id }] }],
      paymentTypeId: paymentType.id,
    });
    expect(status).toBe(httpStatus.CREATED);
  });
});

describe('GET /orders', () => {
  it('should respond with status 200 with all informations related to all orders', async () => {
    const foodCategory = await createFoodCategory();
    const food = await createFood(foodCategory.id);
    const extra = await createExtras(food.id);
    const paymentType = await createPaymentType();
    await createOrder({
      paymentTypeId: paymentType.id,
      foods: [{ id: food.id, quantity: 2, extras: [{ id: extra.id }] }],
    });

    const { status, body } = await server.get('/orders');
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          status: expect.any(String),
          code: expect.any(Number),
          customerName: expect.any(String),
          observation: expect.any(String),
          change: expect.any(Number),
          paymentTypeId: expect.any(Number),
          PaymentType: expect.objectContaining({ name: expect.any(String) }),
          Foods: expect.arrayContaining([]),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});
