import { error } from 'errors';
import { invalidReqParam } from 'utils';
import { foodsRepository } from '../repositories';

const read = (identifier?: string) => {
  if (identifier) return foodsRepository.readByIdenfier(identifier);
  return foodsRepository.read();
};

const readByCategoryId = (categoryId: number) => {
  if (invalidReqParam(categoryId)) throw error.badRequest();
  return foodsRepository.readByCategoryId(categoryId);
};

export const foodsService = { read, readByCategoryId };
