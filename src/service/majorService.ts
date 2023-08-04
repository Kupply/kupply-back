import Major, { IMajor } from '../models/majorModel';

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
