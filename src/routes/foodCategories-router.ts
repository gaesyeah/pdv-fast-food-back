import { foodsController } from 'controllers';
import { Router } from 'express';

const foodCategoriesRouter = Router();

foodCategoriesRouter.get('/', foodsController.read);

export { foodCategoriesRouter };
