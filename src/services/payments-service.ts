import { paymentsRepository } from 'repositories';

const read = () => {
  return paymentsRepository.read();
};

export const paymentsService = { read };
