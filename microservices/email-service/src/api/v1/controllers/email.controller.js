const sendService = require("../services/send.service");

const send = async (req, res) => {
  const result = await sendService.send(req.body);
  res.status(result.success === false ? 500 : 200).json(result);
};

module.exports = { send };
