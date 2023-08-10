import mongoose from 'mongoose';
import messageModel from '../models/messageModel';

export const getAllMessages = async (
  userId: mongoose.Types.ObjectId
) => {
  try {
    // 본인(user)이 받은 or 보낸 message 조회
    const messages = await messageModel.find({
      $or: [
        { sender: userId }, 
        { receiver: userId }
      ],
    });
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const getConversationBtwUsers = async (
  user1Id: mongoose.Types.ObjectId,
  user2Id: mongoose.Types.ObjectId
  ) => {
  try {
    // 두 명의 user가 주고 받은 message 조회
    const messages = await messageModel.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    }).sort('createdAt');
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const createMessage = async (messageData: {
  senderID: mongoose.Types.ObjectId;
  receiverID: mongoose.Types.ObjectId;
  content: string;
}) => {
  try {
    const newMessage = new messageModel(messageData);
    const createdMessage = await newMessage.save();
    return createdMessage;
  } catch (error) {
    console.error(error);
  }
};