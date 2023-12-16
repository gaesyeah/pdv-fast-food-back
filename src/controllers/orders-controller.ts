import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ordersService } from 'services';
import { OrderInput } from '../../protocols';

const read = async (_req: Request, res: Response) => {
  const orders = await ordersService.read();
  res.send(orders);
};

const create = async (req: Request, res: Response) => {
  const body = req.body as OrderInput;
  await ordersService.create(body);
  res.sendStatus(httpStatus.CREATED);
};

const finish = async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId) as number;
  const order = await ordersService.finish(orderId);
  res.send(order);
};

const deliver = async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId) as number;
  const order = await ordersService.deliver(orderId);
  res.send(order);
};

const cancel = async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId) as number;
  const order = await ordersService.cancel(orderId);
  res.send(order);
};

export const ordersController = {
  create,
  read,
  cancel,
  deliver,
  finish,
};
