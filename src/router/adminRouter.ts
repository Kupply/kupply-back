import express from 'express';
import * as adminController from '../controller/adminController';

const router = express.Router();

router.get('/updateMajor', adminController.updateMajors);
router.get('/updateApplication', adminController.updateApplication);
router.get(
  '/updateApplicationMetaData',
  adminController.updateApplicationMetaData,
);

export default router;
