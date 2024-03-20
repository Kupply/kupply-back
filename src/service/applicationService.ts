import { ObjectId, Types } from 'mongoose';
import Application from '../models/applicationModel';
import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import ApplyMetaData from '../models/applicationMetaDataModel';

type applyDataType = {
  candidateId: Types.ObjectId;
  pnp: string;
  applyMajor1: string | Types.ObjectId;
  applyMajor2: string | Types.ObjectId;
  applySemester: string;
  applyTimes: string;
  applyGPA: string;
  applyDescription: string;
  applyGrade: string;
};

type landingPageInputType = {
  userId: Types.ObjectId | null;
};

const currentSemester: string = '2024-1';
const prevSem = '2023-2';

type cardData = {
  name: string;
  passNum: number;
  avg: number;
  min: number;
};
export const getCardDatas = async () => {
  const result: cardData[] = [];

  const businessM = (await Major.findOne({ name: '경영학과' })) as IMajor;
  const business = await Application.find({
    applySemester: prevSem,
    applyMajor1: businessM._id,
    pnp: 'PASS',
  });
  let busAvg = 0,
    busMin = 4.5;
  business.forEach((item) => {
    if (item.pnp === 'PASS') {
      busAvg += item.applyGPA;
      busMin = Math.min(busMin, item.applyGPA);
    }
  });
  result.push({
    name: '경영대학 경영학과',
    passNum: business.length,
    avg: busAvg,
    min: busMin,
  });

  const computerM = (await Major.findOne({ name: '컴퓨터학과' })) as IMajor;
  const computer = await Application.find({
    applySemester: prevSem,
    applyMajor1: computerM._id,
    pnp: 'PASS',
  });
  let compAvg = 0,
    compMin = 4.5;
  computer.forEach((item) => {
    if (item.pnp === 'PASS') {
      compAvg += item.applyGPA;
      compMin = Math.min(compMin, item.applyGPA);
    }
  });
  result.push({
    name: '정보대학 컴퓨터학과',
    passNum: computer.length,
    avg: compAvg,
    min: compMin,
  });

  const psychoM = (await Major.findOne({ name: '심리학부' })) as IMajor;
  const psycho = await Application.find({
    applySemester: prevSem,
    applyMajor1: psychoM._id,
    pnp: 'PASS',
  });
  let psychoAvg = 0,
    psychoMin = 4.5;
  psycho.forEach((item) => {
    if (item.pnp === 'PASS') {
      psychoAvg += item.applyGPA;
      psychoMin = Math.min(psychoMin, item.applyGPA);
    }
  });
  result.push({
    name: '심리학부',
    passNum: psycho.length,
    avg: psychoAvg,
    min: psychoMin,
  });

  const economyM = (await Major.findOne({ name: '경제학과' })) as IMajor;
  const economy = await Application.find({
    applySemester: prevSem,
    applyMajor1: economyM._id,
    pnp: 'PASS',
  });
  let economyAvg = 0,
    economyMin = 4.5;
  economy.forEach((item) => {
    if (item.pnp === 'PASS') {
      economyAvg += item.applyGPA;
      economyMin = Math.min(economyMin, item.applyGPA);
    }
  });
  result.push({
    name: '정경대학 경제학과',
    passNum: economy.length,
    avg: economyAvg,
    min: economyMin,
  });

  const statsM = (await Major.findOne({ name: '통계학과' })) as IMajor;
  const stats = await Application.find({
    applySemester: prevSem,
    applyMajor1: statsM._id,
    pnp: 'PASS',
  });
  let statsAvg = 0,
    statsMin = 4.5;
  stats.forEach((item) => {
    if (item.pnp === 'PASS') {
      statsAvg += item.applyGPA;
      statsMin = Math.min(statsMin, item.applyGPA);
    }
  });
  result.push({
    name: '정경대학 통계학과',
    passNum: stats.length,
    avg: statsAvg,
    min: statsMin,
  });

  const mediaM = (await Major.findOne({ name: '미디어학부' })) as IMajor;
  const media = await Application.find({
    applySemester: prevSem,
    applyMajor1: mediaM._id,
    pnp: 'PASS',
  });
  let mediaAvg = 0,
    mediaMin = 4.5;
  media.forEach((item) => {
    if (item.pnp === 'PASS') {
      mediaAvg += item.applyGPA;
      mediaMin = Math.min(mediaMin, item.applyGPA);
    }
  });
  result.push({
    name: '미디어학부',
    passNum: media.length,
    avg: mediaAvg,
    min: mediaMin,
  });

  const sigjakyungM = (await Major.findOne({
    name: '식품자원경제학과',
  })) as IMajor;
  const sigjakyung = await Application.find({
    applySemester: prevSem,
    applyMajor1: sigjakyungM._id,
    pnp: 'PASS',
  });
  let sigjakyungAvg = 0,
    sigjakyungMin = 4.5;
  sigjakyung.forEach((item) => {
    if (item.pnp === 'PASS') {
      sigjakyungAvg += item.applyGPA;
      sigjakyungMin = Math.min(sigjakyungMin, item.applyGPA);
    }
  });
  result.push({
    name: '생명과학대학 식품자원경제학과',
    passNum: sigjakyung.length,
    avg: sigjakyungAvg,
    min: sigjakyungMin,
  });

  const mathematicsM = (await Major.findOne({ name: '수학과' })) as IMajor;
  const mathematics = await Application.find({
    applySemester: prevSem,
    applyMajor1: mathematicsM._id,
    pnp: 'PASS',
  });
  let mathematicsAvg = 0,
    mathematicsMin = 4.5;
  mathematics.forEach((item) => {
    if (item.pnp === 'PASS') {
      mathematicsAvg += item.applyGPA;
      mathematicsMin = Math.min(mathematicsMin, item.applyGPA);
    }
  });
  result.push({
    name: '이과대학 수학과',
    passNum: mathematics.length,
    avg: mathematicsAvg,
    min: mathematicsMin,
  });

  const chemistryM = (await Major.findOne({ name: '화학과' })) as IMajor;
  const chemistry = await Application.find({
    applySemester: prevSem,
    applyMajor1: chemistryM._id,
    pnp: 'PASS',
  });
  let chemistryAvg = 0,
    chemistryMin = 4.5;
  chemistry.forEach((item) => {
    if (item.pnp === 'PASS') {
      chemistryAvg += item.applyGPA;
      chemistryMin = Math.min(chemistryMin, item.applyGPA);
    }
  });
  result.push({
    name: '이과대학 화학과',
    passNum: chemistry.length,
    avg: chemistryAvg,
    min: chemistryMin,
  });

  const bioengM = (await Major.findOne({ name: '생명공학부' })) as IMajor;
  const bioeng = await Application.find({
    applySemester: prevSem,
    applyMajor1: bioengM._id,
    pnp: 'PASS',
  });
  let bioengAvg = 0,
    bioengMin = 4.5;
  bioeng.forEach((item) => {
    if (item.pnp === 'PASS') {
      bioengAvg += item.applyGPA;
      bioengMin = Math.min(bioengMin, item.applyGPA);
    }
  });
  result.push({
    name: '생명과학대학 생명공학부',
    passNum: bioeng.length,
    avg: bioengAvg,
    min: bioengMin,
  });

  const lifesciM = (await Major.findOne({ name: '생명과학부' })) as IMajor;
  const lifesci = await Application.find({
    applySemester: prevSem,
    applyMajor1: lifesciM._id,
    pnp: 'PASS',
  });
  let lifesciAvg = 0,
    lifesciMin = 4.5;
  lifesci.forEach((item) => {
    if (item.pnp === 'PASS') {
      lifesciAvg += item.applyGPA;
      lifesciMin = Math.min(lifesciMin, item.applyGPA);
    }
  });
  result.push({
    name: '생명과학대학 생명과학부',
    passNum: bioeng.length,
    avg: lifesciAvg,
    min: lifesciMin,
  });

  const politicalM = (await Major.findOne({ name: '정치외교학과' })) as IMajor;
  const political = await Application.find({
    applySemester: prevSem,
    applyMajor1: politicalM._id,
    pnp: 'PASS',
  });
  let politicalAvg = 0,
    politicalMin = 4.5;
  political.forEach((item) => {
    if (item.pnp === 'PASS') {
      politicalAvg += item.applyGPA;
      politicalMin = Math.min(politicalMin, item.applyGPA);
    }
  });
  result.push({
    name: '정경대학 정치외교학과',
    passNum: political.length,
    avg: politicalAvg,
    min: politicalMin,
  });

  const pubadminM = (await Major.findOne({ name: '행정학과' })) as IMajor;
  const pubadmin = await Application.find({
    applySemester: prevSem,
    applyMajor1: pubadminM._id,
    pnp: 'PASS',
  });
  let pubadminAvg = 0,
    pubadminMin = 4.5;
  pubadmin.forEach((item) => {
    if (item.pnp === 'PASS') {
      pubadminAvg += item.applyGPA;
      pubadminMin = Math.min(pubadminMin, item.applyGPA);
    }
  });
  result.push({
    name: '정경대학 행정학과',
    passNum: pubadmin.length,
    avg: pubadminAvg,
    min: pubadminMin,
  });

  const materialsM = (await Major.findOne({ name: '신소재공학부' })) as IMajor;
  const materials = await Application.find({
    applySemester: prevSem,
    applyMajor1: materialsM._id,
    pnp: 'PASS',
  });
  let materialsAvg = 0,
    materialsMin = 4.5;
  materials.forEach((item) => {
    if (item.pnp === 'PASS') {
      materialsAvg += item.applyGPA;
      materialsMin = Math.min(materialsMin, item.applyGPA);
    }
  });
  result.push({
    name: '공과대학 신소재공학부',
    passNum: materials.length,
    avg: materialsAvg,
    min: materialsMin,
  });

  const mechanicalM = (await Major.findOne({ name: '기계공학부' })) as IMajor;
  const mechanical = await Application.find({
    applySemester: prevSem,
    applyMajor1: mechanicalM._id,
    pnp: 'PASS',
  });
  let mechanicalAvg = 0,
    mechanicalMin = 4.5;
  mechanical.forEach((item) => {
    if (item.pnp === 'PASS') {
      mechanicalAvg += item.applyGPA;
      mechanicalMin = Math.min(mechanicalMin, item.applyGPA);
    }
  });
  result.push({
    name: '공과대학 기계공학부',
    passNum: mechanical.length,
    avg: mechanicalAvg,
    min: mechanicalMin,
  });

  const industrialM = (await Major.findOne({
    name: '산업경영공학부',
  })) as IMajor;
  const industrial = await Application.find({
    applySemester: prevSem,
    applyMajor1: industrialM._id,
    pnp: 'PASS',
  });
  let industrialAvg = 0,
    industrialMin = 4.5;
  industrial.forEach((item) => {
    if (item.pnp === 'PASS') {
      industrialAvg += item.applyGPA;
      industrialMin = Math.min(industrialMin, item.applyGPA);
    }
  });
  result.push({
    name: '공과대학 산업경영공학부',
    passNum: industrial.length,
    avg: industrialAvg,
    min: industrialMin,
  });

  const electricalM = (await Major.findOne({
    name: '전기전자공학부',
  })) as IMajor;
  const electrical = await Application.find({
    applySemester: prevSem,
    applyMajor1: electricalM._id,
    pnp: 'PASS',
  });
  let electricalAvg = 0,
    electricalMin = 4.5;
  electrical.forEach((item) => {
    if (item.pnp === 'PASS') {
      electricalAvg += item.applyGPA;
      electricalMin = Math.min(electricalMin, item.applyGPA);
    }
  });
  result.push({
    name: '공과대학 전기전자공학부',
    passNum: electrical.length,
    avg: electricalAvg,
    min: electricalMin,
  });

  const chembioM = (await Major.findOne({ name: '화공생명공학부' })) as IMajor;
  const chembio = await Application.find({
    applySemester: prevSem,
    applyMajor1: chembioM._id,
    pnp: 'PASS',
  });
  let chembioAvg = 0,
    chembioMin = 4.5;
  chembio.forEach((item) => {
    if (item.pnp === 'PASS') {
      chembioAvg += item.applyGPA;
      chembioMin = Math.min(chembioMin, item.applyGPA);
    }
  });
  result.push({
    name: '공과대학 화공생명공학부',
    passNum: chembio.length,
    avg: chembioAvg,
    min: chembioMin,
  });

  const datasciM = (await Major.findOne({ name: '데이터과학과' })) as IMajor;
  const datasci = await Application.find({
    applySemester: prevSem,
    applyMajor1: datasciM._id,
    pnp: 'PASS',
  });
  let datasciAvg = 0,
    datasciMin = 4.5;
  datasci.forEach((item) => {
    if (item.pnp === 'PASS') {
      datasciAvg += item.applyGPA;
      datasciMin = Math.min(datasciMin, item.applyGPA);
    }
  });
  result.push({
    name: '정보대학 데이터과학과',
    passNum: datasci.length,
    avg: datasciAvg,
    min: datasciMin,
  });

  const smartsecM = (await Major.findOne({ name: '스마트보안학부' })) as IMajor;
  const smartsec = await Application.find({
    applySemester: prevSem,
    applyMajor1: smartsecM._id,
    pnp: 'PASS',
  });
  let smartsecAvg = 0,
    smartsecMin = 4.5;
  smartsec.forEach((item) => {
    if (item.pnp === 'PASS') {
      smartsecAvg += item.applyGPA;
      smartsecMin = Math.min(smartsecMin, item.applyGPA);
    }
  });
  result.push({
    name: '스마트보안학부 스마트보안학부',
    passNum: smartsec.length,
    avg: smartsecAvg,
    min: smartsecMin,
  });

  return result;
};

