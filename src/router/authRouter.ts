import express from 'express';
import * as authController from '../controller/authController';

const router = express.Router();

// router.post('/join', authController.join);
router.post('/login', authController.login);
router.post('/koreapasJoin', authController.koreapasJoin);
router.post('/koreapasLogin', authController.koreapasLogin); // 실제 로그인, 회원가입 시 고파스 인증용으로 사용
router.post('/koreapasVerify', authController.koreapasVerify);
router.post('/koreapasSync', authController.koreapasSync);
router.post('/checkKupply', authController.checkKupply);
router.post('/checkKoreapas', authController.checkKoreapas);
router.post('/checkKoreapasJoined', authController.checkKoreapasJoined);
router.get('/logout', authController.logout);
router.post('/sendEmail', authController.sendEmail);
router.post('/certifyEmail', authController.certifyEmail);
router.post('/nicknameCheck', authController.nicknameCheck);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/refreshAccessToken', authController.refreshAccessToken);

export default router;
