import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAuthEmail = async (emailTo: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailTo,
    subject: 'KUPPLY 회원가입 인증번호',
    html: `인증번호: ${code}`,
  };

  await smtpTransport.sendMail(mailOptions);
};

export const sendTempPassword = async (
  emailTo: string,
  tempPassword: string,
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailTo,
    subject: 'KUPPLY 임시 비밀번호',
    html: `임시 비밀번호: ${tempPassword}`,
  };

  await smtpTransport.sendMail(mailOptions);
};
