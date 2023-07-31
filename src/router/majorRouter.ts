import express from 'express';
import * as majorController from '../controller/majorController';

const router = express.Router();

router
  .route('/')
  .get(majorController.getAllMajors)
  .post(majorController.createMajor);

router
  .route('/:id')
  .get(majorController.getMajor)
  .patch(majorController.updateMajor)
  .delete(majorController.deleteMajor);

export default router;
