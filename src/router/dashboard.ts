import express from 'express';
import * as applicationController from '../controller/applicationController';

const router = express.Router();

router.post('/', applicationController.createApplicationData);
router.get('/', applicationController.getApplicationData);
router.delete('/', applicationController.deleteApplicationData);
router.patch('/', applicationController.updateApplicationData)

export default router;
