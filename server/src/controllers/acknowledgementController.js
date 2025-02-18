const sendMessageToQueue = require("../services/rabbitMQ/producer");
const acknowledgement = async (req, res) => {
  const { path, type } = req.body;

  if (!path) return res.status(400).json({ message: "path is required" });

  if (!type)
    return res.status(400).json({ message: "type of file is required" });

  if (type !== "sales" && type !== "purchases")
    return res.status(400).json({ message: "Invalid type" });

  const message = {
    fileName: path.split("/")[1],
    bucketName: path.split("/")[0],
    businessId: req.user.businessId,
    uploadedDate: new Date().toISOString(),
  };
  const err = await sendMessageToQueue(type, message);

  if (err)
    return res.status(500).json({ message: "could not send message to queue" });

  return res
    .status(200)
    .json({ message: "message sent to queue successfully" });
};

module.exports = acknowledgement;