export const createApplicationData = async (
  candidateId: Types.ObjectId,
  applyData: applyDataType,
) => {
  try {
    //유효성 검사를 위해 지원 데이터가 존재하는 유저의 것인지, 중복되는지 확인한다.
    const user = await User.findById(candidateId);
    if (!user) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    if (user.role === 'passer') {
      throw new Error('합격자는 모의지원 서비스를 이용할 수 없습니다.');
    }

    const isAlreadyExist = (
      await Application.find({
        candidateId: candidateId,
        applySemester: currentSemester,
      })
    ).length;

    if (isAlreadyExist > 0) {
      throw new Error('이미 해당 학기의 지원 정보가 있습니다.');
    } else {
      applyData.candidateId = candidateId;
      applyData.applySemester = currentSemester;

      const applyMajor1 = (await Major.findById(user.hopeMajor1)) as IMajor;
      applyData.applyMajor1 = applyMajor1._id;

      const applyMajor2 = (await Major.findById(user.hopeMajor2)) as IMajor;
      applyData.applyMajor2 = applyMajor2._id;

      const newApplication = new Application(applyData);
      await newApplication.save(); //DB에 application 데이터를 저장한다.

      //Metadata의 appliedNumber를 증가시킨다.
      const updateMetaData1 = await ApplyMetaData.findOne({
        semester: currentSemester,
        major: applyMajor1._id,
      });
      const updateMetaData2 = await ApplyMetaData.findOne({
        semester: currentSemester,
        major: applyMajor2._id,
      });

      if (updateMetaData1 && updateMetaData1.appliedNumber !== undefined) {
        updateMetaData1.appliedNumber++;
        await updateMetaData1.save();
      }
      if (updateMetaData2 && updateMetaData2.appliedNumber !== undefined) {
        updateMetaData2.appliedNumber++;
        await updateMetaData2.save();
      }

      user.isApplied = true;
      await user.save();

      return newApplication;
    }
  } catch (error) {
    throw error;
  }
};

