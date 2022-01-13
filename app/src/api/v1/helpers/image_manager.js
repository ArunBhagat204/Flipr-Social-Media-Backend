const axios = require("axios");
const axiosConfig = require("../../../config/axios.config");
const imageService = require("../../../config/image.config");

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
