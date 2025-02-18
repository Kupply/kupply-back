import { Types } from 'mongoose';

import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import Application from '../models/applicationModel';
import ApplyMetaData from '../models/applicationMetaDataModel';
import { getRecent4Semester } from '../utils/semester';
import { MajorOptions, majorNameMapping } from '../common/mapping';

type numberToMajorType = {
  [key: number]: string;
};
type pastDataType = {
  [key: string]: object;
};
//number id와 major name을 매핑하는 객체
const numberToMajor: numberToMajorType = {
  1: '경영학과',
  2: '경제학과',
  3: '통계학과',
  4: '정치외교학과',
  5: '국제학부',
  6: '미디어학부',
  7: '심리학부',
  8: '전기전자공학부',
  9: '화공생명공학과',
  10: '신소재공학부',
  11: '산업경영공학부',
  12: '건축사회환경공학부',
  13: '컴퓨터학과',
  14: '데이터학과',
};

export const getPastData = async (userId: Types.ObjectId) => {
  //user 정보를 가져온다.
  const user = await User.find({ _id: userId });

  //데이터를 담을 빈 객체를 선언한다.
  const pastDataArray: pastDataType = {};

  for (let i = 1; i < 15; ++i) {
    //major를 이름을 통해 가져와서 각 전공의 최신 과거 데이터를 가져온다.
    const majorData = await Major.find({ name: numberToMajor[i] });

    //전공명이 DB에 없다면 skip
    if (majorData.length === 0) {
      continue;
    }

    const majorApplyData = await Application.find({
      applyMajor1: majorData[0]._id,
      applySemester: '2022-2',
    });

    //전공에 해당되는 데이터가 없어도 skip
    if (majorApplyData.length === 0) {
      continue;
    }

    // 지원 데이터 중 그래프에 필요한 정보만 추출한다.
    const returnApplyData = majorApplyData.map((applyData) => ({
      applyGPA: applyData.applyGPA,
      applyMajor: applyData.applyMajor1,
      applyTimes: applyData.applyTimes,
      isPassed: applyData.pnp,
    }));

    // 지원 데이터 중 합격자 데이터만 빼 놓는다.
    const returnApplyData_passed = returnApplyData.filter(
      (applyData) => applyData.isPassed === 'PASS',
    );

    //평균, 최솟값, 전체 지원자 수의 통계를 계산한다.
    const applyGPAValues = returnApplyData.map((data) => data.applyGPA);

    const averageGPA =
      applyGPAValues.reduce((a, b) => a + b) / applyGPAValues.length;
    const minimumGPA = Math.min(...applyGPAValues);
    const numberOfData = applyGPAValues.length;

    // 학점을 정렬하여 중앙값을 구한다.
    const sortedApplyGPAValues = applyGPAValues.sort((a, b) => b - a);
    const medianGPA =
      sortedApplyGPAValues[Math.floor(sortedApplyGPAValues.length / 2)];

    //합격자에 대한 통계도 구해 준다.
    const applyGPAValues_passed = returnApplyData_passed.map(
      (data) => data.applyGPA,
    );

    const averageGPA_passed =
      applyGPAValues_passed.reduce((a, b) => a + b) /
      applyGPAValues_passed.length;
    const minimumGPA_passed = Math.min(...applyGPAValues_passed);
    const numberOfData_passed = applyGPAValues_passed.length;

    const sortedApplyGPAValues_passed = applyGPAValues_passed.sort(
      (a, b) => b - a,
    );
    const medianGPA_passed =
      sortedApplyGPAValues_passed[Math.floor(sortedApplyGPAValues.length / 2)];

    //return할 객체 배열에 담을 데이터를 정의한다.
    const majorReturnData = {
      overallData: {
        returnApplyData,
        averageGPA,
        minimumGPA,
        medianGPA,
        numberOfData,
      },
      passedData: {
        returnApplyData_passed,
        averageGPA_passed,
        minimumGPA_passed,
        medianGPA_passed,
        numberOfData_passed,
      },
    };

    pastDataArray[numberToMajor[i]] = majorReturnData;
  }

  //user 정보와 과거 데이터들을 객체에 담아 전송한다.
  return { user, pastDataArray };
};

type GPAData = {
  gpa: number;
  num: number;
};

