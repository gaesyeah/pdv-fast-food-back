import { error } from 'errors';
import { invalidReqParam } from 'utils';
import { foodsRepository } from '../repositories';

const read = (identifier?: string) => {
  if (identifier) return foodsRepository.readByIdenfier(identifier);
  return foodsRepository.read();
};

const readByCategoryId = async (categoryId: number) => {
  if (invalidReqParam(categoryId)) throw error.badRequest();

  const category = await foodsRepository.readByCategoryId(categoryId);

  if (!category) throw error.notFound('category not found');

  return category;
};

const readByFoodId = async (foodId: number) => {
  if (invalidReqParam(foodId)) throw error.badRequest();

  const food = await foodsRepository.readByFoodId(foodId);

  if (!food) throw error.notFound('food not found');

  return food;
};

export const foodsService = { read, readByCategoryId, readByFoodId };
