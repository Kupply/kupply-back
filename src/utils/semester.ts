export const getCurrentSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month <= 6) {
    return `${year}-1`;
  } else {
    return `${year}-2`;
  }
};

export const getNextSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month <= 6) {
    return `${year}-2`;
  } else {
    return `${year + 1}-1`;
  }
};

export const getPrevSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month <= 6) {
    return `${year - 1}-2`;
  } else {
    return `${year}-1`;
  }
};

export const getRecent4Semester = () => {
  const today = new Date();
  let currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // getMonth() returns 0-based month

  let currentSemester;
  if (currentMonth <= 6) {
    currentSemester = 1; // First semester (Spring)
  } else {
    currentSemester = 2; // Second semester (Fall)
  }

  const semesters = [];
  for (let i = 0; i < 4; i++) {
    // 지난 N 개 학기 수에 따라 i index 의 loop range 조정
    // Decrement the semester and year correctly
    if (currentSemester === 1) {
      currentSemester = 2;
      currentYear--;
    } else {
      currentSemester = 1;
    }

    const semesterString = `${currentYear}-${currentSemester}`;
    semesters.push(semesterString);
  }

  return semesters;
};
