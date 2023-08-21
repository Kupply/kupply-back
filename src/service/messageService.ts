import mongoose from 'mongoose';
import messageModel from '../models/messageModel';
import User, { IUser } from '../models/userModel';

export const getAllMessages = async (
  userId: mongoose.Types.ObjectId,
  page: number,
) => {
  try {
    const itemsPerPage = 10;
    // 본인(user)이 받은 or 보낸 message 조회
    const messages = await messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .skip(itemsPerPage * (page - 1))
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const getConversationBtwUsers = async (
  senderId: mongoose.Types.ObjectId,
  receiverNickname: string,
  page: number,
) => {
  try {
    const receiver = await User.find({ nickname: receiverNickname });
    const receiverId = receiver[0]._id;
    const itemsPerPage = 10;
    const messages = await messageModel
      .find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
      .skip(itemsPerPage * (page - 1))
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const createMessage = async (messageData: {
  senderId: mongoose.Types.ObjectId;
  receiverNickname: string;
  content: string;
}) => {
  try {
    const receiver = await User.find({
      nickname: messageData.receiverNickname,
    });
    const newMessage = new messageModel({
      sender: messageData.senderId,
      receiver: receiver[0]._id,
      content: messageData.content,
    });
    const createdMessage = await newMessage.save();
    return createdMessage;
  } catch (error) {
    console.error(error);
  }
};
