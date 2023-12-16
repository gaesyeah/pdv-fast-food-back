import { ordersRepository } from 'repositories';
import { OrderInput } from '../../protocols';

const read = () => {
  return ordersRepository.read();
};

const create = (body: OrderInput) => {
  return ordersRepository.create(body);
};

export const ordersService = { create, read };
