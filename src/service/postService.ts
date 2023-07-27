import mongoose from "mongoose";
import postModel from "../models/postModel";

const postData = {
  userId: new mongoose.Types.ObjectId,
  title: 'common asking', 
  content: 'do you have any license?',
  category: 'candidate',
};

export const getAllPosts = async () => {
  try {
    // DB에 저장된 모든 포스트 조회
    const posts = await postModel.find();
    return posts;
    } catch {
    console.log('error');
  }
};

export const createPost = async (postData: any) => {
  try {
    const newPost = new postModel(postData);
    const createdPost = await newPost.save();
    return createdPost;
  } catch (error) {
    console.error(error);
  }
};