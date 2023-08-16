import nodemailer from 'nodemailer';

export const sendAuthEmail = async (
  name: string,
  emailTo: string,
  certificateToken: string,
) => {
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
    subject: 'KUPPLY 회원가입 인증 메일',
    html: `<h1>이메일 인증</h1>
        <h2>안녕하세요 ${name}님</h2>
        <p>KUPPLY에 회원가입해주셔서 감사합니다. 아래 링크로 이동해 회원가입을 완료해주세요!</p>
        <p>만약에 실수로 요청하셨거나, 본인이 요청하지 않았다면, 이 메일을 무시하세요.</p>
        <a href=http://localhost:${
          process.env.PORT || 8080
        }/certify/${certificateToken}> 계속하기</a>
        </div>`,
  };

  await smtpTransport.sendMail(mailOptions);
};
