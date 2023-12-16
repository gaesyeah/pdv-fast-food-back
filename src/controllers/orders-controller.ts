import { Request, Response } from 'express';
import { ordersService } from 'services';
import { OrderInput } from '../../protocols';

const read = async (_req: Request, res: Response) => {
  res.send();
};

const create = async (req: Request, res: Response) => {
  const body = req.body as OrderInput;
  await ordersService.create(body);
  res.send();
};

export const ordersController = { create, read };
