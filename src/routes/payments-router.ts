import { paymentsControler } from 'controllers';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter.get('/', paymentsControler.read);

export { paymentsRouter };
