import { error } from 'errors';
import { invalidReqParam } from 'utils';
import { foodsRepository } from '../repositories';

const read = (identifier?: string) => {
  if (identifier) return foodsRepository.readByIdenfier(identifier);
  return foodsRepository.read();
};

const readByCategoryId = async (categoryId: number) => {
  if (invalidReqParam(categoryId)) throw error.badRequest();

  const food = await foodsRepository.readByCategoryId(categoryId);

  if (!food) throw error.notFound('food not found');

  return food;
};

export const foodsService = { read, readByCategoryId };
