export const getCurrentSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month >= 3 && month <= 8) {
    return `${year}-1`;
  } else if (month <= 2) {
    return `${year - 1}-2`;
  } else {
    return `${year}-2`;
  }
};

export const getNextSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month >= 3 && month <= 8) {
    return `${year}-2`;
  } else if (month <= 2) {
    return `${year}-1`;
  } else {
    return `${year + 1}-1`;
  }
};

export const getPrevSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month >= 3 && month <= 8) {
    return `${year - 1}-2`;
  } else if (month <= 2) {
    return `${year - 1}-1`;
  } else {
    return `${year}-1`;
  }
};
