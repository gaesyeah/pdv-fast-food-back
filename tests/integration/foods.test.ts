import supertest from 'supertest';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { convertDateToISOstring } from 'utils';
import { cleanDb } from '../helpers';
import app, { init } from '../../src/app';
import { createExtra, createFood, createFoodCategory } from '../factories';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /foods', () => {
  it('should respond with status 200 and a array of foods including your related Extras when the optional param is not defined', async () => {
    const { id } = await createFoodCategory();
    const food = await createFood(id);
    const extra = await createExtra(food.id);

    const { status, body } = await server.get('/foods');
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([
      {
        ...food,
        ...convertDateToISOstring(food),
        Extras: [{ ...extra, ...convertDateToISOstring(extra) }],
      },
    ]);
  });

  it('should respond with status 200 and a array of foods based on the option param', async () => {
    const { id } = await createFoodCategory();
    const code = uuidv4();
    const wrongFood = await createFood(id);
    const rightFood = await createFood(id, code);

    const { body, status } = await server.get(`/foods?identifier=${code}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: wrongFood.code,
        }),
      ]),
    );
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: rightFood.code,
        }),
      ]),
    );
  });
});

describe('GET /foods/:categoryId', () => {
  it('should respond with status 400 if the categoryId param is smaller than 1', async () => {
    const { status } = await server.get(`/foods/category/${-100}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the categoryId param is not a number', async () => {
    const { status } = await server.get(`/foods/category/${'aaaaa'}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the categoryId param is undefined', async () => {
    const { status } = await server.get(`/foods/category/${undefined}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if the category doesnt exist', async () => {
    const { status } = await server.get(`/foods/category/${1}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and the category with a array of foods related to it', async () => {
    const category = await createFoodCategory();
    const { id } = category;
    const food = await createFood(id);

    const { status, body } = await server.get(`/foods/category/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([
      {
        ...food,
        ...convertDateToISOstring(food),
      },
    ]);
  });
});

describe('GET /details/:foodId', () => {
  it('should respond with status 400 if the categoryId param is smaller than 1', async () => {
    const { status } = await server.get(`/foods/details/${-100}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the categoryId param is not a number', async () => {
    const { status } = await server.get(`/foods/details/${'aaaaa'}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if the categoryId param is undefined', async () => {
    const { status } = await server.get(`/foods/details/${undefined}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if the category doesnt exist', async () => {
    const { status } = await server.get(`/foods/details/${1}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and the food with an array of the extras related to it', async () => {
    const category = await createFoodCategory();
    const food = await createFood(category.id);
    const { id } = food;
    const extra = await createExtra(id);

    const { status, body } = await server.get(`/foods/details/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      ...food,
      ...convertDateToISOstring(food),
      Extras: [
        {
          ...extra,
          ...convertDateToISOstring(extra),
        },
      ],
    });
  });
});
