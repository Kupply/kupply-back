import express from 'express';
import * as adminController from '../controller/adminController';

const router = express.Router();

router.get('/updateMajor', adminController.updateMajors);
router.get('/updateApplication', adminController.updateApplication); // 학교 공지 기반 지원 현황 업데이트
router.get('/updateApplicationV2', adminController.updateApplicationV2); // 이메일 설문 기반 지원 현황 업데이트
router.get(
  '/updateApplicationMetaData',
  adminController.updateApplicationMetaData,
);

export default router;
