import express, { Request, Response } from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../controller/user.controller';
const router = express.Router();

router.post(
	'/api/users',
	validateResource(createUserSchema),
	createUserHandler
);
router.get('/api/users', (req: Request, res: Response) => {
	res.status(200).send('Hello from user auth');
});

export default router;