export const getApplicationData = async (userId: Types.ObjectId) => {
  try {
    // user의 이번 학기 지원 데이터를 찾는다.
    const userApplyData = await Application.findOne({
      candidateId: userId,
      applySemester: currentSemester,
    });

    if (!userApplyData) {
      throw new Error('해당 사용자의 지원 데이터를 찾을 수 없습니다.');
    }

    //학점 데이터를 따로 빼서 저장함.
    const myGPA = userApplyData.applyGPA;

    // 지원 1지망이 user와 일치하는 모든 이번 학기 지원 데이터를 가져온다.
    const allApplyData = await Application.find({
      applyMajor1: userApplyData.applyMajor1,
      applySemester: userApplyData.applySemester,
    });

    // 지원 데이터 중 그래프에 필요한 정보만 추출한다.
    const returnApplyData = allApplyData.map((applyData) => ({
      applyGPA: applyData.applyGPA,
      applyMajor: applyData.applyMajor1,
      applyTimes: applyData.applyTimes,
      isPassed: applyData.pnp,
    }));

    // 재지원 횟수가 일치하는 정보를 따로 빼 놓는다.
    const returnApplyData_sameApplyTimes = returnApplyData.filter(
      (applyData) => applyData.applyTimes === userApplyData.applyTimes,
    );

    //평균, 최솟값의 통계를 계산한다.
    const applyGPAValues = returnApplyData.map((data) => data.applyGPA);

    const averageGPA =
      applyGPAValues.reduce((a, b) => a + b) / applyGPAValues.length;
    const minimumGPA = Math.min(...applyGPAValues);
    const numberOfData = applyGPAValues.length;

    // 학점을 정렬하여 중앙값과 현재 유저의 등수를 구한다.
    const sortedApplyGPAValues = applyGPAValues.sort((a, b) => b - a);
    const medianGPA =
      sortedApplyGPAValues[Math.floor(sortedApplyGPAValues.length / 2)];
    const myGPAIndex =
      sortedApplyGPAValues.findIndex((gpa) => gpa === myGPA) + 1;

    const applyGPAValues_sameApplyTimes = returnApplyData_sameApplyTimes.map(
      (data) => data.applyGPA,
    );

    const numberOfData_sameApplyTimes = applyGPAValues_sameApplyTimes.length;
    const averageGPA_sameApplyTimes =
      applyGPAValues_sameApplyTimes.reduce((a, b) => a + b) /
      applyGPAValues_sameApplyTimes.length;
    const minimumGPA_sameApplyTimes = Math.min(
      ...applyGPAValues_sameApplyTimes,
    );

    const sortedApplyGPAValues_sameApplyTimes =
      applyGPAValues_sameApplyTimes.sort((a, b) => b - a);
    const medianGPA_sameApplyTimes =
      sortedApplyGPAValues_sameApplyTimes[
        Math.floor(sortedApplyGPAValues_sameApplyTimes.length / 2)
      ];
    const myGPAIndex_sameApplyTimes =
      sortedApplyGPAValues_sameApplyTimes.findIndex((gpa) => gpa === myGPA) + 1;

    //데이터를 반환할 객체를 정의한다.
    const returnData = {
      userApplyData,
      overallData: {
        returnApplyData,
        numberOfData,
        averageGPA,
        minimumGPA,
        medianGPA,
        myGPAIndex,
      },
      sameApplyTimesData: {
        returnApplyData_sameApplyTimes,
        numberOfData_sameApplyTimes,
        averageGPA_sameApplyTimes,
        minimumGPA_sameApplyTimes,
        medianGPA_sameApplyTimes,
        myGPAIndex_sameApplyTimes,
      },
    };

    return returnData;
  } catch (error) {
    throw error;
  }
};

