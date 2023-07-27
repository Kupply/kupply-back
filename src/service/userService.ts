import userModel from "../models/userModel";
import bcrypt from 'bcrypt';

const userData = {
  password: 'mypassword0',
  studentId: 2021160009,
  email: '2021160009@korea.ac.kr',
  firstMajor: 'mathematics',
  name: 'Goo Won Jeong',
  nickname: 'Goo Won Jeong',
  role: 'candidate',
};

export const joinUser = async (userData: any) => {
  try {
    // 비밀번호 암호화
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 암호화된 비밀번호로 유저 생성
    /*const newUser = new userModel({
      password: hashedPassword,
      studentId: userData.studentId,
      email: userData.email,
      firstMajor: userData.firstMajor,
      name: userData.name,
      nickname: userData.nickname,
      role: userData.role,
    });*/
    const newUser = new userModel(userData);
    const joinUser = await newUser.save();
    return joinUser;
  } catch (error) {
    console.error(error);
  }
};