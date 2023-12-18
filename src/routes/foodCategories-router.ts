import { foodCategoriesController } from 'controllers';
import { Router } from 'express';

const foodCategoriesRouter = Router();

foodCategoriesRouter.get('/', foodCategoriesController.read);

export { foodCategoriesRouter };
