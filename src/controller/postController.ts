import { NextFunction, Request, Response } from 'express';
import * as postService from '../service/postService';
import mongoose, { Types as MongooseTypes } from 'mongoose';
import { IUser } from '../models/userModel';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as mongoose.Types.ObjectId;
    const currentPage = Number(req.query.page);
    const posts = await postService.getAllPosts(userId, currentPage);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //body와 user 정보를 합쳐 post를 구성하는 정보를 service에 넘긴다.
    const userId = req.userId as mongoose.Types.ObjectId;
    const { title, content, category } = req.body;
    const postData = {
      userId,
      title,
      content,
      category,
    };
    const createdPost = await postService.createPost(postData);
    res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postId = new MongooseTypes.ObjectId(req.params.postId);
    const deletedPost = await postService.deletePost(postId);
    if (!deletedPost) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(deletedPost);
    }
  } catch (err) {
    next(err);
  }
};

export const reportPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as mongoose.Types.ObjectId;
    const { postId } = req.body;
    await postService.reportPost(userId, postId);

    res.status(200).json({
      status: 'success',
      message: '글이 성공적으로 신고 완료되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};
