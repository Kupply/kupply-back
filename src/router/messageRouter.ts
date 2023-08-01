import express from 'express';
import * as messageController from '../controller/messageController';

const messageRouter = express.Router();

messageRouter.post('/', messageController.createMessage);
messageRouter.get('/:userId', messageController.getAllMessages);
messageRouter.get('/:user1Id/:user2Id', messageController.getConversationBtwUsers);


export default messageRouter;