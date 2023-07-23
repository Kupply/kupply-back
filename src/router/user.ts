import express from 'express';
import * as userController from '../controller/entityController';

const router = express.Router();

router.get('/', userController.joinUser);

export default router;