export const deleteApplicationData = async (userId: Types.ObjectId) => {
  try {
    const user = await Application.findOneAndDelete({
      candidateId: userId,
      applySemester: currentSemester,
    });

    if (!user) {
      throw { status: 404, message: 'User Application not found' };
    }

    //Metadata의 appliedNumber를 증가시킨다.
    const updateMetaData1 = await ApplyMetaData.findOne({
      semester: user.applySemester,
      major: user.applyMajor1,
    });
    const updateMetaData2 = await ApplyMetaData.findOne({
      semester: user.applySemester,
      major: user.applyMajor2,
    });

    if (updateMetaData1 && updateMetaData1.appliedNumber !== undefined) {
      updateMetaData1.appliedNumber--;
      await updateMetaData1.save();
    }
    if (updateMetaData2 && updateMetaData2.appliedNumber !== undefined) {
      updateMetaData2.appliedNumber--;
      await updateMetaData2.save();
    }

    return; //삭제 이후 삭제한 user 데이터를 보내 준다.
  } catch (error) {
    throw error;
  }
};

export const updateApplicationData = async (
  candidateId: Types.ObjectId,
  applyData: applyDataType,
) => {
  try {
    const { applySemester } = applyData; //applyData를 받아 온다.

    if (applySemester && applySemester !== currentSemester) {
      throw new Error('현재 학기가 아닌 지원 정보는 추가할 수 없습니다.');
    }

    let updateApplicationData = await Application.findOne({
      candidateId: candidateId,
      applySemester: currentSemester,
    });

    if (!updateApplicationData)
      throw new Error('해당 Application 정보가 없습니다.');

    const pastMajor1 = updateApplicationData.applyMajor1;
    const pastMajor2 = updateApplicationData.applyMajor2;

    if (applyData.applyMajor1) {
      const applyMajor1 = (await Major.findOne({
        name: applyData.applyMajor1,
      })) as IMajor;
      updateApplicationData.applyMajor1 = applyMajor1._id;
    }

    if (applyData.applyMajor2) {
      const applyMajor2 = (await Major.findOne({
        name: applyData.applyMajor2,
      })) as IMajor;
      updateApplicationData.applyMajor2 = applyMajor2._id;
    }

    updateApplicationData.save();

    //metadata의 appliednumber를 갱신한다.
    const deleteMetadata1 = await ApplyMetaData.findOne({
      semester: currentSemester,
      major: pastMajor1._id,
    });
    const deleteMetadata2 = pastMajor2
      ? await ApplyMetaData.findOne({
          semester: currentSemester,
          major: pastMajor2._id,
        })
      : undefined;

    if (deleteMetadata1 && deleteMetadata1.appliedNumber !== undefined) {
      deleteMetadata1.appliedNumber--;
      await deleteMetadata1.save();
    }
    if (deleteMetadata2 && deleteMetadata2.appliedNumber !== undefined) {
      deleteMetadata2.appliedNumber--;
      await deleteMetadata2.save();
    }

    const updateMetaData1 = await ApplyMetaData.findOne({
      semester: currentSemester,
      major: updateApplicationData.applyMajor1._id,
    });
    const updateMetaData2 = await ApplyMetaData.findOne(
      updateApplicationData.applyMajor2
        ? {
            semester: currentSemester,
            major: updateApplicationData.applyMajor2._id,
          }
        : undefined,
    );

    if (updateMetaData1 && updateMetaData1.appliedNumber !== undefined) {
      updateMetaData1.appliedNumber++;
      await updateMetaData1.save();
    }
    if (updateMetaData2 && updateMetaData2.appliedNumber !== undefined) {
      updateMetaData2.appliedNumber++;
      await updateMetaData2.save();
    }

    return updateApplicationData;
  } catch (error) {
    throw error;
  }
};

