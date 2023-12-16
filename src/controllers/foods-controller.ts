import { Request, Response } from 'express';
import { foodsService } from 'services';

const read = async (req: Request, res: Response) => {
  const identifier = req.query.identifier as string;
  const foods = await foodsService.read(identifier);
  res.send(foods);
};

const readByCategoryId = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId) as number;
  const categoryWithFoods = await foodsService.readByCategoryId(categoryId);
  res.send(categoryWithFoods);
};

const readByFoodId = async (req: Request, res: Response) => {
  const foodId = Number(req.params.foodId) as number;
  const foodsWithExtras = await foodsService.readByFoodId(foodId);
  res.send(foodsWithExtras);
};

export const foodsControler = { read, readByCategoryId, readByFoodId };
