import { error } from 'errors';
import { invalidReqParam } from 'utils';
import { OrderInput } from 'protocols';
import { ordersRepository, paymentsRepository } from '../repositories';

const read = () => {
  return ordersRepository.read();
};

const create = async (body: OrderInput) => {
  const payment = await paymentsRepository.readById(body.paymentTypeId);

  if (!payment) throw error.notFound('paymentTypeId not found');

  return ordersRepository.create(body);
};

const finish = async (orderId: number) => {
  if (invalidReqParam(orderId)) throw error.badRequest();

  const order = await ordersRepository.readById(orderId);

  if (!order) throw error.notFound('order not found');

  if (order.status !== 'PREPARING') {
    throw error.forbidden('this order isnt being prepared');
  }

  return ordersRepository.updateById(orderId, 'FINISHED');
};

const deliver = async (orderId: number) => {
  if (invalidReqParam(orderId)) throw error.badRequest();

  const order = await ordersRepository.readById(orderId);

  if (!order) throw error.notFound('order not found');

  if (order.status !== 'FINISHED') {
    throw error.forbidden('this order cannot be delivered');
  }

  return ordersRepository.updateById(orderId, 'DELIVERED');
};

const cancel = async (orderId: number) => {
  if (invalidReqParam(orderId)) throw error.badRequest();

  const order = await ordersRepository.readById(orderId);

  if (!order) throw error.notFound('order not found');

  const { status } = order;
  if (status === 'CANCELED' || status === 'DELIVERED') {
    throw error.forbidden('this order cannot be canceled');
  }

  return ordersRepository.updateById(orderId, 'CANCELED');
};

export const ordersService = {
  create,
  read,
  cancel,
  deliver,
  finish,
};
