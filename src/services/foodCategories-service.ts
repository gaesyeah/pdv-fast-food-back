import { foodCategoriesRepository } from 'repositories';

const read = () => {
  return foodCategoriesRepository.read();
};

export const foodCategoriesService = { read };