type FullChartType = {
  college: string;
  curApplyNum: number;
};

type HalfChartType = {
  stdIdYear: string;
  curApplyNum: number;
};

type ScatterChartType = {
  college: string;
  curApplyNum: number;
  curAccumGPA: number; // 누적 GPA => 프런트에서 지원자 수로 나눠서 사용.
};

type ReturnType = {
  curApplyNum: number;
  fullChartData: FullChartType[];
  halfChartData: HalfChartType[];
  scatterChartData: ScatterChartType[];
};

const majorList = [
  { value1: '경영학과', value2: '경영대학' },
  { value1: '국어국문학과', value2: '문과대학' },
  { value1: '철학과', value2: '문과대학' },
  { value1: '한국사학과', value2: '문과대학' },
  { value1: '사학과', value2: '문과대학' },
  { value1: '사회학과', value2: '문과대학' },
  { value1: '한문학과', value2: '문과대학' },
  { value1: '영어영문학과', value2: '문과대학' },
  { value1: '독어독문학과', value2: '문과대학' },
  { value1: '불어불문학과', value2: '문과대학' },
  { value1: '중어중문학과', value2: '문과대학' },
  { value1: '노어노문학과', value2: '문과대학' },
  { value1: '일어일문학과', value2: '문과대학' },
  { value1: '서어서문학과', value2: '문과대학' },
  { value1: '언어학과', value2: '문과대학' },
  { value1: '생명과학부', value2: '생명과학대학' },
  { value1: '생명공학부', value2: '생명과학대학' },
  { value1: '식품공학과', value2: '생명과학대학' },
  { value1: '환경생태공학부', value2: '생명과학대학' },
  { value1: '식품자원경제학과', value2: '생명과학대학' },
  { value1: '정치외교학과', value2: '정경대학' },
  { value1: '경제학과', value2: '정경대학' },
  { value1: '통계학과', value2: '정경대학' },
  { value1: '행정학과', value2: '정경대학' },
  { value1: '수학과', value2: '이과대학' },
  { value1: '물리학과', value2: '이과대학' },
  { value1: '화학과', value2: '이과대학' },
  { value1: '지구환경과학과', value2: '이과대학' },
  { value1: '화공생명공학과', value2: '공과대학' },
  { value1: '신소재공학부', value2: '공과대학' },
  { value1: '건축사회환경공학부', value2: '공과대학' },
  { value1: '건축학과', value2: '공과대학' },
  { value1: '기계공학부', value2: '공과대학' },
  { value1: '산업경영공학부', value2: '공과대학' },
  { value1: '전기전자공학부', value2: '공과대학' },
  { value1: '반도체공학과', value2: '공과대학' },
  { value1: '융합에너지공학과', value2: '공과대학' },
  { value1: '차세대통신학과', value2: '공과대학' },
  { value1: '의과대학', value2: '의과대학' },
  { value1: '교육학과', value2: '사범대학' },
  { value1: '국어교육과', value2: '사범대학' },
  { value1: '영어교육과', value2: '사범대학' },
  { value1: '지리교육과', value2: '사범대학' },
  { value1: '역사교육과', value2: '사범대학' },
  { value1: '가정교육과', value2: '사범대학' },
  { value1: '수학교육과', value2: '사범대학' },
  { value1: '체육교육과', value2: '사범대학' },
  { value1: '간호학과', value2: '간호대학' },
  { value1: '컴퓨터학과', value2: '정보대학' },
  { value1: '데이터과학과', value2: '정보대학' },
  { value1: '디자인조형학부', value2: '디자인조형학부' },
  { value1: '국제학부', value2: '국제대학' },
  { value1: '글로벌한국융합학부', value2: '국제대학' },
  { value1: '미디어학부', value2: '미디어학부' },
  { value1: '바이오의공학부', value2: '보건과학대학' },
  { value1: '바이오시스템의과학부', value2: '보건과학대학' },
  { value1: '보건환경융합과학부', value2: '보건과학대학' },
  { value1: '보건정책관리학부', value2: '보건과학대학' },
  { value1: '자유전공학부', value2: '자유전공학부' },
  { value1: '스마트보안학부', value2: '스마트보안학부' },
  { value1: '사이버국방학과', value2: '스마트보안학부' },
  { value1: '심리학부', value2: '심리학부' },
  { value1: '스마트모빌리티학부', value2: '스마트모빌리티학부' },
];

