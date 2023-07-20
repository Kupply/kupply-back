import User from '../models/User';

export const joinUser = async () => {
  try {
    var newUser = new User({
      name: 'Hong Gil Dong',
    });
    newUser.save();
    return;
  } catch {
    console.log('error');
  }
};
