import express from 'express';
import * as authController from '../controller/authController';

const router = express.Router();

router.post('/join', authController.join);
router.post('/login', authController.login);
router.post('/koreapasJoin', authController.koreapasJoin);
router.post('/koreapasLogin', authController.koreapasLogin);
router.post('/koreapasVerify', authController.koreapasVerify);
router.get('/logout', authController.logout);
router.post('/sendEmail', authController.sendEmail);
router.post('/certifyEmail', authController.certifyEmail);
router.post('/nicknameCheck', authController.nicknameCheck);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/refreshAccessToken', authController.refreshAccessToken);

export default router;