function getValue2ByValue1(value1: string) {
  const major = majorList.find((item) => item.value1 === value1);
  return major ? major.value2 : '';
}

export const hopeMajorsCurrentInfo = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const hopeMajor1 = (await Major.findById(user.hopeMajor1)) as IMajor;
  const hopeMajor2 = (await Major.findById(user.hopeMajor2)) as IMajor;

  const majorIds = [hopeMajor1._id, hopeMajor2._id];

  // 파이 차트 데이터 초기화
  const initFullChartMap1: Map<string, number> = new Map();

  // 산점도 차트 데이터 초기화
  const initScatterChartMap1: Map<
    string,
    { curApplyNum: number; curAccumGPA: number }
  > = new Map();

  for (const item of majorList) {
    const value2 = item.value2;
    if (!initFullChartMap1.has(value2)) {
      initFullChartMap1.set(value2, 0);
    }

    if (!initScatterChartMap1.has(value2)) {
      initScatterChartMap1.set(value2, { curApplyNum: 0, curAccumGPA: 0 });
    }
  }

  // 반 파이 차트 데이터 초기화
  const initHalfChartMap1: Map<string, number> = new Map();
  for (let stdIdYear = 23; stdIdYear >= 20; stdIdYear--) {
    initHalfChartMap1.set(stdIdYear.toString(), 0);
  }

  ////////////////////
  // 파이 차트 데이터 초기화
  const initFullChartMap2: Map<string, number> = new Map();

  // 산점도 차트 데이터 초기화
  const initScatterChartMap2: Map<
    string,
    { curApplyNum: number; curAccumGPA: number }
  > = new Map();

  for (const item of majorList) {
    const value2 = item.value2;
    if (!initFullChartMap2.has(value2)) {
      initFullChartMap2.set(value2, 0);
    }

    if (!initScatterChartMap2.has(value2)) {
      initScatterChartMap2.set(value2, { curApplyNum: 0, curAccumGPA: 0 });
    }
  }

  // 반 파이 차트 데이터 초기화
  const initHalfChartMap2: Map<string, number> = new Map();
  for (let stdIdYear = 23; stdIdYear >= 20; stdIdYear--) {
    initHalfChartMap2.set(stdIdYear.toString(), 0);
  }

  // init
  let returnDataMap = [
    {
      curApplyNum: 0,
      fullChartMap: initFullChartMap1,
      halfChartMap: initHalfChartMap1,
      scatterChartMap: initScatterChartMap1,
    },
    {
      curApplyNum: 0,
      fullChartMap: initFullChartMap2,
      halfChartMap: initHalfChartMap2,
      scatterChartMap: initScatterChartMap2,
    },
  ];

  for (let i = 0; i < 2; i++) {
    const majorId = majorIds[i];

    const applications = await Application.find({
      $or: [{ applyMajor1: majorId }, { applyMajor2: majorId }],
      applySemester: currentSemester,
    });

    if (!applications) continue;

    returnDataMap[i].curApplyNum = applications.length;

    for (const application of applications) {
      const user = await User.findById(application.candidateId);

      if (!user) continue;

      const firstMajor = (await Major.findById(user.firstMajor)) as IMajor;

      const firstMajorName = firstMajor.name;
      const collegeName = getValue2ByValue1(firstMajorName);

      returnDataMap[i].fullChartMap.set(
        collegeName,
        returnDataMap[i].fullChartMap.get(collegeName)! + 1,
      );

      returnDataMap[i].scatterChartMap.set(collegeName, {
        curApplyNum:
          returnDataMap[i].scatterChartMap.get(collegeName)!.curApplyNum + 1,
        curAccumGPA:
          returnDataMap[i].scatterChartMap.get(collegeName)!.curAccumGPA +
          application.applyGPA,
      });

      let studentIdYear: string;
      if (+user.studentId.substring(2, 4) <= 20) {
        studentIdYear = '20';
      } else {
        studentIdYear = user.studentId.substring(2, 4);
      }

      returnDataMap[i].halfChartMap.set(
        studentIdYear,
        returnDataMap[i].halfChartMap.get(studentIdYear)! + 1,
      );
    }
  }

  const fullChartArray1 = Array.from(
    returnDataMap[0].fullChartMap.entries(),
  ).map(([college, curApplyNum]) => ({
    college,
    curApplyNum,
  }));
  const fullChartArray2 = Array.from(
    returnDataMap[1].fullChartMap.entries(),
  ).map(([college, curApplyNum]) => ({
    college,
    curApplyNum,
  }));

  const halfChartArray1 = Array.from(
    returnDataMap[0].halfChartMap.entries(),
  ).map(([stdIdYear, curApplyNum]) => ({
    stdIdYear,
    curApplyNum,
  }));
  const halfChartArray2 = Array.from(
    returnDataMap[1].halfChartMap.entries(),
  ).map(([stdIdYear, curApplyNum]) => ({
    stdIdYear,
    curApplyNum,
  }));

  const scatterChartArray1 = Array.from(
    returnDataMap[0].scatterChartMap.entries(),
  ).map(([college, curInfo]) => ({
    college,
    curApplyNum: curInfo.curApplyNum,
    curAccumGPA: curInfo.curAccumGPA,
  }));
  const scatterChartArray2 = Array.from(
    returnDataMap[1].scatterChartMap.entries(),
  ).map(([college, curInfo]) => ({
    college,
    curApplyNum: curInfo.curApplyNum,
    curAccumGPA: curInfo.curAccumGPA,
  }));

  const returnData = [
    {
      curApplyNum: returnDataMap[0].curApplyNum,
      fullChartData: fullChartArray1,
      halfChartData: halfChartArray1,
      scatterChartData: scatterChartArray1,
    },
    {
      curApplyNum: returnDataMap[1].curApplyNum,
      fullChartData: fullChartArray2,
      halfChartData: halfChartArray2,
      scatterChartData: scatterChartArray2,
    },
  ];

  return returnData;
};

