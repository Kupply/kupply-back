import { NextFunction, Request, Response } from 'express';
import * as postService from '../service/postService';
import { Types as MongooseTypes } from 'mongoose';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await postService.getAllPosts();
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
    const postData = req.body;
    const createdPost = await postService.createPost();
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