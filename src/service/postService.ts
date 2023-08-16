import mongoose from 'mongoose';
import postModel from '../models/postModel';
import { IUser } from '../models/userModel';

export const getAllPosts = async (user : IUser, page : number) => {
  try {
    const itemsPerPage = 10;
    //최신순으로 pagination 된 데이터를 받아 온다.
    const posts = await postModel.find().skip(itemsPerPage * (page - 1)).limit(itemsPerPage).sort({'createdAt' : -1});
    return posts;
  } catch {
    console.error('error');
  }
};

export const createPost = async (postData: {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: string;
}) => {
  try {
    const newPost = new postModel(postData);
    const createdPost = await newPost.save();
    return createdPost;
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (postId: mongoose.Types.ObjectId) => {
  try {
    const deletePost = await postModel.findByIdAndDelete(postId);
    if (!deletePost) {
      throw new Error('No post found with the provided ID.');
    }
    return deletePost;
  } catch (error) {
    console.error(error);
  }
};
