import { Request, Response } from 'express';
import { foodCategoriesService } from 'services';

const read = async (_req: Request, res: Response) => {
  const categories = await foodCategoriesService.read();
  res.send(categories);
};

export const foodCategoriesController = { read };
