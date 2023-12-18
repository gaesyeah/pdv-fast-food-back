import { foodsController } from 'controllers';
import { Router } from 'express';

const foodsRouter = Router();

foodsRouter
  .get('/', foodsController.read)
  .get('/category/:categoryId', foodsController.readByCategoryId)
  .get('/details/:foodId', foodsController.readByFoodId);

export { foodsRouter };
