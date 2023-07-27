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
      candidateId: applyUser[0]._id,
      pnp: pnp,
      applyMajor1: applyMajor1,
      applyMajor2: applyMajor2,
      applySemester: applySemester,
      applyTimes: applyTimes,
      applyGPA: applyGPA,
      applyDescription: applyDescription
    });

    await newApplication.save();
  } catch {
    console.log('error');
  }
};
