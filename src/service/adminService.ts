import User from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import Application from '../models/applicationModel';
import ApplyMetaData from '../models/applicationMetaDataModel';
import * as s3 from '../utils/s3';
import * as semester from '../utils/semester';
import * as majorValue from '../utils/major';

export const updateApplication = async () => {
  // 포털에 올라오는 2024년도 2학기 이중전공자 합격자 명단은 2024년도 1학기에 이중 '지원'한 사람들 중 합격한 사람들이다.
  // 서비스 모의지원의 경우, 모의지원 데이터의 'applySemester'의 값이 2024-1인 사람들이다.
  // 이중전공자 합격자 명단이 올라와서 이 API를 호출하는 시점은 2024년도 1학기이다. (매년 7월, 1월에 합격자 명단이 발표될 때)
  const currentSemester = semester.getCurrentSemester(); // 이중 '지원'한 학기, 합격자 명단이 올라온 학기, 서비스 데이터에 저장되는 학기
  // 이중 '진입'하는 학기, 포털에 올라오는 합격자 명단의 학기
  // => 합격자 명단의 파일 명을 쿠플라이 서비스에 맞춰 현재학기(= 지원한 학기)로 한다.

  // 모의지원자들 중 합격자 수, 불합격자(합격자 리스트에 없는 사람들) 수
  let passCount = 0, // 모의지원자 중 합격자 수
    failCount = 0, // 모의지원자 중 불합격자 수
    diffCount = 0, // 모의지원자 중 합격했지만, 1,2 지망 학과와 실합격 학과가 일치하지 않는 사람 수
    totalCount = 0, // 전체 실 모집인원 수
    passButNotAppliedCount = 0; // 서비스 이용자 중에서 합격했지만, 모의지원하지 않은 사람 수
  let firstHopePasserCount = 0, // 모의지원자 중 1 지망 학과로 합격한 사람 수
    secondHopePasserCount = 0; // 모의지원자 중 2 지망 학과로 합격한 사람 수

  // 합격자 처리
  const passers = await s3.getCSVFromS3({
    Key: `passers/${currentSemester}.csv`,
  });

  console.log('Get passers from s3 Success');

  for (const passer of passers) {
    // 0. 데이터 수 세기
    totalCount += 1;

    // 1. 일치하는 사용자 찾기
    const studentIdRegex = new RegExp(
      `^${passer['학번'].replace(/\*/g, '.*')}$`,
    );
    const nameRegex = new RegExp(`^${passer['성명'].replace(/\*/g, '.*')}$`);

    const users = await User.find({
      studentId: studentIdRegex,
      name: nameRegex,
    });

    if (users.length === 0) {
      console.log('일치하는 사용자가 없습니다.\n', passer);
      continue;
    }

    const secondMajor = await Major.findOne({
      name: passer['이중전공학과'],
    });

    if (!secondMajor) {
      console.log('이중전공 학과가 존재하지 않습니다.\n', passer);
      continue;
    }

    let user = users[0];

    if (users.length > 1) {
      // 일치하는 학생이 여러 명일 경우, 모의지원한 이중전공 학과가 일치하는 학생을 찾는다.
      for (const u of users) {
        const application = await Application.findOne({
          candidateId: u._id,
          applySemester: currentSemester,
        });

        if (
          application &&
          (application.applyMajor1.toString() === secondMajor._id.toString() ||
            application.applyMajor2!.toString() === secondMajor._id.toString())
        ) {
          user = u;
          break;
        }
      }
    }

    // 2. 일치하는 모의지원 데이터 찾기
    const application = await Application.findOne({
      candidateId: user._id,
      applySemester: currentSemester,
    });

    if (!application) {
      passButNotAppliedCount += 1;
      console.log('이번 학기 지원 정보가 없습니다.\n', passer);
      continue;
    }

    if (
      application.applyMajor1.toString() !== secondMajor._id.toString() &&
      application.applyMajor2!.toString() !== secondMajor._id.toString()
    ) {
      console.log('이중전공 학과가 일치하지 않습니다.\n', passer, application);
      diffCount += 1;
      continue;
    }

    if (application.applyMajor1.toString() === secondMajor._id.toString()) {
      firstHopePasserCount += 1;
    }
    if (application.applyMajor2!.toString() === secondMajor._id.toString()) {
      secondHopePasserCount += 1;
    }

    // 3. 데이터 갱신
    application.pnp = 'PASS';
    passCount += 1;

    // 3-1. 이중 희망자 관련 데이터 삭제
    await User.updateOne(
      { _id: user._id },
      {
        $unset: {
          hopeMajor1: 1,
          hopeMajor2: 1,
          curGPA: 1,
          changeGPA: 1,
          isApplied: 1,
        },
      },
    );
    // 3-2. 이중 합격자 관련 데이터 추가
    user.role = 'passer';
    user.secondMajor = secondMajor._id;
    user.passSemester = application.applySemester; // 서비스 모의지원 학기 기준으로
    user.passGPA = application.applyGPA;

    await user.save();
    await application.save();

    console.log('Update Success\n', passer, user);
  }

  // 불합격자 처리 - 합격자 처리 후 남은 모의지원자들은 불합격자로 처리
  const users = await User.find({ isApplied: true });

  for (const user of users) {
    // 1. 사용자 모의 지원 정보 초기화
    user.isApplied = false;
    await user.save();

    // 2. 모의 지원 정보 불합격으로 변경
    const application = await Application.findOne({
      candidateId: user._id,
      applySemester: currentSemester,
    });

    application!.pnp = 'FAIL';
    failCount += 1;

    await application!.save();
  }

  return {
    passCount,
    failCount,
    diffCount,
    totalCount,
    passButNotAppliedCount,
    firstHopePasserCount,
    secondHopePasserCount,
  };
};

