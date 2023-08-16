import { NextFunction, Request, Response } from 'express';
import * as messageService from '../service/messageService';
import mongoose from 'mongoose';
import { IUser } from '../models/userModel';

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser;
    const currentPage = Number(req.query.page);
    const messages = await messageService.getAllMessages(user, currentPage);
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
    //sender는 로그인 정보로, receiver nickname을 parameter로 받아와서 service 단에 전달한다.
    const sender = req.user as IUser;
    const senderId = sender._id;
    const receiverNickname = req.params.receiverNickname;
    const currentPage = Number(req.query.page);
    const messages = await messageService.getConversationBtwUsers(senderId, receiverNickname, currentPage);
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
    //sender 정보는 로그인 정보로, receiver nickname과 content를 body로 받아와서 service에 전달한다.
    const sender = req.user as IUser;
    const { receiverNickname, content } = req.body;
    const messageData = {sender, receiverNickname, content};
    const createdMessage = await messageService.createMessage(messageData);
    res.status(201).json(createdMessage);
  } catch (err) {
    next(err);
  }
};