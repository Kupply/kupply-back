import User from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import Application from '../models/applicationModel';
import * as s3 from '../utils/s3';
import * as semester from '../utils/semester';

export const updateApplication = async () => {
  // 포털에 올라오는 2024년도 2학기 이중전공자 합격자 명단은 2024년도 1학기에 이중 '지원'한 사람들 중 합격한 사람들이다.
  // 서비스 모의지원의 경우, 모의지원 데이터의 'applySemester'의 값이 2024-1인 사람들이다.
  // 이중전공자 합격자 명단이 올라와서 이 API를 호출하는 시점은 2024년도 1학기이다. (매년 7월, 1월에 합격자 명단이 발표될 때)
  // const currentSemester = semester.getCurrentSemester(); // 이중 '지원'한 학기, 합격자 명단이 올라온 학기, 서비스 데이터에 저장되는 학기
  const currentSemester = '2024-1'; // 이중 '지원'한 학기, 합격자 명단이 올라온 학기, 서비스 데이터에 저장되는 학기
  const nextSemester = semester.getNextSemester();
  // 이중 '진입'하는 학기, 포털에 올라오는 합격자 명단의 학기
  // => 합격자 명단의 파일 명을 쿠플라이 서비스에 맞춰 현재학기(= 지원한 학기)로 한다.

  // 모의지원자들 중 합격자 수, 불합격자(합격자 리스트에 없는 사람들) 수
  let passCount = 0,
    failCount = 0,
    totalCount = 0,
    passButNotAppliedCount = 0;
  let firstHopePasserCount = 0,
    secondHopePasserCount = 0;

  // 합격자 처리
  const passers = await s3.getJSONFromS3({
    Key: `passers/${currentSemester}.json`,
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
      continue;
    }

    if (application.applyMajor1.toString() === secondMajor._id.toString()) {
      firstHopePasserCount += 1;
    }
    if (application.applyMajor2!.toString() === secondMajor._id.toString()) {
      secondHopePasserCount += 1;
      console.log('Second Hope Passer\n', passer);
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
          hopeSemester: 1,
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
  // FIXME: 지금은 데이터 건들면 안 되니 주석 처리
  // const users = await User.find({ isApplied: true });

  // for (const user of users) {
  //   // 1. 사용자 모의 지원 정보 초기화
  //   user.isApplied = false;
  //   await user.save();

  //   // 2. 모의 지원 정보 불합격으로 변경
  //   const application = await Application.findOne({
  //     candidateId: user._id,
  //     applySemester: currentSemester,
  //   });

  //   application!.pnp = 'FAIL';
  //   failCount += 1;

  //   await application!.save();

  //   failCount += 1;
  // }

  return {
    passCount,
    failCount,
    totalCount,
    passButNotAppliedCount,
    firstHopePasserCount,
    secondHopePasserCount,
  };
};

export const updateTO = async () => {
  /*
  매년 6월 말에 그 해 1학기, 2학기 TO 정보가 업데이트된다.
  이 때 학기는 '지원학기' 기준.
  지원 정보를 업데이트할 때, 같이 돌린다고 가정(7월, 1월에)
  1월에는
  7월에는 1학기 to 정보 실제 to 값으로 업데이트 & 2학기 to 정보 추가
  */

  const currentSemester = semester.getCurrentSemester();
  let [year, onetwo] = currentSemester.split('-').map(Number);

  year = 2022;
  if (onetwo === 1) {
    /// 7월에 돌리는 중
    /// s3에서 1학기, 2학기 TO 정보를 가져온다.
    const TOs = await s3.getJSONFromS3({
      Key: `majorTO/${year}.json`,
    });

    console.log(TOs);
  } else {
    /// 1월에 돌리는 중
    /// DB에서 지난 3년간의 1학기 TO 정보를 가져온다.
  }
};
