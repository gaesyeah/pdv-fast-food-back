import supertest from 'supertest';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { number } from 'joi';
import { cleanDb } from '../helpers';
import app, { init } from '../../src/app';
import { createFoodCategory, createFood } from '../factories';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /foods', () => {
  it('should respond with status 200 and a array of foods when the optional param is not defined', async () => {
    const { id } = await createFoodCategory();
    const food = await createFood(id);
    const { status, body } = await server.get('/foods');
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([food]);
  });

  it('should respond with status 200 and a array of foods based on the option param', async () => {
    const { id } = await createFoodCategory();
    const code = uuidv4();
    await createFood(id);
    await createFood(id);
    const food = await createFood(id, code);
    const { status, body } = await server.get(`/foods?identifier=${code}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code,
        }),
      ]),
    );
    expect(body[2].code === food.code);
  });
});

describe('GET /foods/:categoryId', () => {
  it('should respond with status 200 and the category with a array of foods related to it', async () => {
    const category = await createFoodCategory();
    const { id } = category;
    const food = await createFood(id);
    const { status, body } = await server.get(`/foods/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      Foods: [
        {
          ...food,
          price: Number(food.price).toString(),
          createdAt: food.createdAt.toISOString(),
          updatedAt: food.updatedAt.toISOString(),
        },
      ],
    });
  });

  it('should respond with status 400 if the categoryId param is smaller than 1', async () => {
    const { status } = await server.get(`/foods/${-100}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the categoryId param is smaller not a number', async () => {
    const { status } = await server.get(`/foods/${'aaaaa'}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the categoryId param is undefined', async () => {
    const { status } = await server.get(`/foods/${undefined}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });
});
