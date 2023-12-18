import supertest from 'supertest';
import httpStatus from 'http-status';
import { convertDateToISOstring } from 'utils';
import { cleanDb } from '../helpers';
import app, { init } from '../../src/app';
import { createFoodCategory } from '../factories';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /categories', () => {
  it('should respond with status 200 and a array of categories', async () => {
    const category = await createFoodCategory();

    const { status, body } = await server.get('/categories');
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([
      { ...category, ...convertDateToISOstring(category) },
    ]);
  });
});
