import { foodsControler } from 'controllers';
import { Router } from 'express';

const foodsRouter = Router();

foodsRouter
  .get('/', foodsControler.read)
  .get('/:categoryId', foodsControler.readByCategoryId);

export { foodsRouter };