//landingPage의 표와 카드에 쓰이는 정보를 가져온다.
export const getLandingPageData = async (userId: Types.ObjectId | null) => {
  try {
    //이번 학기의 모든 metadata를 가져온다.
    let currentMetadata = await ApplyMetaData.find({
      semester: currentSemester,
    });

    let majorData = [];
    //각 전공에 해당하는 metadata의 정보를 취합한다.
    for (let i = 0; i < currentMetadata.length; i++) {
      const metadata = currentMetadata[i];
      const majordata = await Major.findById(metadata.major);
      const pastmetadata = await ApplyMetaData.findOne({
        major: metadata.major,
        semester: prevSem,
      });

      //데이터가 없을 경우 에러 처리
      if (!majordata) throw Error('major not found');
      if (!metadata) throw Error('metadata not found');
      if (metadata.appliedNumber === undefined)
        throw Error('empty past metadata');

      const userData = await User.findById(userId);

      let interestedNum = 0;
      if (userData) {
        if (userData.hopeMajor1 === metadata.major) {
          interestedNum = 1;
        } else if (userData.hopeMajor2 === metadata.major) {
          interestedNum = 2;
        }
      }

      const pastPassedApplications = await Application.find({
        pnp: 'PASS',
        applyMajor1: metadata.major,
        applySemester: prevSem,
      });

      const returndata = {
        rank: 0,
        secondMajor: majordata.name,
        engName: majordata.engName,
        pastRecruitNumber: pastmetadata?.recruitNumber,
        recruitNumber: metadata.recruitNumber,
        applyNumber: metadata.appliedNumber,
        competition: Number(
          (metadata.appliedNumber / metadata.recruitNumber).toFixed(2),
        ),
        pastCompetition:
          pastmetadata &&
          pastmetadata.appliedNumber &&
          pastmetadata.recruitNumber
            ? Number(
                (
                  pastmetadata.appliedNumber / pastmetadata.recruitNumber
                ).toFixed(2),
              )
            : 0,
        pastmean: pastmetadata?.passedGPAavg,
        pastmin: pastmetadata?.passedGPAmin,
        pastPassedNum: pastPassedApplications.length,
        interest: majordata.interest,
        interestedNum: interestedNum,
        imagesrc: majordata.imagesrc,
      };

      majorData.push(returndata);
    }

    //내림차순 정렬
    majorData.sort((a, b) => b.competition - a.competition);

    majorData.forEach((obj, index) => {
      obj.rank = index + 1;
    });

    return majorData;
  } catch (e) {
    throw e;
  }
};

export const myStage = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 400, message: 'User not found' };
  }

  const returnData: {
    applyNum: number;
    rank: number;
  }[] = [];

  const hopeMajors = [user.hopeMajor1, user.hopeMajor2];

  for (let i = 0; i < hopeMajors.length; i++) {
    const application = await Application.find({
      $or: [{ applyMajor1: hopeMajors[i] }, { applyMajor2: hopeMajors[i] }],
      applySemester: currentSemester,
    });

    const applicationGPAs = application.map((app) => app.applyGPA);
    const rank = applicationGPAs.filter((gpa) => gpa > user.curGPA).length + 1;

    returnData.push({ applyNum: applicationGPAs.length, rank: rank });
  }

  return returnData;
};
