import { NextFunction, Request, Response } from 'express';
import * as postService from '../service/postService';
import { Types as MongooseTypes } from 'mongoose';
import { IUser } from '../models/userModel';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser; //유저 정보를 받아오도록 수정
    const currentPage = Number(req.query.page);
    const posts = await postService.getAllPosts(user, currentPage);
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
    const user = req.user as IUser;
    const { title, content, category } = req.body;
    const postData = {
      userId : user._id,
      title,
      content,
      category
    }
    const createdPost = await postService.createPost(postData);
    res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
};

export const deletePost =async (
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
}