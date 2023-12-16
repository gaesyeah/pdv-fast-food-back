import Joi from 'joi';
import { OrderInput } from '../../protocols';

export const orderSchema = Joi.object<OrderInput>({
  customerName: Joi.string().required(),
  paymentTypeId: Joi.number().integer().positive().required(),
  foods: Joi.array()
    .items(
      Joi.object({
        foodId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        extras: Joi.array().items(
          Joi.object({ id: Joi.number().integer().positive().required() }),
        ),
      }),
    )
    .min(1)
    .required(),
});
