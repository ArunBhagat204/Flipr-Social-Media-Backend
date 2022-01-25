const postModel = require("../models/post");
const commentModel = require("../models/comment");
const checkRelation = require("../helpers/check_relation");

/**
 * Fetch all comments of a particular post in a paginated manner
 * @param {String} curUser Username of the logged in user
 * @param {Object} queries Object containing all the user queries
 * @returns List of comments matching the user search queries
 */

const fetchComments = async (curUser, queries) => {
  try {
    const pageNumber = queries.pageQuery;
    const postQuery = queries.postId;
    const searchRes = await postModel.findById(postQuery, {
      _id: 0,
      author: 1,
      isPublic: 1,
      comments: { $skip: 5 * (pageNumber - 1), $limit: 5 },
    });
    const isBlocked = await checkRelation.block(searchRes.author, curUser);
    const isFriend = await checkRelation.friend(searchRes.author, curUser);
    if (isBlocked || (searchRes.isPublic === false && isFriend === false)) {
      return {
        success: false,
        message: "Forbidden to view comments of this post",
        statusCode: 403,
      };
    }
    return {
      success: true,
      content: searchRes.comments,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

/**
 * Fetch a particular comment and it's replies
 * @param {String} curUser Username of the logged in user
 * @param {String} commentId Id of the comment to be fetched
 * @returns Comment which was to be fetched
 */

const getComment = async (curUser, commentId) => {
  try {
    const comment = await postModel.findById(commentId);
    if (!comment) {
      return {
        success: false,
        message: "No such comment found",
        statusCode: 404,
      };
    }
    if (!comment.parent.isReply) {
      const parentPost = await postModel.findById(comment.parent.parent_id);
      const author = parentPost.author;
      if (
        (post.isPublic === false &&
          checkRelation.friend(author, curUser) == false) ||
        checkRelation.block(author, curUser)
      ) {
        return {
          success: false,
          message: "Forbidden to access this comment",
          statusCode: 403,
        };
      }
    }
    return {
      success: true,
      content: comment,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

/**
 * Create a new comment
 * @param {String} curUser Username of the logged in user
 * @param {String} parId Id of the comment's parent entity
 * @param {Object} content Object containing the new comment content
 * @returns Success/Failure response along with associated message
 */

const createComment = async (curUser, parId, content) => {
  try {
    if (!content.isReply) {
      const parentPost = await postModel.findById(parId);
      if (checkRelation.block(parentPost.author, curUser)) {
        return {
          success: false,
          message: "Post author has blocked you",
          statusCode: 403,
        };
      }
    }
    const comment = new commentModel({
      author: curUser,
      content: content.content,
      parent: {
        parentId: parId,
        isReply: content.isReply,
      },
    });
    const newComment = await comment.save();
    if (content.isReply) {
      await commentModel.findByIdAndUpdate(parId, {
        $push: { replies: newComment._id },
      });
    } else {
      await postModel.findByIdAndUpdate(parentId, {
        $push: { comments: newComment._id },
      });
    }
    return {
      success: true,
      message: "Comment created successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

/**
 * Edit a particular comment
 * @param {String} curUser Username of the logged in user
 * @param {String} commentId Id of the comment to be deleted
 * @param {Object} updatedContent Object containing the updated image content
 * @returns Success/Failure response along with associated message
 */

const editComment = async (curUser, commentId, updatedContent) => {
  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return {
        success: false,
        message: "No such comment found",
        statusCode: 404,
      };
    }
    if (comment.author != curUser) {
      return {
        success: false,
        message: "Not authorized to edit this comment",
        statusCode: 403,
      };
    }
    await commentModel.findByIdAndUpdate(commentId, {
      content: updatedContent.content,
    });
    return {
      success: true,
      message: "Comment updated successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

/**
 * Delete a particular comment
 * @param {String} curUser Username of the logged in user
 * @param {String} commentId Id of the comment to be deleted
 * @returns Success/Failure response along with associated message
 */

const deleteComment = async (curUser, commentId) => {
  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return {
        success: false,
        message: "No such comment found",
        statusCode: 404,
      };
    }
    if (comment.author != curUser) {
      return {
        success: false,
        message: "Not authorized to delete this comment",
        statusCode: 403,
      };
    }
    comment.replies.map(async (itr) => {
      const reply = await commentModel.findById(itr);
      deleteComment(itr, reply.author);
    });
    const parentId = comment.parent.parent_id;
    if (comment.parent.isReply) {
      await commentModel.findByIdAndUpdate(parentId, {
        $pull: { replies: comment._id },
      });
    } else {
      await postModel.findByIdAndUpdate(parentId, {
        $pull: { comments: comment._id },
      });
    }
    await commentModel.findByIdAndDelete(commentId);
    return {
      success: true,
      message: "Comment deleted successfully",
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
  fetchComments,
  getComment,
  createComment,
  editComment,
  deleteComment,
};
