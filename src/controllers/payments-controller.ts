import { Request, Response } from 'express';
import { paymentsService } from 'services/payments-service';

const read = async (_req: Request, res: Response) => {
  const payments = await paymentsService.read();
  res.send(payments);
};

export const paymentsController = { read };
