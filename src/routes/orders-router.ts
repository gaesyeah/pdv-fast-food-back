import { ordersController } from 'controllers';
import { Router } from 'express';
import { schemaValidation } from 'middlewares';
import { orderSchema } from 'schemas';

const ordersRouter = Router();

ordersRouter
  .post('/', schemaValidation(orderSchema), ordersController.create)
  .get('/', ordersController.read)
  .patch('/deliver/:orderId', ordersController.deliver)
  .patch('/finish/:orderId', ordersController.finish)
  .patch('/cancel/:orderId', ordersController.cancel);

export { ordersRouter };
