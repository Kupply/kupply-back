import express from 'express';
import * as applicationController from '../controller/applicationController';

const router = express.Router();

router.get('/cards', applicationController.getCardData);
router.post('/', applicationController.createApplicationData);
// router.get('/', applicationController.getApplicationData);
router.get('/', applicationController.getAllApplicationData);
router.delete('/', applicationController.deleteApplicationData);
router.patch('/', applicationController.updateApplicationData);
router.get(
  '/hopeMajorsCurrentInfo',
  applicationController.hopeMajorsCurrentInfo,
);
router.get('/myStage', applicationController.myStage);

export default router;
