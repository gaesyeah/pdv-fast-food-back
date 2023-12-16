import { foodsControler } from 'controllers';
import { Router } from 'express';

const foodsRouter = Router();

foodsRouter
  .get('/', foodsControler.read)
  .get('/:categoryId', foodsControler.readByCategoryId)
  .get('/details/:foodId', foodsControler.readByFoodId);

export { foodsRouter };
