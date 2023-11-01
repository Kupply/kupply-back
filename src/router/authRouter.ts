import express from 'express';
import * as authController from '../controller/authController';

const router = express.Router();

router.post('/join', authController.join);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/sendEmail', authController.sendEmail);
router.post('/certifyEmail', authController.certifyEmail);
router.post('/nicknameCheck', authController.nicknameCheck);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/refreshAccessToken', authController.refreshAccessToken);

export default router;
