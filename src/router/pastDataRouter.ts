import express from 'express';
import * as pastDataController from '../controller/pastDataController';

const router = express.Router();

//전체 학과의 가장 최근 학기 지원 데이터를 보여 준다.
router.get('/', pastDataController.getPastData);
router.get('/:id', pastDataController.getPastData_major);

export default router;