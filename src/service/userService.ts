import userModel from "../models/userModel";
import majorModel from "../models/majorModel";
import bcrypt from 'bcrypt';

export const initMajors = async () => {
  const majors = ['ComputerScience', 'Mathematics', 'DataScience'];

  // Promise.all을 사용하여 모든 major를 동시에 생성
  const majorPromises = majors.map(major => majorModel.create({name: major}));

  return Promise.all(majorPromises);
}

export const joinUser = async () => {
  try {
    // 비밀번호 암호화
    //const saltRounds = 10;
    //const salt = await bcrypt.genSalt(saltRounds);
    //const hashedPassword = await bcrypt.hash(userData.password, salt);

    const majors = await initMajors();

    // 데이터베이스에 추가된 각 학과의 `_id`를 가져오기
    const [computerScience, mathematics, dataScience] = majors.map(major => major._id);
 
    // 암호화된 비밀번호로 유저 생성
    const newUser = new userModel({
      password: 'hashedPassword!!',
      studentId: 2021160011,
      email: "2021160011@korea.ac.kr",
      firstMajor: dataScience,
      name: "Goo three Jeong",
      nickname: "three",
      role: "passer",
      secondMajor: mathematics,
      passSemester: "2020-1",
      passDescription: "Nothing",
      passGPA: 4.0,
      wannaSell: 1,
      hopeMajors: 'computerScience',
    });

    const joinUser = await newUser.save();
    return joinUser;
  } catch (error) {
    console.error(error);
  }
};