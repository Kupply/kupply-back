import mongoose from "mongoose";
import postModel from "../models/postModel";

export const getAllPosts = async () => {
  try {
    // DB에 저장된 모든 포스트 조회
    const posts = await postModel.find();
    return posts;
    } catch {
    console.log('error');
  }
};

export const createPost = async () => {
  try {
    const newPost = new postModel({
      userId: '64c505f5a8620c1ed10d690c',
      category: "sample category2",
      title: "sample title2",
      content: "sample content2",
    });
    const createdPost = await newPost.save();
    return createdPost;
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (
  postId: mongoose.Types.ObjectId
) => {
  try {
    const deletePost = await postModel.findByIdAndDelete(postId);
    if (!deletePost) {
      throw new Error ('No post found with the provided ID.');
    }
    return deletePost;
  } catch (error) {
    console.error(error);
  }
}