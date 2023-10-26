import express from 'express';
import * as applicationController from '../controller/applicationController';

const router = express.Router();

router.get('/', applicationController.landingPageInfo);

export default router;