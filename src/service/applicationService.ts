import { Types } from 'mongoose';
import Application from '../models/applicationModel';
import User, { IUser } from '../models/userModel';

type applyDataType = {
  userId: Number,
  pnp: string,
  applyMajor1: string,
  applyMajor2: string,
  applySemester: string,
  applyTimes: string,
  applyGPA: string,
  applyDescription: string
};

export const createApplicationData = async (applyData: applyDataType) => {
  try {
    const {userId, pnp, applyMajor1, applyMajor2, applySemester, 
      applyTimes, applyGPA, applyDescription} = applyData;  

    const applyUser:Array<IUser> = await User.find({studentId: userId}).exec();  //DB에서 User를 가져온다.

    const newApplication = new Application({
      candidateId: applyUser[0]._id,  //Typescript 오류가 떠서, 배열을 통해 받은 뒤 User가 겹치지 않으므로 첫 번째 원소의 _id 참조
      pnp: pnp,
      applyMajor1: applyMajor1,
      applyMajor2: applyMajor2,       //Major Data의 경우 ObjectId를 받는 경우를 상정함.
      applySemester: applySemester,
      applyTimes: applyTimes,
      applyGPA: applyGPA,
      applyDescription: applyDescription
    });

    await newApplication.save();  //DB에 application 데이터를 저장한다.
  } catch {
    console.log('error');
  }
};

export const getApplicationData = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);

    return user;    //DB에서 Id로 user를 찾아서 보내 준다.
  } catch {
    console.log('error');
  }
};

