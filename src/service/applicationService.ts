import { Types } from 'mongoose';
import Application from '../models/applicationModel';
import User, { IUser } from '../models/userModel';

type applyDataType = {
  candidateId: Types.ObjectId,
  pnp: string,
  applyMajor1: Types.ObjectId,
  applyMajor2: Types.ObjectId,
  applySemester: string,
  applyTimes: string,
  applyGPA: string,
  applyDescription: string
};

export const createApplicationData = async (applyData: applyDataType) => {
  try {
    const {candidateId, pnp, applyMajor1, applyMajor2, applySemester, 
      applyTimes, applyGPA, applyDescription} = applyData;  

    //유효성 검사를 위해 지원 데이터가 존재하는 유저의 것인지, 중복되는지 확인한다.
    const isAlreadyExist = (await Application.find({candidateId: candidateId, applySemester: applySemester})).length;
    const isUserValid = (await User.find({_id: candidateId})).length;

    if(applySemester !== "2023-1"){
      throw new Error("현재 학기가 아닌 지원 정보는 추가할 수 없습니다.");
    }
    else if(isUserValid === 0){
      throw new Error("존재하지 않는 사용자입니다.");
    }
    else if(isAlreadyExist > 0){
      throw new Error("이미 해당 학기의 지원 정보가 있습니다.");
    }
    else{
      const newApplication = new Application(applyData);
      await newApplication.save();  //DB에 application 데이터를 저장한다.
    }
  } catch (error) {
    console.log(error);
  }
};

export const getApplicationData = async (userId: Types.ObjectId) => {
  try {
    const user = await Application.findOne({candidateId: userId, applySemester: "2023-1"});

    return user;    //DB에서 Id로 user를 찾아서 보내 준다.
  } catch {
    console.log('error');
  }
};

export const deleteApplicationData = async (userId: Types.ObjectId) => {
  try {
    const user = await Application.findOneAndDelete({candidateId: userId, applySemester: "2023-1"});

    return user;    //삭제 이후 삭제한 user 데이터를 보내 준다.
  } catch {
    console.log('error');
  }
};

export const updateApplicationData = async (applyData: applyDataType) => {
  try {
    const { candidateId, applySemester } = applyData; //applyData를 받아 온다.
    const isUserValid = (await User.find({_id: candidateId})).length; //유효성 검사를 위해 실제 존재하는 User인지 검사한다.

    if(applySemester !== "2023-1"){
      throw new Error("현재 학기가 아닌 지원 정보는 추가할 수 없습니다.");
    }
    else if(isUserValid === 0){
      throw new Error("존재하지 않는 사용자입니다.");
    }
    else{
      await Application.updateOne({candidateId, applySemester}, applyData);     //지원 학기, 지원자가 일치하는 데이터를 찾아 수정한다.
    }
  } catch (error) {
    console.log(error);
  }
};