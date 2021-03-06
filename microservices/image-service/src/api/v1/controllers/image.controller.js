const imageService = require("../services/image.service");

const uploadImage = async (req, res) => {
  const imageBuffer = req.file ? req.file : req.body;
  const result = await imageService.uploadImage(imageBuffer);
  res.status(result.success === false ? 500 : 200).json(result);
};

const deleteImage = async (req, res) => {
  console.log(req.body);
  const result = await imageService.deleteImage(req.body.imageUrl);
  res.status(result.success === false ? 500 : 200).json(result);
};

module.exports = { uploadImage, deleteImage };
