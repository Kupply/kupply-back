import express from 'express';
import * as messageController from '../controller/messageController';

const messageRouter = express.Router();

messageRouter.post('/', messageController.createMessage);
messageRouter.get('/', messageController.getAllMessages);
messageRouter.get('/:receiverNickname', messageController.getConversationBtwUsers);


export default messageRouter;