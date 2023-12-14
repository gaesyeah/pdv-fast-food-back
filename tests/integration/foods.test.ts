import supertest from 'supertest';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { cleanDb } from '../helpers';
import app, { init } from '../../src/app';
import { createFoodCategory, createFoods } from '../factories';

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
    const foods = await createFoods(id);
    const { status, body } = await server.get('/foods');
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(foods);
  });

  it('should respond with status 200 and a array of foods based on the option param', async () => {
    const { id } = await createFoodCategory();
    const code = uuidv4();
    await createFoods(id, code);
    const { status, body } = await server.post(`/foods?identifier=${code}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code,
        }),
      ]),
    );
  });
});

describe('GET /foods/:categoryId', () => {
  it('should respond with status 200 and the category with a array of foods related to it', async () => {
    const category = await createFoodCategory();
    const { id } = category;
    const foods = await createFoods(id);
    const { status, body } = await server.get(`/foods/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({ ...category, Foods: foods });
  });
});
