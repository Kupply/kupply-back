import Major, { IMajor } from '../models/majorModel';
import * as majorValue from '../utils/major';

export const getAllMajors = async () => {
  const majors = await Major.find();
  return majors;
};

export const createMajor = async (majorData: IMajor) => {
  const major = await Major.create(majorData);
  return major;
};

export const getMajor = async (majorId: string) => {
  const major = await Major.findById(majorId);

  if (!major) {
    throw { status: 404, message: 'No major found with this id' };
  }

  return major;
};

export const updateMajor = async (majorId: string, majorData: IMajor) => {
  const major = await Major.findByIdAndUpdate(majorId, majorData, {
    new: true,
    runValidators: true,
  });

  if (!major) {
    throw { status: 404, message: 'No major found with this id' };
  }

  return major;
};

export const deleteMajor = async (majorId: string) => {
  const major = await Major.findByIdAndDelete(majorId);

  if (!major) {
    throw { status: 404, message: 'No major found with this id' };
  }

  return;
};

export const updateMajors = async () => {
  const allMajor = majorValue.majorAllList;
  const targetMajor = majorValue.majorTargetList;
  const cardMapping = majorValue.cardMapping;
  const collegeShortEngMapping = majorValue.collegeShortEngMapping;
  const majorShortEngMapping = majorValue.majorShortEngMapping;

  for (let i = 0; i < allMajor.length; i++) {
    const majorName = allMajor[i].value1;
    const collegeName = allMajor[i].value2;

    const major = await Major.findOne({ name: majorName });

    if (!major) {
      console.log(majorName, 'not found');
      continue;
    }

    major.collegeName = collegeName;

    const target = targetMajor.find(
      (target) => target.value1 === majorName && target.value2 === collegeName,
    );

    if (target) {
      // 모의지원 가능한 학과
      const cardData = cardMapping.find((card) => card.korName === majorName);

      if (!cardData) {
        console.log(majorName, 'card not found');
        continue;
      }

      major.shortEngName =
        majorShortEngMapping[majorName as keyof typeof majorShortEngMapping];
      major.longEngName = cardData.engName;
      major.shortCollegeEngName =
        collegeShortEngMapping[
          collegeName as keyof typeof collegeShortEngMapping
        ];
      major.filter = cardData.filter;
      major.appliable = true;
    } else {
      // 모의지원 불가능한 학과
      // 이후에 추가 작업 불필요
      major.appliable = false;
      major.filter = undefined;
    }

    await major.save();
  }

  return;
};
