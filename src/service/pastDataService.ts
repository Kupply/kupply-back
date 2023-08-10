import { Types } from 'mongoose';
import Application from '../models/applicationModel';
import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';

type numberToMajorType = {
    [key : number] : string;
}
type pastDataType = {
    [key : string] : object;
}
type numberToSemesterType = {
    [key : number] : string;
}
//number id와 major name을 매핑하는 객체
const numberToMajor : numberToMajorType = {
    1 : "경영학과", 2 : "경제학과", 3 : "통계학과", 4 : "정치외교학과", 5 : "국제학부",
    6 : "미디어학부", 7 : "심리학부", 8 : "전기전자공학부", 9 : "화공생명공학과",
    10 : "신소재공학부", 11 : "산업경영공학부", 12 : "건축사회환경공학부",
    13 : "컴퓨터학과", 14 : "데이터학과"
}
//number id와 Semester를 매핑하는 객체
const numberToSemester : numberToSemesterType = {
    1 : "2022-2", 2: "2022-1", 3 : "2021-2", 4 : "2021-1"
}

export const getPastData = async (userId: Types.ObjectId) => {
    //user 정보를 가져온다.
    const user = await User.find({_id : userId});

    //데이터를 담을 빈 객체를 선언한다.
    const pastDataArray : pastDataType = {};

    for (let i = 1; i < 15; ++i){
        //major를 이름을 통해 가져와서 각 전공의 최신 과거 데이터를 가져온다.
        const majorData = await Major.find({name : numberToMajor[i]});

        //전공명이 DB에 없다면 skip
        if (majorData.length === 0){
            continue;
        }

        const majorApplyData = await Application.find({applyMajor1 : majorData[0]._id, applySemester : "2022-2"});

        //전공에 해당되는 데이터가 없어도 skip
        if (majorApplyData.length === 0){
            continue;
        }

        // 지원 데이터 중 그래프에 필요한 정보만 추출한다.
        const returnApplyData = majorApplyData.map(applyData => ({
            applyGPA: applyData.applyGPA,
            applyMajor: applyData.applyMajor1,
            applyTimes: applyData.applyTimes,
            isPassed: applyData.pnp
        }));

        // 지원 데이터 중 합격자 데이터만 빼 놓는다.
        const returnApplyData_passed = returnApplyData.filter(applyData => applyData.isPassed === "PASS");

        //평균, 최솟값, 전체 지원자 수의 통계를 계산한다.
        const applyGPAValues = returnApplyData.map(data => data.applyGPA);

        const averageGPA = applyGPAValues.reduce((a, b)=> a + b) / applyGPAValues.length;
        const minimumGPA = Math.min(...applyGPAValues);
        const numberOfData = applyGPAValues.length;

        // 학점을 정렬하여 중앙값을 구한다.
        const sortedApplyGPAValues = applyGPAValues.sort((a, b) => b - a);
        const medianGPA = sortedApplyGPAValues[Math.floor(sortedApplyGPAValues.length / 2)];

        //합격자에 대한 통계도 구해 준다.
        const applyGPAValues_passed = returnApplyData_passed.map(data => data.applyGPA);

        const averageGPA_passed = applyGPAValues_passed.reduce((a, b)=> a + b) / applyGPAValues_passed.length;
        const minimumGPA_passed = Math.min(...applyGPAValues_passed);
        const numberOfData_passed = applyGPAValues_passed.length;

        const sortedApplyGPAValues_passed = applyGPAValues_passed.sort((a, b) => b - a);
        const medianGPA_passed = sortedApplyGPAValues_passed[Math.floor(sortedApplyGPAValues.length / 2)];

        //return할 객체 배열에 담을 데이터를 정의한다.
        const majorReturnData = {
            overallData : {
                returnApplyData,
                averageGPA,
                minimumGPA,
                medianGPA,
                numberOfData
            },
            passedData : {
                returnApplyData_passed,
                averageGPA_passed,
                minimumGPA_passed,
                medianGPA_passed,
                numberOfData_passed
            }
        }

        pastDataArray[numberToMajor[i]] = majorReturnData;
    }

    //user 정보와 과거 데이터들을 객체에 담아 전송한다.
    return {user, pastDataArray};
}

export const getPastData_major = async (userId: Types.ObjectId, majorID: number) => {
    //user 정보를 가져온다.
    const user = await User.find({_id : userId});

    //데이터를 담을 빈 객체를 선언한다.
    const pastDataArray : pastDataType = {};

    for(let i = 1; i < 5 ; ++i){
        //major를 이름을 통해 가져와서 각 전공의 최신 과거 데이터를 가져온다.
        const majorData = await Major.find({name : numberToMajor[majorID]});

        //전공명이 DB에 없다면 skip
        if (majorData.length === 0){
            continue;
        }

        const majorApplyData_semester = await Application.find({applyMajor1: majorData[0]._id, applySemester: numberToSemester[i]});

        //전공에 해당되는 데이터가 없어도 skip
        if (majorApplyData_semester.length === 0){
            continue;
        }

        // 지원 데이터 중 그래프에 필요한 정보만 추출한다.
        const returnApplyData = majorApplyData_semester.map(applyData => ({
            applyGPA: applyData.applyGPA,
            applyMajor: applyData.applyMajor1,
            applyTimes: applyData.applyTimes,
            isPassed: applyData.pnp
        }));

        // 지원 데이터 중 합격자 데이터만 빼 놓는다.
        const returnApplyData_passed = returnApplyData.filter(applyData => applyData.isPassed === "PASS");

        //평균, 최솟값, 전체 지원자 수의 통계를 계산한다.
        const applyGPAValues = returnApplyData.map(data => data.applyGPA);

        const averageGPA = applyGPAValues.reduce((a, b)=> a + b) / applyGPAValues.length;
        const minimumGPA = Math.min(...applyGPAValues);
        const numberOfData = applyGPAValues.length;

        // 학점을 정렬하여 중앙값을 구한다.
        const sortedApplyGPAValues = applyGPAValues.sort((a, b) => b - a);
        const medianGPA = sortedApplyGPAValues[Math.floor(sortedApplyGPAValues.length / 2)];

        //합격자에 대한 통계도 구해 준다.
        const applyGPAValues_passed = returnApplyData_passed.map(data => data.applyGPA);

        const averageGPA_passed = applyGPAValues_passed.reduce((a, b)=> a + b) / applyGPAValues_passed.length;
        const minimumGPA_passed = Math.min(...applyGPAValues_passed);
        const numberOfData_passed = applyGPAValues_passed.length;

        const sortedApplyGPAValues_passed = applyGPAValues_passed.sort((a, b) => b - a);
        const medianGPA_passed = sortedApplyGPAValues_passed[Math.floor(sortedApplyGPAValues.length / 2)];

        //return할 객체 배열에 담을 데이터를 정의한다.
        const majorReturnData = {
            overallData : {
                returnApplyData,
                averageGPA,
                minimumGPA,
                medianGPA,
                numberOfData
            },
            passedData : {
                returnApplyData_passed,
                averageGPA_passed,
                minimumGPA_passed,
                medianGPA_passed,
                numberOfData_passed
            }
        }

        pastDataArray[numberToSemester[i]] = majorReturnData;
    }

    //user 정보와 과거 데이터들을 객체에 담아 전송한다.
    return {user, pastDataArray};
}