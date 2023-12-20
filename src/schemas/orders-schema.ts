import Joi from 'joi';
import { OrderInput } from '../../protocols';

export const orderSchema = Joi.object<OrderInput>({
  customerName: Joi.string().required(),
  paymentTypeId: Joi.number().integer().positive().required(),
  paidValue: Joi.number().positive().required(),
  foods: Joi.array()
    .items(
      Joi.object({
        foodId: Joi.number().integer().positive().required(),
        observation: Joi.string(),
        quantity: Joi.number().integer().positive().required(),
        extras: Joi.array().items(
          Joi.object({ extraId: Joi.number().integer().positive().required() }),
        ),
      }),
    )
    .min(1)
    .required(),
});
