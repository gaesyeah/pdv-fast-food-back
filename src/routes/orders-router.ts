import { ordersController } from 'controllers';
import { Router } from 'express';
import { schemaValidation } from 'middlewares';
import { orderSchema } from 'schemas';

const ordersRouter = Router();

ordersRouter
  .post('/', schemaValidation(orderSchema), ordersController.create)
  .get('/', ordersController.read);

export { ordersRouter };
