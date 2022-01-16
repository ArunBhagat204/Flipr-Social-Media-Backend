const axios = require("axios");
const axiosConfig = require("../../../config/axios.config");
const imageService = require("../../../config/image.config");

/**
 * Invokes the image microservice to upload an image
 * @param {Object} image Contains image buffer and metadata
 * @returns URL of the uploaded image
 */

const uploadImage = async (image) => {
  try {
    const res = await axios.post(
      imageService.props.SERVICE_ROUTE,
      { buffer: image.buffer },
      axiosConfig.props(imageService.props.API_KEY)
    );
    return {
      success: true,
      message: res.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

/**
 * Invokes the image microservice to delete an image
 * @param {String} link URL of the uploaded image
 * @returns Success/Faiure response with appropriate message
 */

const deleteImage = async (link) => {
  try {
    const res = await axios.delete(
      imageService.props.SERVICE_ROUTE,
      { imageUrl: link },
      axiosConfig.props(imageService.props.API_KEY)
    );
    return {
      success: true,
      message: res.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = { uploadImage, deleteImage };