export const updateApplicationV2 = async () => {
  // 이메일 설문 기반 지원 현황 업데이트
  // 로직은 updateApplication과 동일하나, 지원 결과 파일의 형식이 다름 (일단 합격자 명단 -> 지원자 결과 명단으로 바뀜)

  // const currentSemester = semester.getCurrentSemester(); // 이중 '지원'한 학기, 합격자 명단이 올라온 학기, 서비스 데이터에 저장되는 학기
  const currentSemester = '2025-1';

  let passCount = 0,
    failCount = 0,
    diffCount = 0,
    totalCount = 0,
    passButNotAppliedCount = 0;
  let firstHopePasserCount = 0,
    secondHopePasserCount = 0;

  const results = await s3.getCSVFromS3({
    Key: `passers/${currentSemester}.csv`,
  });

  console.log('Get results from s3 Success');

  for (const result of results) {
    totalCount += 1;
    // 0. 입력 데이터 처리
    // 이메일에 '@korea.ac.kr' 도메인을 추가해주기
    const rawEmail = result['email'] ? result['email'].trim() : '';
    const rawPnp = result['pnp'] ? result['pnp'].trim() : '';
    const applyMajor = result['applyMajor'] ? result['applyMajor'].trim() : '';

    const email = rawEmail.includes('@') ? rawEmail : rawEmail + '@korea.ac.kr';
    const pnp = rawPnp === '합격' ? true : rawPnp === '불합격' ? false : null;

    // console.log(email, pnp, applyMajor);

    // 불합격자는 나중에 한 번에 처리
    if (pnp === false) {
      console.log('불합격자 이후에 한 번에 처리 예정\n', result);
      continue;
    }

    if (pnp === null) {
      console.log('합격/불합격 여부가 명확하지 않습니다.\n', result);
      continue;
    }

    // 1. 일치하는 합격자 찾기
    const users = await User.find({
      email: email,
    });

    if (users.length === 0) {
      console.log('일치하는 합격자가 없습니다.\n', result);
      continue;
    }

    // start with the first user as a default
    let user = users[0];

    if (users.length > 1) {
      // 고파스 연계 이후로 같은 이메일을 가지는 사용자가 여러 명일 수 있음
      // => koreapasUUID가 있는 사용자를 우선적으로 선택
      const koreapasUser = users.find((u: any) => !!u.koreapasUUID);
      if (koreapasUser) {
        user = koreapasUser;
      } else {
        // ambiguous: none has koreapasUUID. skip to avoid picking wrong account.
        console.log(
          '일치하는 사용자가 여러 명인데, koreapasUUID가 있는 사용자가 없어 처리를 건너뜁니다.\n',
          result,
          users.map((u) => ({ _id: u._id, studentId: u.studentId })),
        );
        continue;
      }
    }

    // 2. 일치하는 학과 찾기
    const secondMajor = await Major.findOne({ name: applyMajor });

    if (!secondMajor) {
      console.log('일치하는 학과가 없습니다.\n', result);
      continue;
    }

    // 3. 일치하는 모의지원 데이터 찾기
    const application = await Application.findOne({
      candidateId: user._id,
      applySemester: currentSemester,
    });

    if (!application) {
      passButNotAppliedCount += 1;
      console.log('이번 학기 지원 정보가 없습니다.\n', result);
      continue;
    }

    if (
      application.applyMajor1.toString() !== secondMajor._id.toString() &&
      application.applyMajor2!.toString() !== secondMajor._id.toString()
    ) {
      const applyMajor1 = await Major.findById(application.applyMajor1);
      const applyMajor2 = await Major.findById(application.applyMajor2);
      console.log(
        '이중전공 학과가 일치하지 않습니다.\n',
        secondMajor,
        applyMajor1,
        applyMajor2,
      );
      diffCount += 1;
      continue;
    }

    if (application.applyMajor1.toString() === secondMajor._id.toString()) {
      firstHopePasserCount += 1;
    }
    if (application.applyMajor2!.toString() === secondMajor._id.toString()) {
      secondHopePasserCount += 1;
    }

    // 4. 데이터 갱신
    application.pnp = 'PASS';
    passCount += 1;

    // 4-1. 이중 희망자 관련 데이터 삭제
    await User.updateOne(
      { _id: user._id },
      {
        $unset: {
          hopeMajor1: 1,
          hopeMajor2: 1,
          curGPA: 1,
          changeGPA: 1,
          isApplied: 1,
        },
      },
    );
    // 4-2. 이중 합격자 관련 데이터 추가
    user.role = 'passer';
    user.secondMajor = secondMajor._id;
    user.passSemester = application.applySemester; // 서비스 모의지원 학기 기준으로
    user.passGPA = application.applyGPA;

    await user.save();
    await application.save();

    console.log('Update Success\n', result, user);
  }

  // 불합격자 처리 - 합격자 처리 후 남은 모의지원자들은 불합격자로 처리
  const users = await User.find({ isApplied: true });

  for (const user of users) {
    // 1. 사용자 모의 지원 정보 초기화
    user.isApplied = false;
    await user.save();

    // 2. 모의 지원 정보 불합격으로 변경
    const application = await Application.findOne({
      candidateId: user._id,
      applySemester: currentSemester,
    });

    if (application) {
      application.pnp = 'FAIL';
      await application.save();

      failCount += 1;
    }
  }

  return {
    passCount,
    failCount,
    diffCount,
    totalCount,
    passButNotAppliedCount,
    firstHopePasserCount,
    secondHopePasserCount,
  };
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

export const updateApplicationMetaData = async () => {
  const recruitNumber = majorValue.recruitNumber;

  for (const [majorName, records] of Object.entries(recruitNumber)) {
    const major = await Major.findOne({ name: majorName });

    for (const [semester, recruitNumber] of Object.entries(records)) {
      console.log(majorName, semester, recruitNumber);

      const applications = await Application.find({
        $or: [{ applyMajor1: major!._id }, { applyMajor2: major!._id }],
        applySemester: semester,
      });
      const passedApplications = applications.filter(
        (application) => application.pnp === 'PASS',
      );
      const passedGPA = passedApplications.map((app) => app.applyGPA);
      let passedGPAavg = null,
        passedGPAmed = null,
        passedGPAmode = null,
        passedGPAmin = null;

      // 합격자들의 학점 통계값 계산
      if (passedGPA.length > 0) {
        // Mean (Average)
        passedGPAavg =
          passedGPA.reduce((sum, gpa) => sum + gpa, 0) / passedGPA.length;

        // Median
        const sortedGPAs = [...passedGPA].sort((a, b) => a - b);
        const midIdx = Math.floor(sortedGPAs.length / 2);
        passedGPAmed =
          sortedGPAs.length % 2 === 0
            ? (sortedGPAs[midIdx - 1] + sortedGPAs[midIdx]) / 2
            : sortedGPAs[midIdx];

        // Mode (Most frequent GPA)
        const frequencyMap: Record<number, number> = {};
        let maxFrequency = 0;

        for (const gpa of passedGPA) {
          frequencyMap[gpa] = (frequencyMap[gpa] || 0) + 1;
          if (frequencyMap[gpa] > maxFrequency) {
            maxFrequency = frequencyMap[gpa];
            passedGPAmode = gpa;
          }
        }

        // Min (Smallest GPA)
        passedGPAmin = Math.min(...passedGPA);
      }

      const applyMetaData = await ApplyMetaData.findOne({
        major: major!._id,
        semester: semester,
      });

      if (applyMetaData) {
        applyMetaData.expectedRecruitNumber = recruitNumber; // 과거 데이터는 예상 선발 인원이 없음
        applyMetaData.recruitNumber = recruitNumber;
        applyMetaData.appliedNumber = applications.length;
        applyMetaData.passedNumber = passedApplications.length;
        if (passedGPAavg) {
          applyMetaData.passedGPAavg = passedGPAavg;
        }
        if (passedGPAmed) {
          applyMetaData.passedGPAmed = passedGPAmed;
        }
        if (passedGPAmode) {
          applyMetaData.passedGPAmode = passedGPAmode;
        }
        if (passedGPAmin) {
          applyMetaData.passedGPAmin = passedGPAmin;
        }
        await applyMetaData.save();
      } else {
        await ApplyMetaData.create({
          major: major!._id,
          semester: semester,
          expectedRecruitNumber: recruitNumber,
          recruitNumber: recruitNumber,
          appliedNumber: applications.length,
          passedNumber: passedApplications.length,
          passedGPAavg: passedGPAavg,
          passedGPAmed: passedGPAmed,
          passedGPAmode: passedGPAmode,
          passedGPAmin: passedGPAmin,
        });
      }
    }

    // 마지막으로 이번 학기(2025-2) => 이후에는 자동화 파이프라인 만들어서
    const semester = '2025-2';
    const lastFourSemesters = ['2024-2', '2023-2', '2022-2', '2021-2'];

    const lastFourRecruitNum = lastFourSemesters.map((sem) => {
      return recruitNumber[majorName][sem];
    });

    lastFourRecruitNum.filter((num) => num !== 0);

    let expectedRecruitNumber;
    if (lastFourRecruitNum.length >= 4) {
      // 남은 데이터가 4개 이상일 때, 최대, 최소 제외하고 평균
      expectedRecruitNumber = Math.floor(
        lastFourRecruitNum
          .sort((a, b) => a - b)
          .slice(1, 3)
          .reduce((a, b) => a + b) / 2,
      );
    } else {
      // 남은 데이터가 4개 미만일 때, 평균값.
      expectedRecruitNumber = Math.floor(
        lastFourRecruitNum.reduce((a, b) => a + b) / lastFourRecruitNum.length,
      );
    }

    const applyMetaData = await ApplyMetaData.findOne({
      major: major!._id,
      semester: semester,
    });

    if (applyMetaData) {
      console.log(majorName, expectedRecruitNumber, 'found');
      applyMetaData.expectedRecruitNumber = expectedRecruitNumber;
      await applyMetaData.save();
    } else {
      console.log(majorName, 'not found');
      await ApplyMetaData.create({
        major: major!._id,
        semester: semester,
        expectedRecruitNumber: expectedRecruitNumber,
        appliedNumber: 0,
      });
    }
  }
};
