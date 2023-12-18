import { paymentsController } from 'controllers';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter.get('/', paymentsController.read);

export { paymentsRouter };
