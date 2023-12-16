import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

type Error = {
  message: string;
  status: number;
  code?: string;
};

export const errorHandling = (
  error: Error & { detail: string | null },
  _req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line
) => {
  const { message, status, detail } = error;

  if (status) {
    res.status(status).send({ message, detail });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message, detail });
  }
};
