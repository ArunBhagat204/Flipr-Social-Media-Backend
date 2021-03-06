const { Joi } = require("express-validation");

const postSearch = {
  query: Joi.object({
    username: Joi.string(),
    title: Joi.string(),
    hashtag: Joi.string(),
    page: Joi.number().required(),
  }),
};

const createPost = {
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string(),
    isPublic: Joi.boolean(),
    tagged_users: Joi.array().items(Joi.string()),
    hashtags: Joi.array().items(Joi.string()),
  }),
};

const editPost = {
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    isPublic: Joi.boolean().required(),
    tagged_users: Joi.array().items(Joi.string()).required(),
    hashtags: Joi.array().items(Joi.string()).required(),
  }),
};

const fetchComments = {
  query: Joi.object({
    postId: Joi.string().required(),
    page: Joi.number().required(),
  }),
};

const createComment = {
  body: Joi.object({
    content: Joi.string().required(),
    isReply: Joi.boolean().required(),
  }),
};

const editComment = {
  body: Joi.object({
    content: Joi.string().required(),
  }),
};

module.exports = {
  postSearch,
  createPost,
  editPost,
  fetchComments,
  createComment,
  editComment,
};
