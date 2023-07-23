import { User, Major, Post, Message, Comment, Application } from '../models/Entity';
import { SECOND_DEPARTMENT } from '../models/Entity';

export const createUser = async (userData:any) => {
  try {
    const { email, student_id, gpa, application, wanna_sell, second_major, pass_semester } = userData;
    
    const newUser = new User({
      email,
      student_id,
      gpa,
      application,
      wanna_sell,
      second_major,
      pass_semester,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const createMajor = async (majorData:any) => {
  try {
    const { second_department } = majorData;

    if (!SECOND_DEPARTMENT.includes(second_department)) {
      throw new Error('Invalid major selected.');
    }

    const newMajor = new Major({
      second_department,
    });

    await newMajor.save();
    return newMajor;
  } catch (error) {
    console.error('Error creating major:', error);
    throw error;
  }
};

export const createApplication = async (applicationData:any) => {
  try {
    const { applied_major1, applied_major2 } = applicationData;

    if (!SECOND_DEPARTMENT.includes(applied_major1) || !SECOND_DEPARTMENT.includes(applied_major2)) {
      throw new Error('Invalid major selected.');
    }

    const newApplication = new Application({
      applied_major1,
      applied_major2,
    });

    await newApplication.save();
    return newApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const createPost = async (postData:any) => {
  try {
    const { user_id, title, content, date } = postData;
    
    const newPost = new Post({
      user_id,
      title,
      content,
      date,
    });

    await newPost.save();
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const createMessage = async (messageData:any) => {
  try {
    const { title, content, date } = messageData;

    const newMessage = new Message({
      title,
      content,
      date,
    });

    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error('Error creating Message:', error);
    throw error;
  }
};

export const createCommet = async (commentData:any) => {
  try {
    const { user_id, post_id, content, date } = commentData;

    const newCommet = new Comment({
      user_id,
      post_id,
      content,
      date,
    });

    await newCommet.save();
    return newCommet;
  } catch (error) {
    console.error('Error creating Commet:', error);
    throw error;
  }
};