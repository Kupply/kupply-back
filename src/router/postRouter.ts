import express from 'express';
import * as postController from '../controller/postController';

const postRouter = express.Router();

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getAllPosts);
postRouter.delete('/:postId', postController.deletePost);
postRouter.post('/reportPost', postController.reportPost);

export default postRouter;
