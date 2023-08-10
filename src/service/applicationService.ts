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
    // user의 이번 학기 지원 데이터를 찾는다.
    const userApplyData = await Application.findOne({ candidateId: userId, applySemester: "2023-1" });

    if (!userApplyData) {
      throw new Error("해당 사용자의 지원 데이터를 찾을 수 없습니다.");
    }

    //학점 데이터를 따로 빼서 저장함.
    const myGPA = userApplyData.applyGPA; 

    // 지원 1지망이 user와 일치하는 모든 이번 학기 지원 데이터를 가져온다.
    const allApplyData = await Application.find({
      applyMajor1: userApplyData.applyMajor1,
      applySemester: userApplyData.applySemester
    });

    // 지원 데이터 중 그래프에 필요한 정보만 추출한다.
    const returnApplyData = allApplyData.map(applyData => ({
      applyGPA: applyData.applyGPA,
      applyMajor: applyData.applyMajor1,
      applyTimes: applyData.applyTimes,
      isPassed: applyData.pnp
    }));

    // 재지원 횟수가 일치하는 정보를 따로 빼 놓는다.
    const returnApplyData_sameApplyTimes = returnApplyData.filter(applyData => applyData.applyTimes === userApplyData.applyTimes);
    
    //평균, 최솟값의 통계를 계산한다.
    const applyGPAValues = returnApplyData.map(data => data.applyGPA);

    const averageGPA = applyGPAValues.reduce((a, b)=> a + b) / applyGPAValues.length;
    const minimumGPA = Math.min(...applyGPAValues);
    const numberOfData = applyGPAValues.length;

    // 학점을 정렬하여 중앙값과 현재 유저의 등수를 구한다.
    const sortedApplyGPAValues = applyGPAValues.sort((a, b) => b - a);
    const medianGPA = sortedApplyGPAValues[Math.floor(sortedApplyGPAValues.length / 2)];
    const myGPAIndex = sortedApplyGPAValues.findIndex(gpa => gpa === myGPA) + 1;

    const applyGPAValues_sameApplyTimes = returnApplyData_sameApplyTimes.map(data => data.applyGPA);

    const numberOfData_sameApplyTimes = applyGPAValues_sameApplyTimes.length;
    const averageGPA_sameApplyTimes = applyGPAValues_sameApplyTimes.reduce((a, b)=> a + b) / applyGPAValues_sameApplyTimes.length;
    const minimumGPA_sameApplyTimes = Math.min(...applyGPAValues_sameApplyTimes);

    const sortedApplyGPAValues_sameApplyTimes = applyGPAValues_sameApplyTimes.sort((a, b) => b - a);
    const medianGPA_sameApplyTimes = sortedApplyGPAValues_sameApplyTimes[Math.floor(sortedApplyGPAValues_sameApplyTimes.length / 2)];
    const myGPAIndex_sameApplyTimes = sortedApplyGPAValues_sameApplyTimes.findIndex(gpa => gpa === myGPA) + 1;

    //데이터를 반환할 객체를 정의한다.
    const returnData = {
      userApplyData,
      overallData : {
        returnApplyData,
        numberOfData,
        averageGPA,
        minimumGPA,
        medianGPA,
        myGPAIndex
      },
      sameApplyTimesData : {
        returnApplyData_sameApplyTimes,
        numberOfData_sameApplyTimes,
        averageGPA_sameApplyTimes,
        minimumGPA_sameApplyTimes,
        medianGPA_sameApplyTimes,
        myGPAIndex_sameApplyTimes
      }
    };

    return returnData;
  } catch (error) {
    throw error;
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