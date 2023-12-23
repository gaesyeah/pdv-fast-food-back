import supertest from 'supertest';
import httpStatus from 'http-status';
import { convertDateToISOstring, cleanDb } from '../helpers';
import app, { init } from '../../src/app';
import { createPaymentType } from '../factories';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /payments', () => {
  it('should respond with status 200 and a array of payments', async () => {
    const payment = await createPaymentType();

    const { status, body } = await server.get('/payments');
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([{ ...payment, ...convertDateToISOstring(payment) }]);
  });
});
