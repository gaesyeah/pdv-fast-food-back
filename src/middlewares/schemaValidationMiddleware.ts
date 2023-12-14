import { error } from 'errors/errors';
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const schemaValidation = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.validate(req.body, { abortEarly: false });
    if (result.error) {
      throw error.unprocessableEntity(
        result.error.details.map(({ message }) => message).join(', '),
      );
    }

    next();
  };
};
