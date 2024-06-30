import express from 'express';
import * as adminController from '../controller/adminController';

const router = express.Router();

router.get('/update', adminController.update);

export default router;
