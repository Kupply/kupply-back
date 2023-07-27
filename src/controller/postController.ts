import { NextFunction, Request, Response } from 'express';
import * as postService from '../service/postService';

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
    const createdPost = await postService.createPost(postData);
    res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
};