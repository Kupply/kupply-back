import express from 'express';
import * as userController from '../controller/userController';

const router = express.Router();

router.route('/').get(userController.getAllUsers);

export default router;
