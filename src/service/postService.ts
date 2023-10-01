import mongoose from 'mongoose';
import Post from '../models/postModel';
import User from '../models/userModel';
import Report from '../models/reportModel';

export const getAllPosts = async (
  userId: mongoose.Types.ObjectId,
  page: number,
) => {
  try {
    const itemsPerPage = 10;
    //최신순으로 pagination 된 데이터를 받아 온다.
    const posts = await Post.find()
      .skip(itemsPerPage * (page - 1))
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });
    return posts;
  } catch {
    console.error('error');
  }
};

export const createPost = async (postData: {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: string;
}) => {
  const user = await User.findById(postData.userId);

  if (user && user.totalReport >= 5) {
    throw {
      status: 401,
      message: '누적된 신고수로 글을 작성할 수 없는 사용자입니다.',
    };
  }

  const newPost = new Post(postData);
  const createdPost = await newPost.save();
  return createdPost;
};

export const deletePost = async (postId: mongoose.Types.ObjectId) => {
  try {
    const deletePost = await Post.findByIdAndDelete(postId);
    if (!deletePost) {
      throw new Error('No post found with the provided ID.');
    }
    return deletePost;
  } catch (error) {
    console.error(error);
  }
};

export const reportPost = async (
  userId: mongoose.Types.ObjectId,
  postId: string,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw { status: 400, message: '존재하지 않는 글입니다.' };
  }

  if (post.userId!.toString() === userId.toString()) {
    throw { status: 400, message: '본인의 글은 신고할 수 없습니다.' };
  }

  const report = await Report.findOne({
    reporter: userId,
    suspectPost: postId,
  });

  if (report) {
    throw { status: 400, message: '같은 글은 한번만 신고할 수 있습니다.' };
  }

  await Report.create({
    reporter: userId,
    suspectPost: postId,
  });

  post.totalReport += 1;

  if (post.totalReport >= 5) {
    // 신고 횟수가 5회 이상인 글은 유저에 기록하고 글 삭제.
    const suspect = await User.findById(post.userId);
    if (suspect) {
      // 유저가 탈퇴하거나 해서 사라졌더라도 글은 남아있을 수 있으니까?
      suspect.totalReport += 1;
      await suspect.save();
    }

    await Post.findByIdAndDelete(postId);
  } else {
    await post.save();
  }

  return;
};
