import { foodsController } from 'controllers';
import { Router } from 'express';

const foodsRouter = Router();

foodsRouter
  .get('/', foodsController.read)
  .get('/:categoryId', foodsController.readByCategoryId)
  .get('/details/:foodId', foodsController.readByFoodId);

export { foodsRouter };
