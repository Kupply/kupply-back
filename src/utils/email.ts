import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
export const sendAuthEmail = async (emailTo: string, code: string) => {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailTo,
    subject: 'KUPPLY 회원가입 인증번호',
    html: `인증번호: ${code}`,
  };

  await smtpTransport.sendMail(mailOptions);
};
