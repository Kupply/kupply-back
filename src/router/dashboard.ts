import express from 'express';
import * as applicationController from '../controller/applicationController';

const router = express.Router();

router.post('/', applicationController.createApplicationData);
router.get('/', applicationController.getApplicationData);

export default router;
