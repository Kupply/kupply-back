export const getCurrentSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns month from 0-11

  if (month <= 8) {
    return `${year}_1`;
  } else {
    return `${year}_2`;
  }
};
