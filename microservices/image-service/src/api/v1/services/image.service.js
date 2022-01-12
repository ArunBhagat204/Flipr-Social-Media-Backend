const cloudinaryConfig = require("../../../config/cloudinary.config");
const bufferHandler = require("../helpers/bufferHandler");

const cloudinary = require("cloudinary");
cloudinary.config(cloudinaryConfig.props);

/**
 * Upload image to cloud storage
 * @param {Formdata Object} image Contains image buffer and metadata
 * @returns Success response with image-url or error response with message
 */

const uploadImage = async (image) => {
  try {
    const upload = async (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((res, err) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
        bufferHandler.bufferToStream(image.buffer).pipe(stream);
      });
    };
    const res = await upload(image.buffer);
    return {
      success: true,
      message: res.secure_url,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

/**
 * Deletes image from cloud storage
 * @param {string} imageId URI of the image which is to be deleted
 * @returns Success/Failure response along with associated message
 */

const deleteImage = async (imageId) => {
  try {
    const strArr = imageId.split("/");
    const id = strArr[strArr.length - 1].split(".")[0];
    const res = await cloudinary.uploader.destroy(id);
    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = { uploadImage, deleteImage };
