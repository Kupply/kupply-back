import { NextFunction, Request, Response } from 'express';
import * as messageService from '../service/messageService';
import mongoose from 'mongoose';

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const messages = await messageService.getAllMessages(userId);
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const getConversationBtwUsers =async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user1Id = new mongoose.Types.ObjectId(req.params.user1Id);
    const user2Id = new mongoose.Types.ObjectId(req.params.user2Id);
    const messages = await messageService.getConversationBtwUsers(user1Id, user2Id);
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messageData = req.body;
    const createdMessage = await messageService.createMessage(messageData);
    res.status(201).json(createdMessage);
  } catch (err) {
    next(err);
  }
};