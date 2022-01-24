const postModel = require("../models/post");
const userModel = require("../models/user");
const commentService = require("../services/comment.service");
const imageManager = require("../helpers/image_manager");
const checkRelation = require("../helpers/check_relation");

const searchPosts = async (curUser, queries) => {
  try {
    const pageNumber = queries.pageQuery;
    const posts = await postModel
      .find(
        {
          author: { $regex: queries.userQuery },
          title: { $regex: queries.titleQuery },
          hashtag: { $regex: queries.hashtagQuery },
        },
        {
          _id: 0,
          author: 1,
          title: 1,
          image: 1,
          content: 1,
          isPublic: 1,
          likes: 1,
          like_count: 1,
          comments: { $slice: 3 },
          tagged_users: 1,
          hashtags: 1,
        }
      )
      .sort({ "timestamps.updatedAt": "desc" })
      .skip(10 * (pageNumber - 1))
      .limit(10);
    posts.filter(async (post) => {
      const isBlocked = await checkRelation.block(post.author, curUser);
      const isFriend = await checkRelation.friend(post.author, curUser);
      if (isBlocked || (post.isPublic === false && isFriend === false)) {
        return false;
      }
      return true;
    });
    return {
      success: true,
      content: posts,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

const getPost = async (curUser, postId) => {
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "No such post found",
        statusCode: 404,
      };
    }
    if (post.isPublic === false) {
      const author = await userModel.findOne({ username: post.author });
      if (!checkRelation.friend(author, curUser)) {
        return {
          success: false,
          message: "User has restricted post to friends only",
          statusCode: 403,
        };
      }
    }
    return {
      success: true,
      content: post,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

const createPost = async (curUser, image, content) => {
  try {
    let imageLink = null;
    if (image) {
      const uploadRes = await imageManager.uploadImage(image);
      if (uploadRes.success == false) {
        throw new Error(uploadRes.message);
      }
      imageLink = uploadRes.message;
    }
    const post = new postModel({
      author: curUser,
      title: content.title,
      image: imageLink,
      content: content.content,
      isPublic: content.isPublic,
      tagged_users: content.tagged_users,
      hashtags: content.hashtags,
    });
    await post.save();
    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

const editPost = async (curUser, postId, updatedImage, updatedContent) => {
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "No such post found",
        statusCode: 404,
      };
    }
    if (post.author != curUser) {
      return {
        success: false,
        message: "Not authorized to edit this post",
        statusCode: 403,
      };
    }
    const newImageLink = await imageManager.uploadImage(updatedImage);
    if (newImageLink.success == false) {
      throw new Error(newImageLink.message);
    }
    await postModel.findByIdAndUpdate(postId, {
      title: updatedContent.title,
      content: updatedContent.content,
      image: newImageLink.message,
      isPublic: updatedContent.isPublic,
      tagged_users: updatedContent.tagged_users,
      hashtags: updatedContent.hashtags,
    });
    return {
      success: true,
      message: "Post updated successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

const deletePost = async (curUser, postId) => {
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "No such post found",
        statusCode: 404,
      };
    }
    if (post.author != curUser) {
      return {
        success: false,
        message: "Not authorized to delete this post",
        statusCode: 403,
      };
    }
    post.comments.map(async (itr) => {
      const comment = await postModel.findById(itr);
      commentService.deleteComment(comment.author, itr);
    });
    await postModel.findByIdAndDelete(postId);
    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

const likePost = async (curUser, postId) => {
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "No such post found",
        statusCode: 404,
      };
    }
    let alreadyLiked = false;
    post.likes.map(async (itr) => {
      if (itr === curUser) {
        alreadyLiked = true;
      }
    });
    if (alreadyLiked) {
      return {
        success: false,
        message: "Post is already liked",
        statusCode: 409,
      };
    }
    await postModel.findByIdAndUpdate(postId, { $push: { likes: curUser } });
    await postModel.findByIdAndUpdate(postId, { $inc: { like_count: 1 } });
    return {
      success: true,
      message: "Post liked successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

const unlikePost = async (curUser, postId) => {
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "No such post found",
        statusCode: 404,
      };
    }
    let alreadyLiked = false;
    post.likes.map(async (itr) => {
      if (itr === curUser) {
        alreadyLiked = true;
      }
    });
    if (!alreadyLiked) {
      return {
        success: false,
        message: "Post is not liked",
        statusCode: 409,
      };
    }
    await postModel.findByIdAndUpdate(postId, { $pull: { likes: curUser } });
    await postModel.findByIdAndUpdate(postId, { $inc: { like_count: -1 } });
    return {
      success: true,
      message: "Post unliked successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
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