function findClosestKey(map: Map<number, number>, target: number): number {
  if (map.has(target)) {
    return target;
  }

  let closestKey = target;
  let closestDifference = Infinity;

  for (const key of map.keys()) {
    const difference = Math.abs(target - key);
    if (difference < closestDifference) {
      closestDifference = difference;
      closestKey = key;
    }
  }

  return closestKey;
}

export const getPastDataByMajorAndSemester = async (
  majorName: string,
  semester: string,
) => {
  //major를 이름을 통해 가져와서 각 전공의 최신 과거 데이터를 가져온다.
  const majorData = await Major.findOne({
    name: majorNameMapping[majorName as MajorOptions],
  });

  //전공명이 DB에 없다면 skip
  if (!majorData) {
    throw {
      status: 400,
      message: '존재하지 않는 전공입니다. 다시 확인해 주세요.',
    };
  }

  /*
  필요한 데이터 정리
  1. 선발인원, 지원자 수, 합격자 수, 합격자 학점 통계값
  2. 합격자 학점 분포 => (학점, 학점별 합격자 수) 리스트
  3. 'all'에 대한 처리
  */

  // 초기값
  let recruitNumber: number = 0;
  let appliedNumber: number = 0;
  let passedNumber: number = 0;
  let passedAvgGPAData: GPAData = { gpa: 0, num: 0 };
  let passedMedianGPAData: GPAData = { gpa: 0, num: 0 };
  let passedModeGPAData: GPAData = { gpa: 0, num: 0 };
  let passedMinimumGPAData: GPAData = { gpa: 0, num: 0 };
  let passedGPACountArray: GPAData[] = [];

  const recent4Semester = getRecent4Semester();
  if (semester === 'all') {
    // 최근 4학기의 통계값은 결국 직접 계산해야한다.
    const passedApplicationData = await Application.find({
      $or: [{ applyMajor1: majorData._id }, { applyMajor2: majorData._id }],
      applySemester: { $in: recent4Semester },
      pnp: 'PASS',
    });

    const metadata = await ApplyMetaData.find({
      major: majorData._id,
      semester: { $in: recent4Semester },
    });

    recruitNumber = metadata
      .map((data) => data.recruitNumber ?? 0)
      .reduce((a, b) => a + b, 0);
    appliedNumber = metadata
      .map((data) => data.appliedNumber ?? 0)
      .reduce((a, b) => a + b, 0);
    passedNumber = passedApplicationData.length;

    // 전공에 해당되는 데이터가 없을 때
    if (passedApplicationData.length === 0) {
      return {
        metadata: {
          recruitNumber,
          appliedNumber,
          passedNumber,
          passedAvgGPAData,
          passedMedianGPAData,
          passedModeGPAData,
          passedMinimumGPAData,
        },
        passedData: passedGPACountArray,
      };
    }

    // gpa만 추출
    const passedApplicationGPA = passedApplicationData.map(
      (data) => data.applyGPA,
    );

    // 각 gpa 별 합격자 수
    const passedGPACountMap: Map<number, number> = new Map();
    passedApplicationGPA.forEach((gpa) => {
      if (passedGPACountMap.has(gpa)) {
        passedGPACountMap.set(gpa, passedGPACountMap.get(gpa)! + 1);
      } else {
        passedGPACountMap.set(gpa, 1);
      }
    });

    // 합격자 평균 GPA
    const meanGPA_passed = parseFloat(
      (
        passedApplicationGPA.reduce((a, b) => a + b) /
        passedApplicationGPA.length
      ).toFixed(2),
    );
    const meanGPANum_passed = passedGPACountMap.get(
      findClosestKey(passedGPACountMap, meanGPA_passed),
    )!;
    passedAvgGPAData = {
      gpa: meanGPA_passed,
      num: meanGPANum_passed,
    };

    // 합격자 최소 GPA
    const minimumGPA_passed = Math.min(...passedApplicationGPA);
    const minimumGPANum_passed = passedGPACountMap.get(minimumGPA_passed)!;
    passedMinimumGPAData = {
      gpa: minimumGPA_passed,
      num: minimumGPANum_passed,
    };

    // 합격자 중앙 GPA
    const sortedpassedApplicationGPA = passedApplicationGPA.sort(
      (a, b) => b - a,
    );
    const medianGPA_passed =
      sortedpassedApplicationGPA[
        Math.floor(sortedpassedApplicationGPA.length / 2)
      ];
    const medianGPANum_passed = passedGPACountMap.get(medianGPA_passed)!;
    passedMedianGPAData = {
      gpa: medianGPA_passed,
      num: medianGPANum_passed,
    };

    // 합격자 최빈 GPA
    let modeGPA_passed: number = 0;
    let modeGPANum_passed: number = 0;

    passedGPACountMap.forEach((count, gpa) => {
      if (count > modeGPANum_passed) {
        modeGPA_passed = gpa;
        modeGPANum_passed = count;
      }
    });

    passedModeGPAData = {
      gpa: modeGPA_passed,
      num: modeGPANum_passed,
    };

    // 합격자 GPA 분포
    passedGPACountArray = Array.from(passedGPACountMap.entries()).map(
      ([gpa, num]) => ({
        gpa,
        num,
      }),
    );

    return {
      metadata: {
        recruitNumber,
        appliedNumber,
        passedNumber,
        passedAvgGPAData,
        passedMedianGPAData,
        passedModeGPAData,
        passedMinimumGPAData,
      },
      passedData: passedGPACountArray,
    };
  } else {
    const passedApplicationData = await Application.find({
      $or: [{ applyMajor1: majorData._id }, { applyMajor2: majorData._id }],
      applySemester: semester,
      pnp: 'PASS',
    });

    const metadata = await ApplyMetaData.findOne({
      major: majorData._id,
      semester,
    });

    recruitNumber = metadata?.recruitNumber ?? 0;
    appliedNumber = metadata?.appliedNumber ?? 0;
    passedNumber = passedApplicationData.length;

    // 전공에 해당되는 데이터가 없을 때
    if (
      passedApplicationData.length === 0 ||
      !metadata ||
      !metadata.passedGPAavg ||
      !metadata.passedGPAmed ||
      !metadata.passedGPAmode ||
      !metadata.passedGPAmin
    ) {
      return {
        metadata: {
          recruitNumber,
          appliedNumber,
          passedNumber,
          passedAvgGPAData,
          passedMedianGPAData,
          passedModeGPAData,
          passedMinimumGPAData,
        },
        passedData: passedGPACountArray,
      };
    }

    // gpa만 추출
    const passedApplicationGPA = passedApplicationData.map(
      (data) => data.applyGPA,
    );
    const passedGPACountMap: Map<number, number> = new Map();
    passedApplicationGPA.forEach((gpa) => {
      if (passedGPACountMap.has(gpa)) {
        passedGPACountMap.set(gpa, passedGPACountMap.get(gpa)! + 1);
      } else {
        passedGPACountMap.set(gpa, 1);
      }
    });

    // 합격자 평균 GPA
    const meanGPA_passed = metadata.passedGPAavg;
    const meanGPANum_passed = passedGPACountMap.get(
      findClosestKey(passedGPACountMap, meanGPA_passed),
    )!;
    passedAvgGPAData = {
      gpa: meanGPA_passed,
      num: meanGPANum_passed,
    };

    // 합격자 최소 GPA
    const minimumGPA_passed = metadata.passedGPAmin;
    const minimumGPANum_passed = passedGPACountMap.get(minimumGPA_passed)!;
    passedMinimumGPAData = {
      gpa: minimumGPA_passed,
      num: minimumGPANum_passed,
    };

    // 합격자 중앙 GPA
    const medianGPA_passed = metadata.passedGPAmed;
    const medianGPANum_passed = passedGPACountMap.get(medianGPA_passed)!;
    passedMedianGPAData = {
      gpa: medianGPA_passed,
      num: medianGPANum_passed,
    };

    // 합격자 최빈 GPA
    const modeGPA_passed = metadata.passedGPAmode;
    const modeGPANum_passed = passedGPACountMap.get(modeGPA_passed)!;
    passedModeGPAData = {
      gpa: modeGPA_passed,
      num: modeGPANum_passed,
    };

    // 합격자 GPA 분포
    passedGPACountArray = Array.from(passedGPACountMap.entries()).map(
      ([gpa, num]) => ({
        gpa,
        num,
      }),
    );

    return {
      metadata: {
        recruitNumber,
        appliedNumber,
        passedNumber,
        passedAvgGPAData,
        passedMedianGPAData,
        passedModeGPAData,
        passedMinimumGPAData,
      },
      passedData: passedGPACountArray,
    };
  }
};
