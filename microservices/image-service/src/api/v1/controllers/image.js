const imageService = require("../services/image");

const uploadImage = async (req, res) => {
  const result = await imageService.uploadImage(req.file);
  res.status(result.success === false ? 500 : 200).json(result);
};

const deleteImage = async (req, res) => {
  const result = await imageService.deleteImage(req.body.imageId);
  res.status(result.success === false ? 500 : 200).json(result);
};

module.exports = { uploadImage, deleteImage };
