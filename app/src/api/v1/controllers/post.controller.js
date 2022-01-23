const postService = require("../services/post.service");
const errorHandler = require("../helpers/error_handler");

const searchPosts = async (req, res) => {
  const result = await postService.searchPosts(req.userId, req.body.queries);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.status(200).json({
      success: true,
      posts: result.content,
    });
  }
};

const getPost = async (req, res) => {
  const result = await postService.getPost(req.userId, req.params.id);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json({
      success: true,
      post: result.content,
    });
  }
};

const createPost = async (req, res) => {
  const result = await postService.createPost(req.userId, req.file, req.body);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const editPost = async (req, res) => {
  const result = await postService.editPost(
    req.userId,
    req.params.id,
    req.file,
    req.body
  );
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const deletePost = async (req, res) => {
  const result = await postService.deletePost(req.userId, req.params.id);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const likePost = async (req, res) => {
  const result = await postService.likePost(req.userId, req.params.id);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const unlikePost = async (req, res) => {
  const result = await postService.unlikePost(req.userId, req.params.id);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

module.exports = {
  searchPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  likePost,
  unlikePost,
};
