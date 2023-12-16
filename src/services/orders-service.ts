import { error } from 'errors';
import { invalidReqParam } from 'utils';
import { ordersRepository, paymentRepository } from '../repositories';
import { OrderInput } from '../../protocols';

const read = () => {
  return ordersRepository.read();
};

const create = async (body: OrderInput) => {
  const payment = await paymentRepository.readById(body.paymentTypeId);
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

  if (order.status === 'CANCELED' || order.status === 'DELIVERED') {
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
