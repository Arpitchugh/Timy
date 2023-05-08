import express from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hello World!');
    res.sendStatus(200);
});

router.use('/user', userRoutes);
router.use('/auth', authRoutes);

export default router;